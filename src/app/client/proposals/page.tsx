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
               <div className="grid grid-cols-1 gap-6">
                 {proposals.map((proposal) => (
                   <Card key={proposal.id} className="group border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 overflow-hidden relative">
                     {/* Color band indicator based on status */}
                     <div className={cn(
                       "absolute top-0 left-0 bottom-0 w-1.5",
                       proposal.status === 'pending' ? 'bg-amber-400' :
                       proposal.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-500'
                     )} />
                     
                     <CardContent className="p-8 sm:p-10 pl-12 flex flex-col lg:flex-row gap-8">
                       {/* Left Content Area */}
                       <div className="flex-1 space-y-5">
                          <div className="flex items-center justify-between lg:justify-start gap-4 flex-wrap">
                            <h4 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">
                              {proposal.projectTitle}
                            </h4>
                            <Badge className={cn(
                              "font-black tracking-widest uppercase text-[10px] px-3 py-1 rounded-full",
                              proposal.status === 'pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" :
                              proposal.status === 'accepted' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200" :
                              "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200"
                            )}>
                              {proposal.status}
                            </Badge>
                          </div>
                          
                          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                             <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                               <FileText size={14} /> 
                               Cover Letter
                             </div>
                             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                               {proposal.coverLetter}
                             </p>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm">
                             <div className="flex items-center gap-2 text-slate-500 font-bold">
                               <Clock size={16} className="text-slate-400" />
                               Received {new Date(proposal.createdAt).toLocaleDateString()}
                             </div>
                             {proposal.deliveryTime && (
                               <div className="flex items-center gap-2 text-slate-500 font-bold">
                                 <Clock size={16} className="text-slate-400" />
                                 Est. Delivery: {proposal.deliveryTime}
                               </div>
                             )}
                          </div>
                          
                          <div className="pt-4">
                             <Link href={`/freelancers/${proposal.freelancerId}`}>
                                <Button variant="outline" className="rounded-xl h-10 font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                                  View Freelancer Profile
                                </Button>
                             </Link>
                          </div>
                       </div>
                       
                       {/* Right Action Area */}
                       <div className="flex flex-col lg:items-end justify-between min-w-[240px] gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
                          <div className="text-left lg:text-right">
                             <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Bid Amount</p>
                             <p className="text-4xl font-black text-slate-950 dark:text-white">
                               ${(proposal.bidAmount || 0).toLocaleString()}
                             </p>
                          </div>
                          
                          {proposal.status === 'pending' ? (
                             <div className="flex flex-col gap-3 w-full">
                               <Button 
                                 onClick={() => handleStatusUpdate(proposal.id, 'accepted')}
                                 disabled={actionLoading === proposal.id}
                                 className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-black shadow-lg shadow-emerald-500/20"
                               >
                                 <CheckCircle2 size={18} />
                                 Accept Proposal
                               </Button>
                               <Button 
                                 onClick={() => handleStatusUpdate(proposal.id, 'rejected')}
                                 disabled={actionLoading === proposal.id}
                                 variant="outline"
                                 className="w-full h-12 rounded-xl gap-2 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-800"
                               >
                                 <XCircle size={18} />
                                 Decline
                               </Button>
                             </div>
                          ) : (
                             <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-center">
                                <p className="text-xs font-bold text-slate-500">
                                  Action taken on this bid.
                                </p>
                             </div>
                          )}
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
