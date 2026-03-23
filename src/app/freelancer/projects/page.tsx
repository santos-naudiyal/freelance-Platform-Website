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
    const fetchActive = async () => {
       try {
         const firebaseUser = auth.currentUser;
         if (!firebaseUser) return;
         const token = await firebaseUser.getIdToken();
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
                   return { ...p, projectTitle: projData.title, clientId: projData.clientId };
                }
             } catch (e) {}
             return { ...p, projectTitle: 'Unknown Project', clientId: 'Unknown' };
           }));
           
           setProjects(mappedProjects);
         }
       } catch (err) {
         console.error(err);
       } finally {
         setIsLoading(false);
       }
    };
    if (auth.currentUser) {
      fetchActive();
    } else {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) fetchActive();
      });
      return () => unsubscribe();
    }
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
             {isLoading ? (
               <div className="py-12 text-center text-slate-500">Loading active projects...</div>
             ) : projects.length === 0 ? (
               <Card className="border-dashed border-2 py-12 text-center">
                 <CardContent>
                   <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                   <h3 className="text-lg font-semibold">No active projects</h3>
                   <p className="text-slate-500 mb-6">You don't have any ongoing contracts right now.</p>
                   <Link href="/projects/browse">
                     <Button>Browse Projects</Button>
                   </Link>
                 </CardContent>
               </Card>
             ) : (
               projects.map((project) => (
                  <Card key={project.id} className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
                     <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="flex gap-4 items-start">
                              <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                                 <PlayCircle size={28} />
                              </div>
                              <div className="space-y-1">
                                 <h4 className="font-bold text-lg">{project.projectTitle}</h4>
                                 <p className="text-sm text-slate-500">Contract ID: {project.id}</p>
                                 <div className="flex gap-4 mt-2">
                                    <div className="w-48 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                       <div className="bg-primary-500 h-full w-[20%]" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">IN PROGRESS</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <Link href={`/messages`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                   <MessageSquare size={16} /> Chat
                                </Button>
                              </Link>
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
