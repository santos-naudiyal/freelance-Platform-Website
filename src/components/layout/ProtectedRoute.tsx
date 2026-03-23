"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader } from '../ui/Loader';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, setFreelancerDetails, setLoading, isLoading } = useAuthStore();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
      // Avoid redundant fetches if we already have the user profile
      if (user && user.email === firebaseUser.email) {
        setLoading(false);
        setAuthInitialized(true);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const resp = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
            createdAt: data.createdAt,
          });
          
          if (data.role === 'freelancer' && data.freelancerDetails) {
            setFreelancerDetails(data.freelancerDetails);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
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
      }
    });

    return () => unsubscribe();
  }, [setUser, setFreelancerDetails, setLoading, user]);

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
