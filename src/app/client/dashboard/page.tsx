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
  Settings,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { cn } from '../../../components/ui/Button';
import { callBackend } from '@/lib/api';
import type { LucideIcon } from 'lucide-react';

type DashboardProject = {
  id: string;
  title: string;
  createdAt: string | number | Date;
  budget?: {
    max?: number;
    amount?: number;
  };
};

type DashboardProposal = {
  id: string;
  projectTitle?: string;
  bidAmount?: number | string;
};

type ApiStat = {
  name: string;
  value: string;
};

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Users },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [recentProposals, setRecentProposals] = useState<DashboardProposal[]>([]);
  const [stats, setStats] = useState([
    { name: 'Open Projects', value: '0', icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { name: 'Proposals Received', value: '0', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { name: 'Active Hires', value: '0', icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Shortlisted Experts', value: '0', icon: Search, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const data = await callBackend("dashboard/client");
        const dashboardData = data as {
          projects?: DashboardProject[];
          recentProposals?: DashboardProposal[];
          stats?: ApiStat[];
        };

        setProjects(dashboardData.projects || []);
        setRecentProposals(dashboardData.recentProposals || []);

        const iconMap: Record<string, LucideIcon> = {
          'Open Projects': ClipboardList,
          'Proposals Received': Users,
          'Active Hires': ArrowUpRight,
          'Shortlisted Experts': Search
        };

        const updatedStats = (dashboardData.stats || []).filter((s) => s.name !== 'Total Spent').map((s) => ({
          ...s,
          icon: iconMap[s.name] || ClipboardList,
          color: s.name === 'Open Projects' ? 'text-indigo-600' : 
                 s.name === 'Proposals Received' ? 'text-primary-600' :
                 s.name === 'Active Hires' ? 'text-emerald-600' : 'text-rose-600',
          bg: s.name === 'Open Projects' ? 'bg-indigo-50 dark:bg-indigo-900/20' :
              s.name === 'Proposals Received' ? 'bg-primary-50 dark:bg-primary-900/20' :
              s.name === 'Active Hires' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'
        }));

        setStats(updatedStats);
      } catch (err) {
        console.error('Failed to fetch client dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Partner Dashboard">
        <div className="space-y-8 py-2 sm:space-y-10 sm:py-4">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0] || 'Partner'}</span>!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                Manage your projects, review incoming proposals, and collaborate with top-tier talent all in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/create-project" className="flex-1 md:flex-none">
                <Button className="w-full md:w-auto h-12 px-8 rounded-2xl gap-2 font-black shadow-xl shadow-primary-500/25">
                  <PlusSquare size={18} />
                  Post a Project
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <Card key={stat.name} className="group border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className={cn("p-3 rounded-2xl w-fit", stat.bg)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                        {stat.name}
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white leading-none">
                        {isLoading ? <Skeleton className="h-8 w-12" /> : stat.value}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Ongoing Projects */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <ClipboardList className="text-primary-500" />
                  Your Active Projects
                </h2>
                <Link href="/client/manage-projects">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                    See All Projects →
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)
                ) : projects.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <ClipboardList size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white">No active projects</h3>
                    <p className="text-slate-500 mt-1 max-w-xs mx-auto">Time to start something big! Post your project to find help.</p>
                  </div>
                ) : (
                  projects.slice(0, 3).map((project) => (
                    <Card key={project.id} className="group overflow-hidden border-slate-100 dark:border-slate-800 hover:shadow-soft transition-all duration-300">
                      <CardContent className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:p-8">
                        <div className="space-y-3 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                              Active
                            </Badge>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Created {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <h3 className="text-xl font-black text-slate-950 dark:text-white truncate">
                            {project.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                             <div className="flex items-center gap-2">
                               <div className="h-2 w-2 rounded-full bg-primary-500" />
                               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">${project.budget?.max || project.budget?.amount} Budget</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <Users size={14} className="text-slate-400" />
                               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">0 Applicants</span>
                             </div>
                          </div>
                        </div>
                        <div className="grid w-full shrink-0 gap-3 sm:flex sm:w-auto sm:items-center">
                          <Link href={`/client/manage-projects`} className="w-full sm:w-auto">
                            <Button variant="outline" className="h-10 w-full rounded-xl px-5 font-bold border-slate-200 dark:border-slate-800 sm:w-auto">
                              Details
                            </Button>
                          </Link>
                          <Link href={`/client/proposals?projectId=${project.id}`} className="w-full sm:w-auto">
                            <Button className="h-10 w-full rounded-xl px-5 font-bold sm:w-auto">
                              Proposals
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Quick Actions & Recent Activity */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Quick Actions Panel */}
              <Card className="border-none shadow-premium overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 text-slate-200/50 dark:text-white/5 group-hover:scale-125 transition-transform duration-700">
                  <LayoutDashboard size={120} />
                </div>
                <CardContent className="relative z-10 space-y-6 p-6 sm:p-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/create-project">
                       <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-900 dark:text-white transition-all text-left group border border-slate-100 dark:border-slate-800/50 shadow-sm">
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-colors">
                              <PlusSquare size={20} />
                           </div>
                           <span className="text-sm font-bold">Post a New Job</span>
                         </div>
                         <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary-500 transition-all" />
                       </button>
                    </Link>
                    <Link href="/freelancers/discover">
                       <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-900 dark:text-white transition-all text-left group border border-slate-100 dark:border-slate-800/50 shadow-sm">
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors">
                              <Search size={20} />
                           </div>
                           <span className="text-sm font-bold">Find Top Freelancers</span>
                         </div>
                         <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-all" />
                       </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Proposals Card */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">Recent Proposals</h3>
                <div className="space-y-3">
                  {isLoading ? (
                    Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
                  ) : recentProposals.length === 0 ? (
                    <p className="text-sm text-slate-500 font-medium italic">No recent proposals received.</p>
                  ) : (
                    recentProposals.slice(0, 4).map((proposal) => (
                      <div key={proposal.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/40 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                        <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                          <Users size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-950 dark:text-white truncate">
                            {proposal.projectTitle}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500">
                             Bid: ${proposal.bidAmount}
                          </p>
                        </div>
                        <Link href="/client/proposals">
                          <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors">
                            <ArrowUpRight size={16} />
                          </button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
