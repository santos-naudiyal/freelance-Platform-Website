"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  User as UserIcon,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { callBackend } from '@/lib/api';
import { Project } from '@/types';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function FreelancerProjectsPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
       if (!user) return;

       try {
         const data = await callBackend('proposals/my');
         // Filter for accepted proposals which indicate active projects for the freelancer
         const acceptedProposals = (data || []).filter((p: any) => p.status === 'accepted');
         
         const mappedProjects = await Promise.all(
           acceptedProposals.map(async (proposal: any) => {
             try {
                return await callBackend(`projects/${proposal.projectId}`);
             } catch (err) {
                console.error(`Error fetching project ${proposal.projectId}:`, err);
                return null;
             }
           })
         );
         
         // Filter out any nulls from failed project fetches
         setProjects(mappedProjects.filter(p => p !== null));
       } catch (err) {
         console.error('Failed to fetch projects:', err);
       } finally {
         setIsLoading(false);
       }
    };

    if (user) {
      fetchActive();
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Active Projects">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-primary-600 font-bold tracking-wider uppercase text-xs mb-2">Workspace</p>
              <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                Projects you're working on
              </h2>
            </div>
            <Link href="/projects/browse">
              <Button variant="outline" className="group">
                <Briefcase size={18} className="mr-2 text-slate-400 group-hover:text-primary-500 transition-colors" />
                Browse More
              </Button>
            </Link>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex justify-between items-center pt-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {projects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <Card className="group relative overflow-hidden border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 rounded-3xl">
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600">
                          <ExternalLink size={16} />
                        </div>
                      </div>
                      
                      <CardContent className="p-8">
                        <div className="flex flex-col h-full gap-6">
                          <div className="space-y-3">
                            <Badge variant="info" className="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 border-none px-3 py-1 font-bold">
                              {(project as any).category || 'AI & Code'}
                            </Badge>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                              {project.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800/50">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</p>
                              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                                <span className="text-emerald-500 font-black">₹</span>
                                <span>{(project.budget?.max || 0).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                              <div className="flex items-center gap-1.5 font-bold text-amber-500">
                                <Clock size={14} />
                                <span>In Progress</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                                <UserIcon size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">Client</span>
                                <span className="text-[10px] text-slate-400 font-medium">ID: {project.clientId.slice(0, 8)}...</span>
                              </div>
                            </div>
                            <Link href={`/freelancer/projects/${project.id}`}>
                              <Button size="sm" variant="ghost" className="px-2 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20">
                                <ChevronRight size={20} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-8 rounded-[40px] bg-slate-50 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-6"
            >
              <div className="h-24 w-24 rounded-[32px] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 rotate-3">
                <Briefcase size={40} />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">No active projects yet</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Submit proposals to projects that match your skills and start your next journey.
                </p>
              </div>
              <Link href="/projects/browse">
                <Button className="rounded-2xl px-8 shadow-xl shadow-primary-500/20">
                  Browse Projects <ChevronRight size={18} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Quick Stats / Footer Info */}
          {!isLoading && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
               <div className="p-6 rounded-3xl bg-primary-600 text-white shadow-xl shadow-primary-500/20">
                  <div className="flex items-center justify-between mb-4">
                     <TrendingUp size={24} className="opacity-50" />
                     <Badge className="bg-white/20 text-white border-none text-[10px] font-black tracking-widest uppercase">Overview</Badge>
                  </div>
                  <p className="text-primary-100 text-sm font-bold uppercase tracking-widest mb-1">Total Active</p>
                  <h4 className="text-4xl font-display font-black tracking-tight">{projects.length}</h4>
               </div>
               {/* Placeholders for more stats */}
               {[1, 2, 3].map((i) => (
                 <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50">
                   <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800/50 mb-4 flex items-center justify-center text-slate-400">
                     {i === 1 ? <Briefcase size={20} /> : i === 2 ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                   </div>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                     {i === 1 ? 'Active Contracts' : i === 2 ? 'Completed' : 'Upcoming Deadlines'}
                   </p>
                   <h4 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                      {i === 1 ? projects.length : i === 2 ? '0' : 'None'}
                   </h4>
                 </div>
               ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cnLocal(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
