"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Workspace } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

export function useWorkspace(workspaceId: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !isInitialized || !isAuthenticated) return;

    const docRef = doc(db, 'workspaces', workspaceId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setWorkspace({ id: docSnap.id, ...docSnap.data() } as Workspace);
      } else {
        setError('Workspace not found.');
      }
      setLoading(false);
    }, (err) => {
      console.error('Workspace sync error:', err);
      setError('Failed to sync workspace data.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspaceId]);

  return { workspace, loading, error };
}
