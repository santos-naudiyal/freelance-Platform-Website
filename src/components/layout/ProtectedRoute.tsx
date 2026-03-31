"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader } from '../ui/Loader';
import { callBackend } from '../../lib/api';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, setFreelancerDetails, setLoading, isLoading, isInitialized, setInitialized } = useAuthStore();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
      // ✅ Only skip if the SAME user is already initialized in the store
      // If a different user logged in, we must fetch their profile fresh.
      if (isInitialized && user && user.id === firebaseUser.uid) {
        setAuthInitialized(true);
        setLoading(false);
        return;
      }

      try {
        const data = await callBackend('users/profile');
        
        if (data) {
          console.log('User Profile Hydrated:', { role: data.role, email: data.email });
          setUser({
            ...data,
            freelancerDetails: undefined
          });
          
          if (data.role === 'freelancer' && data.freelancerDetails) {
            setFreelancerDetails(data.freelancerDetails);
          }
        }
      } catch (err: any) {
        if (err?.message?.includes('8')) {
          console.error('CRITICAL: Firestore Quota Exceeded (Error 8). Please check your Firebase billing plan.');
        } else {
          console.error('Failed to fetch user profile:', err);
        }
      } finally {
        setLoading(false);
        setAuthInitialized(true);
        setInitialized(true);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
        setFreelancerDetails(null);
        setLoading(false);
        setAuthInitialized(true);
        setInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [setUser, setFreelancerDetails, setLoading, setInitialized, isInitialized, user]);

  useEffect(() => {
    if (authInitialized && !isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role if they try to access a page they shouldn't
        if (user.role === 'freelancer') router.push('/freelancer/dashboard');
        else if (user.role === 'client') router.push('/client/dashboard');
        else router.push('/');
      }
    }
  }, [authInitialized, isLoading, user, router, pathname, allowedRoles]);

  if (isLoading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader size="xl" />
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
