"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { Card, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';
import { cn } from '../../../components/ui/Button';
import { callBackend } from '@/lib/api';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [recentProposals, setRecentProposals] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { name: 'Open Projects', value: '0', icon: ClipboardList, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { name: 'Proposals Received', value: '0', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { name: 'Active Hires', value: '0', icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Spent This Month', value: '$0', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const data = await callBackend("dashboard/client");

        setProjects(data.projects);
        setRecentProposals(data.recentProposals);

        const iconMap: Record<string, any> = {
          'Open Projects': ClipboardList,
          'Proposals Received': Users,
          'Active Hires': ArrowUpRight,
          'Total Spent': CreditCard
        };

        const updatedStats = data.stats.map((s: any) => ({
          ...s,
          icon: iconMap[s.name] || ClipboardList,
        }));

        setStats(updatedStats);

      } catch (err) {
        console.error('Failed to fetch client dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Client Dashboard">

        {/* Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-8 lg:space-y-10 text-slate-900 dark:text-white">

          {/* Welcome */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                Hello, {user?.name || 'Partner'}!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {projects.length > 0
                  ? `You have ${projects.length} active projects running.`
                  : "Post a project to start collaborating with top freelancers."}
              </p>
            </div>

            <Link href="/create-project">
              <Button className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-primary-500/20">
                <PlusSquare size={18} />
                Post a New Project
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <Card key={stat.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 sm:p-6 lg:p-7">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className={cn("p-3 rounded-xl", stat.bg)}>
                      <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        {stat.name}
                      </p>
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mt-1" />
                      ) : (
                        <p className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                          {stat.value}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-slate-900 dark:text-white">
              Your Open Projects
            </h3>

            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 lg:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl mb-3 bg-white dark:bg-slate-900"
              >
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  ${project.budget?.max || project.budget?.amount}
                </p>
              </div>
            ))}
          </div>

          {/* Proposals */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-slate-900 dark:text-white">
              Recent Proposals
            </h3>

            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : recentProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl mb-3 bg-white dark:bg-slate-900"
              >
                <p className="text-slate-900 dark:text-white font-medium">
                  {proposal.projectTitle}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  ${proposal.bidAmount}
                </p>
              </div>
            ))}
          </div>

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}
