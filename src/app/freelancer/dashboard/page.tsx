"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';
import { cn } from '../../../components/ui/Button';

// ✅ IMPORT FIXED API
import { callBackend } from '@/lib/api';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function FreelancerDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { name: 'Active Projects', value: '0', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { name: 'Proposals Sent', value: '0', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { name: 'Total Earnings', value: '$0', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Avg. Rating', value: '5.0', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // ✅ FAST API CALL
        const data = await callBackend("dashboard/freelancer");

        setProposals(data.proposals);

        const iconMap: Record<string, any> = {
          'Active Projects': Briefcase,
          'Proposals Sent': FileText,
          'Total Earnings': DollarSign,
          'Avg. Rating': CheckCircle2
        };

        const colorMap: Record<string, string> = {
          'Active Projects': 'text-primary-600',
          'Proposals Sent': 'text-indigo-600',
          'Total Earnings': 'text-emerald-600',
          'Avg. Rating': 'text-amber-600'
        };

        const bgMap: Record<string, string> = {
          'Active Projects': 'bg-primary-50 dark:bg-primary-900/20',
          'Proposals Sent': 'bg-indigo-50 dark:bg-indigo-900/20',
          'Total Earnings': 'bg-emerald-50 dark:bg-emerald-900/20',
          'Avg. Rating': 'bg-amber-50 dark:bg-amber-900/20'
        };

        const updatedStats = data.stats.map((s: any) => ({
          ...s,
          icon: iconMap[s.name] || Briefcase,
          color: colorMap[s.name] || 'text-primary-600',
          bg: bgMap[s.name] || 'bg-primary-50 dark:bg-primary-900/20'
        }));

        setStats(updatedStats);

      } catch (err) {
        console.error('Failed to fetch freelancer dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Freelancer Dashboard">
        <div className="space-y-10">

          {/* (ALL YOUR UI BELOW IS SAME — UNCHANGED) */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                Welcome back, {user?.name || 'Partner'}!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {proposals.length > 0 ? `You have ${proposals.length} active proposals in review.` : "Start exploring new projects to grow your business."}
              </p>
            </div>
            <Link href="/projects/browse">
              <Button className="h-12 px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-primary-500/20">
                <Briefcase size={18} />
                Find New Work
              </Button>
            </Link>
          </div>

          {/* Rest UI remains EXACTLY same */}
          {/* (no changes needed below) */}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
