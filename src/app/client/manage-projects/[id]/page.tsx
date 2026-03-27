"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../../components/ui/Card';
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
  DollarSign
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { auth } from '../../../../lib/firebase';
import { Project, Proposal } from '../../../../types';
import { PaymentModal } from '../../../../components/workspace/PaymentModal';
import { callBackend } from '../../../../lib/api';

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
          // If accepted, also mark project as in_progress (simplified logic)
          await callBackend(`projects/${id}/status`, 'PATCH', { status: 'in_progress' });
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
      <DashboardLayout sidebarItems={sidebarItems} title="Project Proposals">
        <div className="space-y-8">
          {/* Project Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                {project?.title || 'Loading Project...'}
              </h2>
              <p className="text-slate-500 line-clamp-2 max-w-3xl">
                {project?.description}
              </p>
            </div>
            {project && (
              <Badge variant={project.status === 'open' ? 'success' : 'info'} className="text-sm px-4 py-1">
                {project.status.toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                <Users className="text-primary-600" />
                Submitted Proposals ({proposals.length})
              </h3>

              {isLoading ? (
                <div className="py-12 text-center text-slate-500">Loading proposals...</div>
              ) : proposals.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2">
                  <p className="text-slate-500">No proposals received yet for this project.</p>
                </Card>
              ) : (
                proposals.map((proposal) => (
                  <Card key={proposal.id} className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <User className="text-slate-400" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 dark:text-white">Freelancer Application</h4>
                            <p className="text-sm text-slate-500 line-clamp-3">{proposal.coverLetter}</p>
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mt-2">
                              <span className="flex items-center gap-1"><Clock size={14} /> {proposal.deliveryTime}</span>
                              <span className="flex items-center gap-1 text-emerald-600"><DollarSign size={14} /> Bid: ${proposal.bidAmount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          {proposal.status === 'pending' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="w-full gap-2" 
                                isLoading={actionLoading === proposal.id}
                                onClick={() => setSelectedProposalForPayment(proposal)}
                              >
                                <CheckCircle2 size={16} /> Hire
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                onClick={() => handleProposalAction(proposal.id, 'rejected')}
                              >
                                <XCircle size={16} /> Decline
                              </Button>
                            </>
                          ) : (
                            <Badge variant={proposal.status === 'accepted' ? 'success' : 'error'} className="w-full justify-center py-1.5 capitalize">
                              {proposal.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Sidebar with Project Metadata */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Project Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Budget Range</span>
                     <span className="font-semibold">${project?.budget?.min || 0} - ${project?.budget?.max || 0}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Payment Type</span>
                     <span className="capitalize">{project?.budget?.type || 'fixed'} Price</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Posted On</span>
                     <span>{project ? new Date(project.createdAt).toLocaleDateString() : '...'}</span>
                   </div>
                   <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                     <h5 className="text-sm font-semibold mb-2">Required Skills</h5>
                     <div className="flex flex-wrap gap-2">
                       {project?.skillsRequired.map(skill => (
                         <Badge key={skill} variant="info">{skill}</Badge>
                       ))}
                     </div>
                   </div>
                </CardContent>
              </Card>
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
