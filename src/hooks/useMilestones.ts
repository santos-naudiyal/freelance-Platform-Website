"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

export function useMilestones(workspaceId: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !isInitialized || !isAuthenticated) return;

    const q = query(
      collection(db, 'workspaces', workspaceId, 'milestones'),
      orderBy('order', 'asc') // Assuming an 'order' field exists
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMilestones(msList);
      setLoading(false);
    }, (err) => {
      console.error('Milestones sync error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspaceId]);

  return { milestones, loading };
}
