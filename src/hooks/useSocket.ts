"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';

export function useSocket(workspaceId?: string) {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:5000";
    
    const socket = io(backendUrl, {
      transports: ['websocket'],
      auth: {
        token: user.id // or get token from firebase
      }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected:', socket.id);
      if (workspaceId) {
        socket.emit('join-workspace', workspaceId);
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user, workspaceId]);

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
    return () => socketRef.current?.off(event, callback);
  };

  return { socket: socketRef.current, connected, emit, on };
}
