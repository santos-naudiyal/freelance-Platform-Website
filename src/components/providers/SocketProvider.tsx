"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  unreadCounts: Record<string, number>;
  clearUnread: (projectId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  unreadCounts: {},
  clearUnread: () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    
    console.log("🔌 Connecting to socket as user:", user.id);
    const socket = io(backendUrl, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('✅ Global Socket connected:', socket.id);
      socket.emit('join-user-room', user.id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ Global Socket disconnected');
    });

    // Global message listener for unread badges and notifications
    socket.on('notification', (data: any) => {
        if (data.type === 'message') {
            // Show toast
            toast(`💬 ${data.senderName}: ${data.text.substring(0, 50)}...`, {
                duration: 5000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                },
                onClick: () => {
                    router.push('/messages');
                }
            } as any);

            // Increment unread count for the project
            setUnreadCounts(prev => ({
                ...prev,
                [data.projectId]: (prev[data.projectId] || 0) + 1
            }));
        }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, router]);

  const clearUnread = useCallback((projectId: string) => {
    setUnreadCounts(prev => {
        if (!prev[projectId]) return prev; // Avoid unnecessary re-renders
        const next = { ...prev };
        delete next[projectId];
        return next;
    });
  }, []);

  const value = useMemo(() => ({
    socket: socketRef.current,
    connected,
    unreadCounts,
    clearUnread
  }), [connected, unreadCounts, clearUnread]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
