"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../../components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { auth } from '../../../lib/firebase';
import Link from 'next/link';
import { Proposal } from '../../../types';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;
        const token = await firebaseUser.getIdToken();

        const resp = await fetch(`http://localhost:5000/api/proposals/freelancer/${firebaseUser.uid}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (resp.status === 404) {
           // If route not implemented yet, we'll implement it later/now
           setProposals([]);
           return;
        }

        if (resp.ok) {
          setProposals(await resp.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="My Proposals">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-bold">Track Your Applications</h2>
            <Link href="/projects/browse">
              <Button size="sm" variant="outline">Browse More Projects</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
               <div className="py-12 text-center text-slate-500">Loading your proposals...</div>
            ) : proposals.length === 0 ? (
              <Card className="border-dashed border-2 py-16 text-center rounded-3xl">
                <CardContent>
                  <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-lg font-semibold">No proposals yet</h3>
                  <p className="text-slate-500 mb-6">Start applying to projects to see them here.</p>
                  <Link href="/projects/browse">
                    <Button>Find Projects</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              proposals.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white">Applied to Project ID: {proposal.projectId}</h4>
                          <Badge variant={proposal.status === 'pending' ? 'default' : proposal.status === 'accepted' ? 'success' : 'error'}>
                            {proposal.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 italic">&ldquo;{proposal.coverLetter}&rdquo;</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                          <span className="flex items-center gap-1"><Clock size={14} /> Submitted {new Date(proposal.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1 font-semibold text-primary-600">Your Bid: ${proposal.bidAmount}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/browse/${proposal.projectId}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink size={16} />
                            View Project
                          </Button>
                        </Link>
                        {proposal.status === 'accepted' && (
                          <Link href={`/freelancer/projects`}>
                            <Button size="sm">Go to Contract</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
