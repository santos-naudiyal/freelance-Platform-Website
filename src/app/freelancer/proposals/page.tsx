"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, DollarSign, Settings, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';
import { auth } from '../../../lib/firebase';
import { useAuthStore } from '../../../store/useAuthStore';
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

export default function FreelancerProposalsPage() {
  const { user } = useAuthStore();
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!user || !auth.currentUser) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const resp = await fetch('http://localhost:5000/api/proposals/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) {
          const data = await resp.json();
          setProposals(data);
        }
      } catch (err) {
        console.error('Failed to fetch proposals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProposals();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="My Proposals">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white">
              My Proposals
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Track the status of your submitted bids here.
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle>Sent Proposals ({proposals.length})</CardTitle>
               <Link href="/projects/browse">
                  <Button size="sm">Browse More</Button>
               </Link>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                 <div className="py-12 text-center text-slate-500">Loading proposals...</div>
               ) : proposals.length === 0 ? (
                 <div className="py-12 text-center space-y-4">
                   <p className="text-slate-500 font-medium">You haven't submitted any proposals yet.</p>
                   <Link href="/projects/browse">
                      <Button variant="outline" className="rounded-xl">Browse Projects</Button>
                   </Link>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {proposals.map((proposal) => (
                      <div key={proposal.id} className="group flex items-center justify-between p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-slate-950 dark:text-white">
                              {proposal.projectTitle || 'Untitled Project'}
                            </h4>
                            <p className="text-sm text-slate-500 font-medium">
                              Bid: ${proposal.bidAmount} • Sent on {new Date(proposal.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                           <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                             <div className={cn(
                               "h-1.5 w-1.5 rounded-full animate-pulse",
                               proposal.status === 'accepted' ? 'bg-emerald-500' : proposal.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                             )} />
                             <p className={cn(
                               "text-[10px] font-bold uppercase tracking-wider",
                               proposal.status === 'accepted' ? 'text-emerald-600' : proposal.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
                             )}>{proposal.status}</p>
                           </div>
                           <Link href={`/projects/browse/${proposal.projectId}`}>
                              <Button variant="ghost" size="sm" className="text-xs h-8">View Project</Button>
                           </Link>
                        </div>
                      </div>
                   ))}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
