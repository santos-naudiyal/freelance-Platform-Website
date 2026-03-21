"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
import { auth } from '../../../lib/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
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
  Search,
  Sparkles,
  Clock,
  User
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';
import { cn } from '../../../components/ui/Button';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/client/post-project', icon: PlusSquare },
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
      try {
        const token = await auth.currentUser?.getIdToken();
        const resp = await fetch('http://localhost:5000/api/projects/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          setProjects(data);
          
          let totalProposalsCount = 0;
          let allProposals: any[] = [];
          
          // Fetch proposals for each project to show in the recent list
          for (const project of data) {
             try {
                const propResp = await fetch(`http://localhost:5000/api/proposals/project/${project.id}`, {
                   headers: { Authorization: `Bearer ${token}` }
                });
                if (propResp.ok) {
                   const props = await propResp.json();
                   totalProposalsCount += props.length;
                   // Add project info to proposal for display
                   const propsWithProject = props.map((p: any) => ({...p, projectTitle: project.title}));
                   allProposals = [...allProposals, ...propsWithProject];
                }
             } catch (e) {
                console.error("Failed to fetch proposals for project", project.id);
             }
          }

          // Sort by newest and take top 5
          allProposals.sort((a, b) => b.createdAt - a.createdAt);
          setRecentProposals(allProposals.slice(0, 5));
          
          // Update stats based on real data
          setStats(prev => [
            { ...prev[0], value: data.filter((p: any) => p.status === 'open').length.toString() },
            { ...prev[1], value: totalProposalsCount.toString() },
            { ...prev[2], value: data.filter((p: any) => p.status === 'in_progress').length.toString() },
            prev[3]
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch client dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Client Dashboard">
        <div className="space-y-10">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                Hello, {user?.name || 'Partner'}!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {projects.length > 0 ? `You have ${projects.length} active projects running.` : "Post a project to start collaborating with top freelancers."}
              </p>
            </div>
            <Link href="/client/post-project">
              <Button className="h-12 px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-primary-500/20">
                <PlusSquare size={18} />
                Post a New Project
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <Card key={stat.name} className="group hover:border-primary-200 dark:hover:border-primary-800">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className={cn("p-4 rounded-[1.25rem] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", stat.bg)}>
                      <stat.icon size={28} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                      {isLoading ? (
                        <Skeleton className="h-8 w-20 mt-1" />
                      ) : (
                        <p className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter mt-1">{stat.value}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Active Projects Area */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Your Open Projects</CardTitle>
                    <CardDescription>Manage active listings and evaluate talent</CardDescription>
                  </div>
                  <Link href="/client/manage-projects">
                    <Button variant="ghost" size="sm" className="font-bold text-primary-600">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-5">
                  {isLoading ? (
                    [1, 2].map((i) => (
                      <div key={i} className="flex flex-col gap-4 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))
                  ) : projects.length === 0 ? (
                    <div className="py-12 text-center space-y-4">
                       <p className="text-slate-500 font-medium">No active projects found.</p>
                       <Link href="/client/post-project">
                          <Button variant="outline" className="rounded-xl">Post a Project</Button>
                       </Link>
                    </div>
                  ) : (
                    projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-7 rounded-[2rem] border border-transparent hover:border-primary-100 dark:hover:border-primary-900 hover:bg-primary-50/10 transition-all cursor-pointer">
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-primary-600 transition-colors">
                            {project.title}
                          </h4>
                          <div className="flex items-center gap-5 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(project.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Users size={14} /> {project.proposalsCount || 0} Proposals</span>
                            <span className="text-emerald-600 font-bold">Budget: ${project.budget?.max || project.budget?.amount}</span>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-0">
                          <Link href={`/client/manage-projects/${project.id}`}>
                            <Button size="sm" variant="outline" className="rounded-full px-6 font-bold">Manage</Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content Area */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-primary-600 to-indigo-700 text-white overflow-hidden border-0 shadow-2xl shadow-primary-500/20">
                <CardContent className="p-10 space-y-6">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Sparkles size={28} className="text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Need expert advice?</h3>
                    <p className="text-primary-100 font-medium">
                      Talk to our project specialists to help you find the best talent.
                    </p>
                  </div>
                  <Button className="w-full h-12 bg-white text-primary-700 hover:bg-primary-50 font-bold rounded-xl">
                    Schedule a Call
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Proposals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                           <Skeleton className="h-4 w-20" />
                           <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))
                  ) : recentProposals.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-sm">
                      No proposals received yet.
                    </div>
                  ) : (
                    recentProposals.map((proposal) => (
                      <Link href={`/client/manage-projects/${proposal.projectId}`} key={proposal.id}>
                        <div className="group flex items-center gap-4 p-2 -mx-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer mb-2">
                          <div className="h-12 w-12 rounded-full border-2 border-primary-500/10 group-hover:border-primary-500/30 transition-all flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
                             {/* Placeholder for freelancer avatar since we only have freelancerId */}
                             <User size={20} className="text-slate-400" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-slate-950 dark:text-white truncate">Bid: ${proposal.bidAmount}</p>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider truncate">For {proposal.projectTitle}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full text-slate-400 group-hover:text-primary-600 shrink-0">
                            <ArrowUpRight size={18} />
                          </Button>
                        </div>
                      </Link>
                    ))
                  )}
                  <Link href="/client/manage-projects">
                    <Button variant="ghost" className="w-full text-sm font-bold text-primary-600 hover:bg-primary-50 mt-4">
                      View all proposals
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
