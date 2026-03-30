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
