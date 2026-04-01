"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  Navigation,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { Project } from '../../../../types';
import { callBackend } from '../../../../lib/api';
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

export default function FreelancerProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await callBackend(`projects/${id}`);
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project details:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    if (id) fetchProject();
  }, [id]);

  return (
    <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Project Details">
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          
          <button 
             onClick={() => router.back()} 
             className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
             <ChevronLeft size={16} /> Back to Dashboard
          </button>

          {isLoading ? (
            <div className="space-y-6">
               <Skeleton className="h-40 w-full rounded-[2rem]" />
               <Skeleton className="h-64 w-full rounded-[2rem]" />
            </div>
          ) : !project ? (
            <div className="py-20 text-center text-slate-500 font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
               Project not found or you don't have access to it.
            </div>
          ) : (
            <div className="space-y-8">
               {/* Header Hero */}
               <Card className="overflow-hidden border-transparent shadow-2xl bg-slate-900 text-white relative">
                 <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-primary-600/30 blur-3xl rounded-full" />
                 <div className="p-8 sm:p-10 relative z-10 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                       <Badge className="bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 font-black tracking-widest uppercase text-[10px] px-3">
                          {project.status.replace('_', ' ')}
                       </Badge>
                       <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
                          {project.title}
                       </h1>
                       <p className="text-primary-200/80 font-medium max-w-lg line-clamp-2">
                          {project.description}
                       </p>
                    </div>
                    <div className="shrink-0 flex flex-col justify-end">
                       <Link href="/messages">
                          <Button className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black shadow-xl shrink-0 gap-2 transition-transform hover:scale-105">
                             <MessageSquare size={18} /> Open Workspace Chat
                          </Button>
                       </Link>
                    </div>
                 </div>
               </Card>

               {/* Stats Row */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden group">
                     <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:rotate-12 transition-transform duration-500"><DollarSign size={80} /></div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 relative z-10">Budget</p>
                     <p className="text-2xl font-display font-black text-slate-900 dark:text-white relative z-10">
                       ${project.budget.max.toLocaleString()}
                     </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden group">
                     <div className="absolute -right-4 -top-4 text-primary-500/10 group-hover:-rotate-12 transition-transform duration-500"><Clock size={80} /></div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 relative z-10">Target Deadline</p>
                     <p className="text-2xl font-display font-black text-slate-900 dark:text-white relative z-10 flex items-center gap-2">
                       {new Date(project.deadline || Date.now() + 604800000).toLocaleDateString()}
                     </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 shadow-sm relative overflow-hidden group">
                     <div className="absolute -right-4 -top-4 text-emerald-500/20 group-hover:scale-110 transition-transform duration-500"><CheckCircle size={80} /></div>
                     <p className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Status</p>
                     <p className="text-2xl font-display font-black relative z-10">
                       Active
                     </p>
                  </div>
               </div>

               {/* Full Details Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                     <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                           <FileText className="text-primary-500" size={24} /> Full Description
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                           {project.description}
                        </div>
                     </div>

                     <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                           <CheckCircle2 className="text-indigo-500" size={24} /> Required Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                           {project.skillsRequired?.length > 0 ? (
                              project.skillsRequired.map((skill, index) => (
                                 <span key={index} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl">
                                    {skill}
                                 </span>
                              ))
                           ) : (
                              <span className="text-sm font-medium text-slate-500">No specific skills listed.</span>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Client Info Window */}
                  <div className="space-y-6">
                     <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/50">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-4">
                           Client Details
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                              {project.clientDetails?.avatar ? (
                                 <img src={project.clientDetails.avatar} alt="Client" className="h-full w-full object-cover rounded-2xl" />
                              ) : (
                                 <User size={24} className="text-slate-400" />
                              )}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white">
                                 {project.clientDetails?.name || 'Verified Client'}
                              </p>
                              {project.clientDetails?.companyName && (
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {project.clientDetails.companyName}
                                 </p>
                              )}
                           </div>
                        </div>

                        <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                           <li className="flex justify-between items-center">
                              <span className="text-slate-400">Industry</span>
                              <span className="font-bold text-slate-900 dark:text-slate-300 text-right">{project.clientDetails?.industry || 'Unspecified'}</span>
                           </li>
                           <li className="flex justify-between items-center">
                              <span className="text-slate-400">Location</span>
                              <span className="font-bold text-slate-900 dark:text-slate-300 text-right">{project.clientDetails?.address || 'Global'}</span>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
