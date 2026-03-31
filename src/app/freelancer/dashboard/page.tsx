"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
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
  Sparkles,
  TrendingUp,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { callBackend } from '@/lib/api';
import { motion } from 'framer-motion';

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
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [recentProposals, setRecentProposals] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { name: 'Active Projects', value: '0', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { name: 'Proposals Sent', value: '0', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { name: 'Total Earnings', value: '₹0', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Avg. Rating', value: '5.0', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const data = await callBackend("dashboard/freelancer");
        
        setActiveProjects(data.activeProjects || []);
        setRecentProposals(data.proposals || []);

        const iconMap: Record<string, any> = {
          'Active Projects': Briefcase,
          'Proposals Sent': FileText,
          'Total Earnings': DollarSign,
          'Avg. Rating': CheckCircle2
        };

        const updatedStats = data.stats?.map((s: any) => ({
          ...s,
          icon: iconMap[s.name] || Briefcase,
          color: s.name === 'Total Earnings' ? 'text-emerald-600' : 'text-primary-600',
          bg: s.name === 'Total Earnings' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-primary-50 dark:bg-primary-900/20'
        })) || stats;

        setStats(updatedStats);
      } catch (err) {
        console.error('Failed to fetch freelancer dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Freelancer Dashboard">
        <div className="max-w-7xl mx-auto space-y-10 py-6">
          
          {/* WELCOME HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-primary-600/20 blur-3xl rounded-full" />
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-500/20 mb-2">
                <Sparkles size={12} />
                Global Freelancer Partner
              </div>
              <h2 className="text-4xl font-display font-black tracking-tight">
                Welcome back, {user?.name.split(' ')[0]}!
              </h2>
              <p className="text-slate-400 font-medium max-w-lg">
                Your portfolio is gaining traction. You have {activeProjects.length} projects in development.
              </p>
            </div>
            <Link href="/projects/browse" className="relative z-10 shrink-0">
              <Button className="h-14 px-8 rounded-2xl bg-white text-slate-900 hover:bg-white/90 font-black text-sm gap-3 shadow-xl transition-all">
                <Briefcase size={20} />
                Explore Marketplace
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all group shadow-soft">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start">
                    <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.bg)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                    {i === 2 && (
                       <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                          <TrendingUp size={12} />
                          +12.5%
                       </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.name}</p>
                    <p className="text-3xl font-black text-slate-950 dark:text-white mt-1">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* ACTIVE PROJECTS (2/3) */}
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center justify-between px-2">
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
                               <div className="flex-1 p-8 space-y-4">
                                  <div>
                                     <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white">{project.title}</h4>
                                        <span className="px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-[10px] font-bold uppercase tracking-widest">In Development</span>
                                     </div>
                                     <p className="text-xs text-slate-500 line-clamp-1 font-medium">{project.description}</p>
                                  </div>
                                  <div className="flex items-center gap-6 pt-2">
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
                               <div className="sm:w-48 bg-slate-50 dark:bg-slate-900/50 p-8 flex items-center justify-center border-l border-slate-100 dark:border-slate-800">
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
