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
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';
import { cn } from '../../../components/ui/Button';

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
  const [proposals, setProposals] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { name: 'Active Projects', value: '0', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { name: 'Proposals Sent', value: '0', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { name: 'Total Earnings', value: '$0', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Avg. Rating', value: '5.0', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const resp = await fetch('http://localhost:5000/api/proposals/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          setProposals(data);
          
          // Update stats based on real data
          setStats(prev => [
            { ...prev[0], value: data.filter((p: any) => p.status === 'accepted').length.toString() },
            { ...prev[1], value: data.length.toString() },
            prev[2], // Earnings will be added later
            prev[3]
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch freelancer dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Freelancer Dashboard">
        <div className="space-y-10">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                Welcome back, {user?.name || 'Partner'}!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {proposals.length > 0 ? `You have ${proposals.length} active proposals in review.` : "Start exploring new projects to grow your business."}
              </p>
            </div>
            <Link href="/projects/browse">
              <Button className="h-12 px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-primary-500/20">
                <Briefcase size={18} />
                Find New Work
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
            {/* Main Content Area - Active Proposals/Projects */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Recent Propoals</CardTitle>
                    <CardDescription>Status of your recently submitted bids</CardDescription>
                  </div>
                  <Link href="/freelancer/proposals">
                    <Button variant="ghost" size="sm" className="font-bold text-primary-600 hover:bg-primary-50">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-5">
                  {isLoading ? (
                    [1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-14 w-14 rounded-2xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-10 w-24 rounded-xl" />
                      </div>
                    ))
                  ) : proposals.length === 0 ? (
                    <div className="py-12 text-center space-y-4">
                       <p className="text-slate-500 font-medium">No active proposals found.</p>
                       <Link href="/projects/browse">
                          <Button variant="outline" className="rounded-xl">Browse Projects</Button>
                       </Link>
                    </div>
                  ) : (
                    proposals.slice(0, 3).map((proposal) => (
                      <div key={proposal.id} className="group flex items-center justify-between p-6 rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-slate-950 dark:text-white group-hover:text-primary-600 transition-colors">
                              {proposal.projectId} {/* In a real app, map project name */}
                            </h4>
                            <p className="text-sm text-slate-500 font-medium">Bid: ${proposal.bidAmount} • Sent on {new Date(proposal.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end mt-1">
                             <div className={cn(
                               "h-1.5 w-1.5 rounded-full animate-pulse",
                               proposal.status === 'accepted' ? 'bg-emerald-500' : proposal.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                             )} />
                             <p className={cn(
                               "text-xs font-bold uppercase tracking-wider",
                               proposal.status === 'accepted' ? 'text-emerald-600' : proposal.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
                             )}>{proposal.status}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content Area */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-slate-950 to-indigo-950 text-white overflow-hidden border-0">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/freelancer/profile" className="block w-full">
                    <Button variant="outline" className="w-full h-12 justify-start gap-4 rounded-2xl border-white/10 hover:bg-white/10 hover:text-white text-slate-300">
                      <Settings size={18} />
                      <span className="font-bold">Update Profile</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-12 justify-start gap-4 rounded-2xl border-white/10 hover:bg-white/10 hover:text-white text-slate-300">
                    <Plus size={18} />
                    <span className="font-bold">New Portfolio Item</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:border-primary-200">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-amber-500" />
                    <CardTitle className="text-xl">Recommended</CardTitle>
                  </div>
                  <CardDescription>Based on your stack</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors cursor-pointer group">
                     <h5 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">Build a Web3 Dashboard</h5>
                     <div className="flex gap-3">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider">React</span>
                        <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">$500-$1000</span>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
