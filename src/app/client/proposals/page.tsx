"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { callBackend } from '@/lib/api';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Settings,
  MailOpen
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Users },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ClientProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await callBackend('proposals/client');
        setProposals(data);
      } catch (err) {
        console.error('Failed to fetch proposals:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 500); // brief delay for smoothness
      }
    };
    fetchProposals();
  }, []);

  const handleStatusUpdate = async (proposalId: string, newStatus: string) => {
    setActionLoading(proposalId);
    try {
      await callBackend(`proposals/${proposalId}/status`, 'PATCH', { status: newStatus });
      
      // Update local state without full refetch
      setProposals(prev => prev.map(p => 
        p.id === proposalId ? { ...p, status: newStatus } : p
      ));
      
      alert(`Proposal successfully ${newStatus}!`);
    } catch (err: any) {
      console.error('Action Failed:', err);
      alert(err.message || 'Failed to update proposal status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Review Proposals">
        <div className="max-w-7xl mx-auto space-y-10 py-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-800/50">
                   <MailOpen size={12} />
                   Incoming Bids
                </div>
                <h2 className="text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                   Review <span className="text-indigo-600">Proposals</span>
                </h2>
             </div>
             <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
                <div className="px-4 py-2 border-r border-slate-100 dark:border-slate-800">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{proposals.length}</p>
                </div>
                <div className="px-4 py-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pending</p>
                   <p className="text-lg font-black text-amber-600 leading-none">
                     {proposals.filter(p => p.status === 'pending').length}
                   </p>
                </div>
             </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
               [1, 2, 3].map((i) => (
                 <Card key={i} className="p-8 border-transparent">
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                       <Skeleton className="h-8 w-1/3" />
                       <Skeleton className="h-8 w-24 rounded-full" />
                     </div>
                     <Skeleton className="h-20 w-full" />
                     <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 w-32 rounded-xl" />
                        <Skeleton className="h-12 w-32 rounded-xl" />
                     </div>
                   </div>
                 </Card>
               ))
            ) : proposals.length === 0 ? (
               <div className="py-32 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-950/20">
                 <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6">
                    <FileText size={32} className="text-slate-300" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-2">No Proposals Yet</h3>
                 <p className="text-slate-500 font-medium">When freelancers bid on your projects, they will appear here.</p>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {proposals.map((proposal) => (
                    <Link key={proposal.id} href={`/client/proposals/${proposal.id}`} className="group">
                      <Card className="h-full border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden relative flex flex-col">
                        {/* Decorative status indicator */}
                        <div className={cn(
                          "absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-110",
                          proposal.status === 'pending' ? 'bg-amber-500' :
                          proposal.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-500'
                        )} />
                        
                        <CardContent className="p-8 pb-6 flex-1 flex flex-col justify-between space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                               <Badge className={cn(
                                 "font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border",
                                 proposal.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800" :
                                 proposal.status === 'accepted' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800" :
                                 "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800"
                               )}>
                                 {proposal.status}
                               </Badge>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 {new Date(proposal.createdAt).toLocaleDateString()}
                               </p>
                            </div>

                            <div className="space-y-2">
                               <h4 className="text-xl font-black text-slate-950 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">
                                 {proposal.projectTitle}
                               </h4>
                               <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                 By {proposal.freelancerName || 'Elite Freelancer'}
                               </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-6 mt-auto border-t border-slate-100 dark:border-slate-800/50">
                             <div className="space-y-1">
                               <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Bid</p>
                               <p className="text-2xl font-black text-slate-950 dark:text-white">
                                 ${(proposal.bidAmount || 0).toLocaleString()}
                               </p>
                             </div>
                             <div className="space-y-1 text-right">
                               <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Timeline</p>
                               <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                 {proposal.deliveryTime || 'TBD'}
                               </p>
                             </div>
                          </div>
                        </CardContent>
                        
                        <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between group-hover:bg-indigo-50/50 transition-colors">
                           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">View Proposal</span>
                           <Search size={14} className="text-indigo-600" />
                        </div>
                      </Card>
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
