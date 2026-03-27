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
  Activity,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';

import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Project } from '../../../types';
import { callBackend } from '../../../lib/api';

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
        // The backend /my endpoint already returns the user's projects
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);


  // Derive stats
  const activeCount = projects.filter(p => p.status === 'open').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Manage Projects">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <Briefcase size={22} />
                </div>
                <h2 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400">
                  Your Projects
                </h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                Manage your active listings, review proposals, and track project progress.
              </p>
            </div>
            <Link href="/create-project">
              <Button className="gap-2 rounded-full px-6 py-5 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium">
                <PlusSquare size={20} />
                Post New Project
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          {!isLoading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Open Projects</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
                </div>
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">In Progress</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{inProgressCount}</p>
                </div>
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Completed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* Projects List */}
          <div className="space-y-4">
            {isLoading ? (
               <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 animate-pulse border border-slate-200/50 dark:border-slate-700/50"></div>
                  ))}
               </div>
            ) : projects.length === 0 ? (
              <div className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl py-20 text-center px-4 transition-all hover:border-primary-300 dark:hover:border-primary-700">
                <div className="mx-auto h-24 w-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                   <Briefcase size={40} className="text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No projects posted yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
                  Ready to transform your ideas into reality? Create your first project to start hiring top global talent.
                </p>
                <Link href="/create-project">
                  <Button size="lg" className="rounded-full shadow-lg hover:-translate-y-1 transition-transform">
                    Post My First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {projects.map((project) => (
                  <Link href={`/client/manage-projects/${project.id}`} key={project.id} className="block group">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden">
                      {/* Subdued Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none dark:from-primary-900/10"></div>
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {project.title}
                            </h3>
                            <Badge 
                              variant={project.status === 'open' ? 'success' : project.status === 'in_progress' ? 'warning' : 'info'}
                              className="capitalize font-semibold tracking-wide"
                            >
                              {project.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm max-w-4xl leading-relaxed">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Clock size={12} className="text-slate-600 dark:text-slate-300" />
                              </div>
                              <span className="font-medium">Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <span className="text-slate-600 dark:text-slate-300 text-[10px] font-bold">$</span>
                              </div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                Budget: {project.budget ? `$${project.budget.min} - $${project.budget.max}` : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-slate-100 md:dark:border-slate-800 shrink-0">
                          <Button variant="outline" className="gap-2 rounded-full border-slate-200 dark:border-slate-700 group-hover:border-primary-500/50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            <Users size={16} />
                            View Proposals
                          </Button>
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

