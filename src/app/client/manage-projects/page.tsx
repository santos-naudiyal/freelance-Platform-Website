"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Settings,
  MoreVertical,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { auth } from '../../../lib/firebase';
import Link from 'next/link';
import { Project } from '../../../types';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/client/post-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;
        
        const token = await firebaseUser.getIdToken();
        const resp = await fetch('http://localhost:5000/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          // In this simplified API, we filter by client ID on frontend for demonstration
          // In a real production app, the backend should handle this filtering
          setProjects(data.filter((p: any) => p.clientId === firebaseUser.uid));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Manage Your Projects">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-bold">Your Project Listings</h2>
            <Link href="/client/post-project">
              <Button size="sm" className="gap-2">
                <PlusSquare size={16} />
                New Project
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
               <div className="py-12 text-center text-slate-500">Loading your projects...</div>
            ) : projects.length === 0 ? (
              <Card className="border-dashed border-2 py-12 text-center">
                <CardContent>
                  <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold">No projects posted yet</h3>
                  <p className="text-slate-500 mb-6">Create your first project to start hiring global talent.</p>
                  <Link href="/client/post-project">
                    <Button>Post My First Project</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</h3>
                          <Badge variant={project.status === 'open' ? 'success' : 'info'}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1 max-w-2xl">{project.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Posted {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-primary-600">
                            Budget: ${project.budget.min} - ${project.budget.max}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/client/manage-projects/${project.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Users size={16} />
                            View Proposals
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <MoreVertical size={18} />
                        </Button>
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
