"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../../../components/ui/Card';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Settings,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { Project, Proposal } from '../../../../types';
import { PaymentModal } from '../../../../components/workspace/PaymentModal';
import { AIRecommendedExperts } from '../../../../components/workspace/AIRecommendedExperts';
import { callBackend } from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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

export default function ProjectProposalsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedProposalForPayment, setSelectedProposalForPayment] = useState<Proposal | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch Project
        const pResp = await callBackend(`projects/${id}`);
        if (pResp) setProject(pResp);

        // Fetch Proposals
        const propResp = await callBackend(`proposals/project/${id}`);
        if (propResp) setProposals(propResp);
        
      } catch (err) {
        console.error('Failed to fetch project data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [id, user]);

  const handleProposalAction = async (proposalId: string, status: 'accepted' | 'rejected') => {
    setActionLoading(proposalId);
    try {
      const resp = await callBackend(`proposals/${proposalId}/status`, 'PATCH', { status });

      if (resp) {
        setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
        
        // After accepting, we might want to redirect to the project workspace
        if (status === 'accepted') {
           // Optionally redirect or show success message
           setTimeout(() => {
              router.push(`/client/manage-projects`);
           }, 1000);
        }
      }
    } catch (err) {
      console.error('Failed to update proposal status:', err);
    } finally {
      setActionLoading(null);
    }
  };

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
      <DashboardLayout sidebarItems={sidebarItems} title="Project Management">
        <div className="max-w-7xl mx-auto space-y-10 py-6">
          
          {/* Project Summary Header */}
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)}
              </div>
            </div>
          ) : project && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-primary-600 font-black uppercase tracking-widest text-[10px] mb-2">Project Overview</p>
                  <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                    {project.title}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info" className="px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] rounded-full">
                    {project.status === 'open' ? 'Open for Bidding' : project.status.replace('_', ' ')}
                  </Badge>
                  <Link href={`/projects/edit/${project.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full h-10 px-6">Edit Post</Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 shadow-premium">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Budget Range</p>
                    <p className="text-2xl font-display font-black text-slate-900 dark:text-white">
                      ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                    </p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 shadow-premium">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Proposals</p>
                    <p className="text-2xl font-display font-black text-slate-900 dark:text-white">
                      {proposals.length}
                    </p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-1">Active Stage</p>
                    <p className="text-2xl font-display font-black">Selection</p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 shadow-premium">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Success Rate</p>
                    <p className="text-2xl font-display font-black text-slate-900 dark:text-white">98%</p>
                 </div>
              </div>
            </div>
          )}

          <hr className="border-slate-100 dark:border-slate-800/50" />

          {/* AI Recommended Experts Layer */}
          {!isLoading && project && (
            <AIRecommendedExperts projectDescription={project.description} />
          )}

          {/* Proposals Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                Received Proposals
              </h2>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <Users size={16} /> {proposals.length} Applicants
              </div>
            </div>

            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full rounded-[2rem]" />)}
               </div>
            ) : proposals.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {proposals.map((proposal) => (
                    <motion.div key={proposal.id} variants={itemVariants}>
                      <Card className={cn(
                        "group hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500",
                        proposal.status === 'accepted' && "border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-900/5",
                        proposal.status === 'rejected' && "opacity-50 grayscale"
                      )}>
                        <CardHeader className="flex flex-row items-start justify-between pb-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                               <User size={28} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                Freelancer {proposal.freelancerId.slice(0, 6)}
                              </h4>
                              <div className="flex items-center gap-2">
                                 <Badge variant="success" className="text-[9px] px-2 py-0">Top Rated</Badge>
                                 <span className="text-xs text-slate-400 font-medium">Applied {new Date(proposal.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-display font-black text-slate-900 dark:text-white">
                               ${proposal.bidAmount?.toLocaleString() || proposal.rate.toLocaleString()}
                             </p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fixed Bid</p>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                              "{proposal.coverLetter}"
                           </div>
                           
                           <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
                             <div className="flex items-center gap-2">
                               <Clock size={16} className="text-primary-500" />
                               <span>Takes {proposal.deliveryTime || proposal.estimatedDuration}</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <CheckCircle2 size={16} className="text-primary-500" />
                               <span>Milestones Ready</span>
                             </div>
                           </div>
                        </CardContent>
                        <CardFooter className="gap-3">
                          {proposal.status === 'pending' ? (
                            <>
                              <Button 
                                className="flex-1 rounded-2xl h-12 font-black tracking-tight"
                                onClick={() => setSelectedProposalForPayment(proposal)}
                                isLoading={actionLoading === proposal.id}
                              >
                                Hire Now
                              </Button>
                              <Button 
                                variant="outline" 
                                className="h-12 w-12 p-0 rounded-2xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200"
                                onClick={() => handleProposalAction(proposal.id, 'rejected')}
                                isLoading={actionLoading === proposal.id}
                              >
                                <XCircle size={20} />
                              </Button>
                            </>
                          ) : (
                            <div className="w-full py-2 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                               {proposal.status === 'accepted' ? (
                                  <span className="text-emerald-500 flex items-center gap-2">
                                     <CheckCircle2 size={14} /> Proposal Accepted
                                  </span>
                               ) : (
                                  <span className="text-slate-400 flex items-center gap-2">
                                     <XCircle size={14} /> Proposal Declined
                                  </span>
                               )}
                            </div>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-6">
                 <div className="h-24 w-24 rounded-[2rem] bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-300 dark:text-slate-600 rotate-6">
                    <AlertCircle size={48} />
                 </div>
                 <div className="space-y-2 max-w-sm">
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">No proposals yet</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     Once freelancers start bidding on your project, their proposals will appear here.
                   </p>
                 </div>
                 <Button variant="outline" onClick={() => router.push('/client/manage-projects')}>Manage Other Projects</Button>
              </div>
            )}
          </div>
        </div>

        {selectedProposalForPayment && project && (
          <PaymentModal
            isOpen={!!selectedProposalForPayment}
            onClose={() => setSelectedProposalForPayment(null)}
            amount={selectedProposalForPayment.bidAmount || selectedProposalForPayment.rate || 0}
            projectId={project.id}
            onSuccess={() => {
              handleProposalAction(selectedProposalForPayment.id, 'accepted');
              setSelectedProposalForPayment(null);
            }}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
