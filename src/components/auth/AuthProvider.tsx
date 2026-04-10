"use client";

import { useEffect } from 'react';
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { clearTokenCache } from '@/lib/api';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setInitialized, setLoading, clearUser } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Failed to set auth persistence:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // ✅ Always clear the old cached JWT when any auth event fires.
          // This prevents User B from using User A's cached token.
          clearTokenCache();

          const userDoc = await getDoc(doc(db, 'Users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: data.role || 'client',
              avatar: data.avatar || firebaseUser.photoURL || undefined,
              createdAt: data.createdAt || Date.now(),
            });
          } else {
            // Fallback if no Firestore doc exists yet
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'client',
              avatar: firebaseUser.photoURL || undefined,
              createdAt: Date.now(),
            });
          }
        } catch (error) {
          console.error('Failed to hydrate auth profile:', error);
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: 'client',
            avatar: firebaseUser.photoURL || undefined,
            createdAt: Date.now(),
          });
        }
      } else {
        clearUser();
      }
      setInitialized(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setInitialized, setLoading, clearUser]);

  return <>{children}</>;
}
