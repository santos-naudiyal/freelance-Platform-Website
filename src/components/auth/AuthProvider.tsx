"use client";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { clearTokenCache } from '@/lib/api';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setInitialized, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
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
      } else {
        // ✅ Use logout() — which clears token cache + resets store state
        logout();
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setInitialized, logout]);

  return <>{children}</>;
}
