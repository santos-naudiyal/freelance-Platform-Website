"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { callBackend } from '@/lib/api';
import type { LucideIcon } from 'lucide-react';

type ActiveProject = {
  id: string;
  title: string;
  description?: string;
  deadline?: string | number | Date;
  budget?: {
    max?: number;
  };
};

type ProposalActivity = {
  status: string;
  createdAt: string | number | Date;
  projectTitle?: string;
};

type ApiStat = {
  name: string;
  value: string;
};

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function FreelancerDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [recentProposals, setRecentProposals] = useState<ProposalActivity[]>([]);
  const [stats, setStats] = useState([
    { name: 'Active Projects', value: '0', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { name: 'Proposals Sent', value: '0', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { name: 'Completed Jobs', value: '0', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Avg. Rating', value: '5.0', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const data = await callBackend("dashboard/freelancer");
        
        const dashboardData = data as {
          activeProjects?: ActiveProject[];
          proposals?: ProposalActivity[];
          stats?: ApiStat[];
        };

        setActiveProjects(dashboardData.activeProjects || []);
        setRecentProposals(dashboardData.proposals || []);

        const iconMap: Record<string, LucideIcon> = {
          'Active Projects': Briefcase,
          'Proposals Sent': FileText,
          'Completed Jobs': CheckCircle2,
          'Avg. Rating': CheckCircle2
        };

        const updatedStats = dashboardData.stats?.filter((s) => s.name !== 'Total Earnings').map((s) => ({
          ...s,
          icon: iconMap[s.name] || Briefcase,
          color: s.name === 'Completed Jobs' ? 'text-emerald-600' : 'text-primary-600',
          bg: s.name === 'Completed Jobs' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-primary-50 dark:bg-primary-900/20'
        })) || stats;

        setStats(updatedStats);
      } catch (err) {
        console.error('Failed to fetch freelancer dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Freelancer Dashboard">
        <div className="space-y-8 py-3 sm:space-y-10 sm:py-6">
          
          {/* WELCOME HEADER */}
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-5 text-white shadow-2xl sm:rounded-[3rem] sm:p-8 lg:p-10">
            <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-primary-600/20 blur-3xl rounded-full" />
            <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 w-full md:w-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-500/20 mb-2">
                <Sparkles size={12} />
                Global Freelancer Partner
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight break-words">
                Welcome back, {user?.name.split(' ')[0]}!
              </h2>
              <p className="text-slate-400 font-medium max-w-lg text-sm sm:text-base">
                Your portfolio is gaining traction. You have {activeProjects.length} projects in development.
              </p>
            </div>
            <Link href="/projects/browse" className="relative z-10 shrink-0 w-full md:w-auto">
              <Button className="h-14 w-full rounded-2xl bg-white px-6 text-sm font-black text-slate-900 shadow-xl transition-all hover:bg-white/90 sm:px-8 md:w-auto gap-3">
                <Briefcase size={20} />
                Explore Marketplace
                <ChevronRight size={18} className="hidden sm:block" />
              </Button>
            </Link>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all group shadow-soft relative overflow-hidden">
                {i === 2 && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-primary-500/10 text-primary-600 text-[8px] font-black uppercase tracking-widest border-none">Coming Soon</Badge>
                  </div>
                )}
                <CardContent className="p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.bg)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.name}</p>
                    <p className="text-3xl font-black text-slate-950 dark:text-white mt-1">
                      {i === 2 ? "Nexus" : stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* ACTIVE PROJECTS (2/3) */}
            <div className="lg:col-span-2 space-y-6">
               <div className="flex flex-col gap-2 px-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-black text-slate-950 dark:text-white flex items-center gap-3">
                     <Zap size={20} className="text-primary-500" />
                     Active Assignments
                  </h3>
                  <Link href="/freelancer/projects" className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700">View All Projects</Link>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {isLoading ? (
                     [1, 2].map(i => <Skeleton key={i} className="h-40 w-full rounded-3xl" />)
                  ) : activeProjects.length > 0 ? (
                    activeProjects.map((project) => (
                      <Card key={project.id} className="group hover:shadow-xl transition-all border-slate-100 dark:border-slate-800 overflow-hidden">
                         <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                               <div className="flex-1 p-6 sm:p-8 space-y-4">
                                  <div>
                                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">{project.title}</h4>
                                        <span className="w-fit px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-[10px] font-bold uppercase tracking-widest">In Development</span>
                                     </div>
                                     <p className="text-xs text-slate-500 line-clamp-2 font-medium">{project.description}</p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-6 pt-2">
                                     <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Deadline</p>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{new Date(project.deadline || Date.now() + 604800000).toLocaleDateString()}</p>
                                     </div>
                                     <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Investment</p>
                                        <p className="text-xs font-black text-emerald-600">₹{(project.budget?.max || 0).toLocaleString()}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="sm:w-48 bg-slate-50 dark:bg-slate-900/50 p-5 sm:p-8 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800">
                                  <Link href={`/freelancer/projects/${project.id}`} className="w-full">
                                     <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Open</Button>
                                  </Link>
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="py-20 text-center rounded-[2.5rem] bg-slate-50 dark:bg-slate-950/20 border-2 border-dashed border-slate-100 dark:border-slate-800">
                       <Briefcase size={40} className="text-slate-200 mx-auto mb-4" />
                       <h4 className="text-sm font-black text-slate-950 dark:text-white">No active projects</h4>
                       <p className="text-xs text-slate-500 mt-1">Start by bidding on projects in the marketplace.</p>
                       <Link href="/projects/browse" className="mt-6 inline-block">
                          <Button size="sm" className="rounded-xl font-bold">Search Proposals</Button>
                       </Link>
                    </div>
                  )}
               </div>
            </div>

            {/* RECENT PROPOSALS (1/3) */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-slate-950 dark:text-white flex items-center gap-3 px-2">
                  <FileText size={20} className="text-indigo-500" />
                  Recent Activity
               </h3>
               <div className="space-y-4">
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
                  ) : recentProposals.slice(0, 4).map((prop, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
                       <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                          prop.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 
                          prop.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                       )}>
                          {prop.status === 'accepted' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                       </div>
                       <div className="overflow-hidden">
                          <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">Proposal: {prop.projectTitle || 'AI Development'}</h5>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{prop.status} • {new Date(prop.createdAt).toLocaleDateString()}</p>
                       </div>
                       <ArrowUpRight size={14} className="ml-auto text-slate-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">View All Activity</Button>
               </div>
            </div>

          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
