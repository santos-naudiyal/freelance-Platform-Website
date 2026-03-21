"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

export function useActivityFeed(workspaceId: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !isInitialized || !isAuthenticated) return;

    const q = query(
      collection(db, 'workspaces', workspaceId, 'activity'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activityList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivities(activityList);
      setLoading(false);
    }, (err) => {
      console.error('Activity sync error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspaceId]);

  return { activities, loading };
}
