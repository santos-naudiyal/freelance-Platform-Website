"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Settings,
  MoreVertical,
  Users,
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../../../components/ui/Card';
import { Project } from '../../../types';
import { callBackend } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ManageProjectsPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        const data = await callBackend('projects/my');
        setProjects(data || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Derived stats
  const activeCount = projects.filter(p => p.status === 'in_progress').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const openCount = projects.filter(p => p.status === 'open').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Manage Projects">
        <div className="max-w-7xl mx-auto space-y-10 py-6">
          
          {/* Header & Stats Section */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                  My Projects
                </h1>
                <p className="text-slate-500 font-medium mt-1">Track and manage all your project postings in one place.</p>
              </div>
              <Link href="/create-project">
                <Button className="rounded-2xl h-14 px-8 font-black tracking-tight flex items-center gap-2 shadow-xl shadow-primary-500/20">
                  <Plus size={20} /> Post New Project
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Open for Bidding</p>
                    <p className="text-4xl font-display font-black text-slate-900 dark:text-white">{openCount}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Briefcase size={28} />
                  </div>
               </div>
               <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">In Progress</p>
                    <p className="text-4xl font-display font-black text-slate-900 dark:text-white">{activeCount}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <TrendingUp size={28} />
                  </div>
               </div>
               <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Completed</p>
                    <p className="text-4xl font-display font-black text-slate-900 dark:text-white">{completedCount}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
               </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800/50" />

          {/* Project List Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                All Project Postings
              </h2>
            </div>

            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />)}
               </div>
            ) : projects.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {projects.map((project) => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <Card className="group hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500 border-none bg-white dark:bg-slate-900/40">
                        <CardHeader className="flex flex-row items-start justify-between pb-4">
                          <div className="space-y-3">
                            <Badge variant={
                              project.status === 'open' ? 'info' : 
                              project.status === 'in_progress' ? 'warning' : 
                              project.status === 'completed' ? 'success' : 'default'
                            } className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                              {project.status.replace('_', ' ')}
                            </Badge>
                            <CardTitle className="group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                              {project.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                               <Clock size={14} /> Posted on {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                             <MoreVertical size={20} />
                          </button>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-center gap-6">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Budget</p>
                                <p className="text-lg font-display font-black text-slate-900 dark:text-white">
                                  ${(project.budget?.min ?? 0).toLocaleString()} - ${(project.budget?.max ?? 0).toLocaleString()}
                                </p>
                              </div>
                              <div className="h-10 w-px bg-slate-100 dark:border-slate-800" />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Type</p>
                                <p className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                  {project.budget?.type || 'FIXED'}
                                </p>
                              </div>
                           </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                           <Link href={`/client/manage-projects/${project.id}`} className="w-full">
                             <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-200 group-hover:border-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 flex items-center justify-center gap-2 font-bold transition-all">
                                {project.status === 'open' ? 'Review Proposals' : 'Manage Workspace'}
                                <ChevronRight size={16} />
                             </Button>
                           </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-8">
                 <div className="h-28 w-28 rounded-[2.5rem] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 rotate-6 group hover:rotate-0 transition-transform duration-500">
                    <Plus size={56} />
                 </div>
                 <div className="space-y-3 max-w-sm">
                   <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">No projects posted</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     Ready to find world-class talent? Start by posting your first project outcome.
                   </p>
                 </div>
                 <Link href="/create-project">
                   <Button className="rounded-2xl h-14 px-10 font-black tracking-tight shadow-xl shadow-primary-500/10">Post Your First Project</Button>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


