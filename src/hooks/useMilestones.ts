"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, limit } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

export function useMilestones(workspaceId: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !isInitialized || !isAuthenticated) return;

    setLoading(true);
    setMilestones([]); // ✅ reset on workspace change

    const q = query(
      collection(db, 'Milestones'),
      where('projectId', '==', workspaceId),
      orderBy('createdAt', 'asc'),
      limit(50) // ✅ safe limit (adjust if needed)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setMilestones(msList);
        setLoading(false);
      },
      (err) => {
        console.error('Milestones sync error:', err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe(); // ✅ proper cleanup
    };

  }, [workspaceId, isInitialized, isAuthenticated]);

  return { milestones, loading };
}
