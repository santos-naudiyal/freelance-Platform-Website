"use client";

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { callBackend } from '@/lib/api';

export function useChat(workspaceId: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !isInitialized || !isAuthenticated) return;

    const q = query(
      collection(db, 'Messages'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
    }, (err) => {
      console.error('Chat sync error:', err);
      setError('Failed to sync chat messages.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspaceId, isInitialized, isAuthenticated]);

  const sendMessage = async (text: string, senderId: string, senderName: string, type: 'user' | 'ai' = 'user') => {
    try {
      await callBackend('workspaces/messages', 'POST', {
        workspaceId,
        text,
        type
      });
    } catch (err) {
      console.error('Send message error:', err);
      throw new Error('Failed to send message.');
    }
  };

  return { messages, loading, error, sendMessage };
}
