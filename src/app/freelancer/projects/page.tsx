"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';
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
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
       if (!user || !auth.currentUser) return;

       try {
         const token = await auth.currentUser.getIdToken();
         const resp = await fetch('http://localhost:5000/api/proposals/my', {
           headers: { 'Authorization': `Bearer ${token}` }
         });
         
         if (resp.ok) {
           const data = await resp.json();
           const accepted = data.filter((p: any) => p.status === 'accepted');
           
           const mappedProjects = await Promise.all(accepted.map(async (p: any) => {
             try {
                const projResp = await fetch(`http://localhost:5000/api/projects/${p.projectId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (projResp.ok) {
                   const projData = await projResp.json();

           }));
           
           setProjects(mappedProjects);
         }
       } catch (err) {
         console.error(err);
       } finally {
         setIsLoading(false);
       }
    };

    if (user) {
      fetchActive();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Active Projects">

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
