"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { Card, CardContent } from '../../../components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  CheckCircle2,
  Clock,
  Activity,
  Hexagon,
  Zap,
  PlayCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { auth } from '../../../lib/firebase';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function FreelancerProjectsPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
       if (!user || !auth.currentUser) return;

       try {
         const token = await auth.currentUser.getIdToken();
         const resp = await fetch('http://localhost:5000/api/proposals/my', {
           headers: { 'Authorization': `Bearer ${token}` }
         });
         
         if (resp.ok) {
           const data = await resp.json();
           const accepted = data.filter((p: any) => p.status === 'accepted');
           
           const mappedProjects = await Promise.all(accepted.map(async (p: any) => {
             try {
                const projResp = await fetch(`http://localhost:5000/api/projects/${p.projectId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (projResp.ok) {
                   const projData = await projResp.json();
                   return { ...p, projectTitle: projData.title };
                 }
                 return p;
              } catch (e) {
                 console.error(e);
                 return p;
              }
           }));
           
           setProjects(mappedProjects);
         }
       } catch (err) {
         console.error(err);
       } finally {
         setIsLoading(false);
       }
    };

    if (user) {
      fetchActive();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Active Projects">

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400">
                    Your Workspace
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-md font-medium">
                    Manage your ongoing contracts and deliver exceptional work.
                  </p>
                </div>
              </div>
            </div>
            {projects.length > 0 && (
              <Badge className="bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50 px-4 py-2 text-sm rounded-xl flex items-center gap-2 relative z-10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                {projects.length} Active {projects.length === 1 ? 'Contract' : 'Contracts'}
              </Badge>
            )}
            {/* Subtle background flair */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          </div>

          <div className="space-y-6">
             {isLoading ? (
               <div className="grid gap-6">
                 {[1, 2].map((i) => (
                    <div key={i} className="h-40 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 animate-pulse border border-slate-200/50 dark:border-slate-700/50"></div>
                 ))}
               </div>
             ) : projects.length === 0 ? (
               <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-16 text-center shadow-sm relative overflow-hidden group hover:border-primary-300 dark:hover:border-primary-700 transition-colors duration-500">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl group-hover:bg-primary-400/10 transition-colors duration-500"></div>
                 <div className="relative z-10">
                   <div className="mx-auto h-24 w-24 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-white/50 dark:border-slate-700/50 shadow-inner">
                      <Hexagon size={48} className="text-slate-300 dark:text-slate-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your workspace is empty</h3>
                   <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
                     You don't have any ongoing contracts right now. Explore the marketplace to find your next big opportunity.
                   </p>
                   <Link href="/projects/browse">
                     <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary-500/20 hover:-translate-y-1 transition-all duration-300 gap-2 font-semibold">
                       <Zap size={18} className="text-amber-400" />
                       Find Projects
                     </Button>
                   </Link>
                 </div>
               </div>
             ) : (
               <div className="grid gap-6">
                 {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-all duration-500 relative overflow-hidden group">
                       
                       {/* Abstract Background Element */}
                       <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl group-hover:bg-primary-200/50 dark:group-hover:bg-primary-900/20 transition-colors duration-700 pointer-events-none -mr-32 -mt-32"></div>

                       <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div className="flex gap-6 items-start flex-1 w-full">
                             <div className="shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner border border-white/60 dark:border-slate-600/50 group-hover:scale-105 transition-transform duration-500">
                                <PlayCircle size={32} className="opacity-80" />
                             </div>
                             
                             <div className="space-y-4 w-full">
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                     <h4 className="font-bold text-2xl text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                       {project.projectTitle}
                                     </h4>
                                   </div>
                                   <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 tracking-wide">
                                     <span className="uppercase text-[10px] tracking-wider font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-400">ID</span> 
                                     {project.id.slice(0, 8)}...
                                   </p>
                                </div>
                                
                                <div className="space-y-2 max-w-md">
                                  <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                      Project Alignment 
                                    </span>
                                    <span className="text-xs font-bold text-slate-500">20%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner flex">
                                     {/* Progress gradient */}
                                     <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-full w-[20%] rounded-full relative">
                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                     </div>
                                  </div>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex md:flex-col items-center justify-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-8 mt-2 md:mt-0 w-full md:w-auto">
                             <Link href={`/messages`} className="w-full">
                               <Button className="w-full gap-2 rounded-xl py-6 bg-slate-900 hover:bg-slate-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 border-0 shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                                  <MessageSquare size={18} /> Open Chat
                               </Button>
                             </Link>
                             <Link href={`/projects/browse/${project.projectId}`} className="w-full">
                                <Button variant="outline" className="w-full gap-2 rounded-xl py-6 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
                                  Details <ArrowRight size={16} />
                                </Button>
                             </Link>
                          </div>
                       </div>
                    </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
