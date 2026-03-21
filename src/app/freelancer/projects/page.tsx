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
  PlayCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { auth } from '../../../lib/firebase';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function FreelancerProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Similarly to proposals, this would fetch from a specific "active projects" endpoint
    // For now we'll simulate empty state or simple fetch
    const fetchActive = async () => {
       setIsLoading(false);
    };
    fetchActive();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Active Projects">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-bold">Your Ongoing Work</h2>
            <Badge variant="info" className="px-4">3 Active Contracts</Badge>
          </div>

          <div className="space-y-4">
             {/* Simulated active items for UI demonstration */}
             {[1, 2].map((i) => (
                <Card key={i} className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
                   <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="flex gap-4 items-start">
                            <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                               <PlayCircle size={28} />
                            </div>
                            <div className="space-y-1">
                               <h4 className="font-bold text-lg">Next.js E-commerce Integration</h4>
                               <p className="text-sm text-slate-500">Client: WebSolutions Ltd.</p>
                               <div className="flex gap-4 mt-2">
                                  <div className="w-48 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                     <div className="bg-primary-500 h-full w-[65%]" />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500">65% DONE</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <Link href="/messages">
                              <Button variant="outline" size="sm" className="gap-2">
                                 <MessageSquare size={16} /> Chat
                              </Button>
                            </Link>
                            <Button size="sm">Manage Milestones</Button>
                         </div>
                      </div>
                   </div>
                </Card>
             ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
