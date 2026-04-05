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
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Project } from '../../../types';
import { callBackend } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Search },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ManageProjectsPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

    if (user?.id) fetchProjects();
  }, [user?.id]);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = projects.filter(p => p.status === 'in_progress').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const openCount = projects.filter(p => p.status === 'open').length;

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Manage Projects">
        <div className="max-w-7xl mx-auto space-y-10 py-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight">My Projects</h1>

            <Link href="/create-project">
              <Button className="h-12 px-8 rounded-2xl gap-2 font-black shadow-xl shadow-primary-500/20">
                <Plus size={18} /> Post Project
              </Button>
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Open for Bids" value={openCount} icon={Briefcase} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
            <StatCard title="In Progress" value={activeCount} icon={TrendingUp} color="text-primary-600" bg="bg-primary-50 dark:bg-primary-900/20" />
            <StatCard title="Completed" value={completedCount} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" />
          </div>

          {/* SEARCH BAR */}
          <div className="relative group">
            <Input 
              placeholder="Search project by title or status..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={22} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />}
              className="h-16 rounded-[1.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-soft text-lg"
            />
          </div>

          {/* PROJECT LIST */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-48 w-full rounded-3xl" />
              <Skeleton className="h-48 w-full rounded-3xl" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div key={project.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                    <Card className="group hover:shadow-xl transition-all">

                      {/* HEADER */}
                      <CardHeader className="flex justify-between">
                        <div>
                          <Badge>
                            {project.status}
                          </Badge>
                          <CardTitle className="mt-2">
                            {project.title}
                          </CardTitle>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(project.createdAt).toDateString()}
                          </p>
                        </div>
                        <MoreVertical size={18} />
                      </CardHeader>

                      {/* CONTENT */}
                      <CardContent>
                        <p className="text-lg font-bold">
                          ₹{project.budget?.min} - ₹{project.budget?.max}
                        </p>
                      </CardContent>

                      {/* 🔥 ACTIONS (MAIN FIX) */}
                      <CardFooter className="flex gap-2">

                        {/* VIEW / PROPOSALS */}
                        <div className="flex gap-2 w-full">
                          <Link href={`/client/manage-projects/${project.id}`} className="flex-grow">
                            <Button variant="outline" className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white transition-all">
                              {project.status === 'open' ? 'Review Proposals' : 'View Details'}
                              <ChevronRight size={16} />
                            </Button>
                          </Link>

                          {project.status === 'in_progress' && (
                            <Link href={`/messages?projectId=${project.id}`}>
                              <Button className="h-12 w-12 rounded-xl bg-primary-600 text-white p-0 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                                <MessageSquare size={20} />
                              </Button>
                            </Link>
                          )}
                        </div>

                      </CardFooter>

                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p>No projects yet</p>
              <Link href="/create-project">
                <Button className="mt-4">Create Project</Button>
              </Link>
            </div>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl flex justify-between">
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon />
    </div>
  );
}