"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../../store/useAuthStore';

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
  DollarSign,
  Briefcase,
  Star,
  Award,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { auth } from '../../../../lib/firebase';
import { Project, Proposal } from '../../../../types';
import { PaymentModal } from '../../../../components/workspace/PaymentModal';
import { callBackend } from '../../../../lib/api';
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
        console.error(err);
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
        
        if (status === 'accepted') {
          await callBackend(`projects/${id}/status`, 'PATCH', { status: 'in_progress' });
          setProject(prev => prev ? { ...prev, status: 'in_progress' } : null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title={project ? "Project Details" : "Loading..."}>
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
          
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors group">
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
              <ChevronLeft size={16} />
            </div>
            Back to Projects
          </button>

          {/* Project Header - Premium Card */}
          {project && (
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8 md:p-10">
              {/* Background gradient effects */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="space-y-4 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={project.status === 'open' ? 'success' : project.status === 'in_progress' ? 'warning' : 'info'} className="px-3 py-1 bg-white/20 backdrop-blur-md border-0 text-white">
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-slate-400 flex items-center gap-1.5"><Clock size={14} /> Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-slate-300 text-lg line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[240px]">
                  <p className="text-sm text-slate-400 mb-1">Project Budget</p>
                  <p className="text-3xl font-bold text-white mb-4">
                    ${project.budget.min} - ${project.budget.max}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                    <span className="capitalize">{project.budget.type} Price</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Proposals List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg">
                    <Users size={20} />
                  </div>
                  Review Proposals ({proposals.length})
                </h3>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-48 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 animate-pulse border border-slate-200/50 dark:border-slate-700/50"></div>
                  ))}
                </div>
              ) : proposals.length === 0 ? (
                <div className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center transition-all hover:border-slate-300 dark:hover:border-slate-700">
                  <div className="mx-auto h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <User size={28} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Proposals Yet</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">Freelancers haven't submitted proposals for this project yet. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className={`bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border shadow-sm transition-all duration-300 relative overflow-hidden group ${
                      proposal.status === 'accepted' ? 'border-emerald-500/50 shadow-emerald-500/10' : 
                      proposal.status === 'rejected' ? 'border-red-200 dark:border-red-900/30 opacity-75' : 
                      'border-slate-200/80 dark:border-slate-800 hover:shadow-xl hover:border-primary-500/30 dark:hover:border-primary-500/30'
                    }`}>
                      
                      {proposal.status === 'accepted' && (
                        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                      )}

                      <div className="relative z-10 flex flex-col sm:flex-row gap-6">
                        {/* Freelancer Avatar */}
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-inner">
                            <User className="text-slate-500 dark:text-slate-400" size={28} />
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md mt-1">
                            <Star size={12} className="fill-amber-500" />
                            <span>New</span>
                          </div>
                        </div>

                        {/* Proposal Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                Freelancer Application
                              </h4>
                              <div className="flex flex-wrap gap-3 mt-3">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30 w-fit">
                                  <DollarSign size={16} />
                                  <span>Bid: ${proposal.bidAmount}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-900/30 w-fit">
                                  <Clock size={16} />
                                  <span>Delivers in {proposal.deliveryTime}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions Column */}
                            <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                              {proposal.status === 'pending' ? (
                                <>
                                  <Button 
                                    className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white shadow-emerald-500/20 shadow-lg border-0 min-w-[120px] rounded-full" 
                                    isLoading={actionLoading === proposal.id}
                                    onClick={() => setSelectedProposalForPayment(proposal)}
                                  >
                                    <CheckCircle2 size={18} /> Hire Now
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="gap-2 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:border-slate-700 dark:hover:bg-red-900/20 dark:hover:border-red-800 min-w-[120px] rounded-full"
                                    onClick={() => handleProposalAction(proposal.id, 'rejected')}
                                    disabled={!!actionLoading}
                                  >
                                    <XCircle size={18} /> Decline
                                  </Button>
                                </>
                              ) : (
                                <Badge 
                                  className={`w-full justify-center py-2 px-4 shadow-sm border-0 rounded-full text-sm ${
                                    proposal.status === 'accepted' 
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                  }`}
                                >
                                  {proposal.status.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                              {proposal.coverLetter}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Sidebar Metadata */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Award className="text-primary-500" />
                  Requirements
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {project?.skillsRequired?.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-lg border border-primary-100 dark:border-primary-800/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Summary</p>
                    <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                       <span className="text-slate-500">Status</span>
                       <span className="font-semibold capitalize text-slate-900 dark:text-white">{project?.status.replace('_', ' ')}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                       <span className="text-slate-500">Budget Range</span>
                       <span className="font-semibold text-slate-900 dark:text-white">${project?.budget?.min} - ${project?.budget?.max}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                       <span className="text-slate-500">Payment Type</span>
                       <span className="capitalize font-semibold text-slate-900 dark:text-white">{project?.budget?.type} Price</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedProposalForPayment && project && (
          <PaymentModal
            isOpen={!!selectedProposalForPayment}
            onClose={() => setSelectedProposalForPayment(null)}
            amount={selectedProposalForPayment.bidAmount || 0}
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
