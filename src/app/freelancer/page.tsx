"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FreelancerIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/freelancer/dashboard');
  }, [router]);

  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8 text-center text-slate-500 font-medium">Redirecting to dashboard...</div>;
}
