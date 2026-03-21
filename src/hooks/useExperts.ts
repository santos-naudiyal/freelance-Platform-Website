"use client";

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, FreelancerProfile } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

export type ExpertWithProfile = User & { profile: FreelancerProfile };

export function useExperts(category?: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [experts, setExperts] = useState<ExpertWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;
    // In a real app, we'd query the 'users' collection where role == 'freelancer'
    // and join with the 'freelancer_profiles' collection.
    // For this hardened demo, we'll fetch from a dedicated 'experts' collection that flattened the data.
    const q = category 
      ? query(collection(db, 'experts'), where('skills', 'array-contains', category))
      : query(collection(db, 'experts'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expertList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setExperts(expertList);
      setLoading(false);
    }, (err) => {
      console.error('Expert fetch error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  return { experts, loading };
}
