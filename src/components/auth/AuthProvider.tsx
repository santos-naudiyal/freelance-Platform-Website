"use client";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore if needed
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
          // Fallback if no doc exists yet
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
        setUser(null);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setInitialized]);

  return <>{children}</>;
}
