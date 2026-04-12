"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
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
  Settings,
  ArrowLeft,
  Calendar,
  Briefcase
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Users },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

type ProposalStatus = 'pending' | 'accepted' | 'rejected';

interface ProposalDetail {
  id: string;
  projectTitle?: string;
  freelancerId: string;
  status: ProposalStatus;
  createdAt: string | number | Date;
  deliveryTime?: string;
  estimatedDuration?: string;
  coverLetter?: string;
  bidAmount?: number;
  rate?: number;
}

export default function ProposalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [proposal, setProposal] = useState<ProposalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const data = await callBackend(`proposals/${id}`);
        setProposal(data);
      } catch (err) {
        console.error('Failed to fetch proposal details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProposal();
  }, [id]);

  const handleStatusUpdate = async (newStatus: ProposalStatus) => {
    setActionLoading(true);
    try {
      await callBackend(`proposals/${id}/status`, 'PATCH', { status: newStatus });
      setProposal((prev) => prev ? { ...prev, status: newStatus } : prev);
      alert(`Proposal ${newStatus} successfully!`);
      if (newStatus === 'accepted') {
        router.push('/client/manage-projects');
      }
    } catch (err: unknown) {
      console.error('Action Failed:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['client']}>
        <DashboardLayout sidebarItems={sidebarItems} title="Proposal Details">
          <div className="max-w-5xl mx-auto py-10 space-y-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full rounded-[40px]" />
            <Skeleton className="h-96 w-full rounded-[40px]" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!proposal) {
    return (
      <ProtectedRoute allowedRoles={['client']}>
        <DashboardLayout sidebarItems={sidebarItems} title="Proposal Details">
          <div className="max-w-5xl mx-auto py-20 text-center space-y-6">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
               <FileText size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Proposal Not Found</h2>
            <p className="text-slate-500">The proposal you are looking for does not exist or you don&apos;t have access.</p>
            <Link href="/client/proposals">
               <Button variant="outline">Back to Bids</Button>
            </Link>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const bidAmount = proposal.bidAmount ?? proposal.rate ?? 0;
  const projectTitle = proposal.projectTitle || 'your project';

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Review Proposal">
        <div className="max-w-5xl mx-auto py-8 space-y-8">
          
          {/* Back Button */}
          <Link href="/client/proposals" className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group">
            <div className="p-2 rounded-xl bg-primary-50 group-hover:bg-primary-100 mr-3 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to incoming bids
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content: The Pitch */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Proposal Header Card */}
              <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900/40 rounded-[35px] overflow-hidden">
                <CardContent className="p-8 md:p-10 space-y-8">
                   <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <Badge variant="info" className="font-black tracking-widest uppercase text-[10px] bg-primary-50 text-primary-700 border-none px-3 py-1 mb-2">
                           {proposal.status}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                           Bid for {projectTitle}
                        </h1>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-bold">
                      <div className="flex items-center gap-2">
                         <Calendar size={18} className="text-primary-500" />
                         Received {new Date(proposal.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                         <Clock size={18} className="text-primary-500" />
                         Duration: {proposal.deliveryTime || 'TBD'}
                      </div>
                   </div>

                   <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                         <FileText className="text-primary-500" /> Cover Letter
                      </h3>
                      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-wrap">
                         {proposal.coverLetter}
                      </div>
                   </div>
                </CardContent>
              </Card>

              {/* Freelancer Info Card */}
              <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900/40 rounded-[35px] border-t-4 border-t-indigo-500/20">
                <CardHeader className="p-8 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                       <Users size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                          Bidding Freelancer
                       </h3>
                       <p className="text-slate-500 font-medium lowercase">ID: {proposal.freelancerId.slice(0, 12)}...</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <p className="text-slate-600 dark:text-slate-400 font-medium">
                      This freelancer has submitted a professional proposal for your project. You can review their full roadmap and previous work by visiting their profile.
                   </p>
                   <Link href={`/freelancers/${proposal.freelancerId}`}>
                      <Button variant="outline" className="rounded-2xl h-12 px-8 font-black border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                        View Full Freelancer Profile
                      </Button>
                   </Link>
                </CardContent>
              </Card>

            </div>

            {/* Right Column: Actions & Price */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Financial Box */}
              <Card className="bg-white dark:bg-slate-900 border-none shadow-2xl shadow-slate-300 dark:shadow-none rounded-[35px] overflow-hidden">
                 <CardContent className="p-8 space-y-8">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Bid Amount</p>
                       <h2 className="text-5xl font-black flex items-start gap-1 text-slate-950 dark:text-white">
                          <span className="text-2xl mt-2 text-primary-500">₹</span>
                          {bidAmount.toLocaleString()}
                       </h2>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                          <Clock className="text-primary-500 shrink-0" size={20} />
                          <div>
                             <p className="text-[8px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Est. Delivery</p>
                             <p className="text-sm font-bold text-slate-900 dark:text-white">{proposal.deliveryTime || '1 Week'}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                          <Briefcase className="text-indigo-500 shrink-0" size={20} />
                          <div>
                             <p className="text-[8px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Project Type</p>
                             <p className="text-sm font-bold text-slate-900 dark:text-white">Fixed Milestone</p>
                          </div>
                       </div>
                    </div>

                    {proposal.status === 'pending' ? (
                       <div className="space-y-3 pt-4">
                          <Button 
                            onClick={() => handleStatusUpdate('accepted')}
                            disabled={actionLoading}
                            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 gap-2"
                          >
                             <CheckCircle2 size={24} />
                             Hire Freelancer
                          </Button>
                          <Button 
                             onClick={() => handleStatusUpdate('rejected')}
                             disabled={actionLoading}
                             variant="outline" 
                             className="w-full h-14 rounded-2xl font-bold border-slate-200 dark:border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-slate-600 dark:text-white/70"
                          >
                             <XCircle size={20} />
                             Decline Proposal
                          </Button>
                       </div>
                    ) : (
                       <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-6 text-center space-y-2">
                          <CheckCircle2 size={32} className={cn("mx-auto", proposal.status === 'accepted' ? 'text-emerald-500' : 'text-red-500')} />
                          <p className="text-sm font-bold text-slate-900 dark:text-white">This proposal has been {proposal.status}.</p>
                          <p className="text-xs text-slate-400 dark:text-white/40">Action taken at {new Date().toLocaleDateString()}</p>
                       </div>
                    )}
                 </CardContent>
              </Card>

              {/* Safety Tip */}
              <div className="p-6 rounded-[30px] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 text-xs font-medium space-y-3">
                 <p className="font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Secure Collaboration
                 </p>
                 <p>Accept only when the proposal matches your scope, timeline, and delivery expectations.</p>
              </div>

            </div>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
