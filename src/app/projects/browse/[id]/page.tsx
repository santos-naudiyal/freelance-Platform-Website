"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../../../components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Send,
  AlertCircle,
  ShieldCheck,
  Globe,
  Star
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { auth } from '../../../../lib/firebase';
import { Project } from '../../../../types';
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

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Proposal Form State
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [deliveryTime, setDeliveryTime] = useState('1 week');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const resp = await fetch(`http://localhost:5000/api/projects/${id}`);
        if (resp.ok) {
          const data = await resp.json();
          setProject(data);

        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Not authenticated');
      const token = await firebaseUser.getIdToken();

      const resp = await fetch('http://localhost:5000/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: id,
          bidAmount,
          coverLetter,
          deliveryTime
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to submit proposal');

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Loading Project...">
        <div className="flex h-[50vh] items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Fetching project details...</p>
           </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );

  if (!project) return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Project Not Found">
        <div className="flex h-[50vh] items-center justify-center flex-col text-center space-y-4">
           <AlertCircle size={48} className="text-slate-400" />
           <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
           <p className="text-slate-500">The project you are looking for does not exist or has been removed.</p>
           <Button onClick={() => router.back()} variant="outline" className="mt-4">Go Back</Button>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Project Details">
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
          
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors group">
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Projects
          </button>

          {/* Project Header - Premium Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8 md:p-10">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={project.status === 'open' ? 'success' : 'info'} className="px-3 py-1 bg-white/20 backdrop-blur-md border-0 text-white">
                    {project.status.toUpperCase()}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">About the Proposal</h3>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                   <p>{project.description}</p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Skills and Expertise Required</h3>
                <div className="flex flex-wrap gap-3">
                  {project.skillsRequired.map(skill => (
                     <span key={skill} className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors cursor-default">
                      {skill}
                     </span>
                  ))}
                </div>
              </div>

              {/* Client Trust Section */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center gap-8">
                <div className="flex items-center gap-4 min-w-[200px]">
                   <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-full border-2 border-primary-100 dark:border-primary-900/50 flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={32} className="text-primary-500" />
                   </div>
                   <div>
                     <p className="font-bold text-lg text-slate-900 dark:text-white">Client Verified</p>
                     <div className="flex items-center gap-1 text-amber-500 mt-1">
                       <Star size={14} className="fill-amber-500" />
                       <Star size={14} className="fill-amber-500" />
                       <Star size={14} className="fill-amber-500" />
                       <Star size={14} className="fill-amber-500" />
                       <Star size={14} className="fill-amber-500" />
                       <span className="text-slate-500 text-xs ml-1 font-medium bg-slate-200/50 dark:bg-slate-700 px-1.5 rounded text-center">5.0</span>
                     </div>
                   </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-slate-500 text-sm font-medium flex items-center gap-2"><ShieldCheck size={16} /> Payment Verified</p>
                   </div>
                   <div>
                     <p className="text-slate-500 text-sm font-medium flex items-center gap-2"><Globe size={16} /> United States</p>
                   </div>
                   <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                     <p className="text-sm font-medium text-slate-600 dark:text-slate-300">12 Projects Posted • 8 Hires • $20k+ Spent</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Proposal Form (Sticky Sidebar) */}
            <div className="relative">
               <div className="sticky top-28 space-y-6">
                {isSubmitted ? (
                   <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 text-center relative overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
                      <div className="relative z-10">
                         <div className="h-20 w-20 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-200 dark:border-emerald-700/50">
                           <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
                         </div>
                         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Proposal Sent!</h3>
                         <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                           Your application is securely delivered to the client. You can track its status in your proposals dashboard.
                         </p>
                         <Link href="/freelancer/proposals" className="block w-full">
                           <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-6 rounded-full font-bold shadow-lg shadow-emerald-600/20 hover:-translate-y-1 transition-all">
                             View My Proposals
                           </Button>
                         </Link>
                      </div>
                   </div>
                ) : project?.status !== 'open' ? (
                   <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center relative">
                      <div className="mb-6 h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700">
                         <Briefcase size={32} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Project Closed</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        This project is no longer accepting new proposals. The client has likely already hired a freelancer.
                      </p>
                      <Link href="/projects/browse" className="block w-full">
                        <Button variant="outline" className="w-full py-6 rounded-full font-bold border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                          Browse Other Projects
                        </Button>
                      </Link>
                   </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none relative">
                    <div className="mb-8">
                       <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Apply Now</h3>
                       <p className="text-slate-500">Submit a proposal to win this project</p>
                    </div>
                    
                    <form onSubmit={handleSubmitProposal} className="space-y-6">
                      <div className="space-y-1">
                         <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Bid Amount</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
                               $
                            </div>
                            <input
                              type="number"
                              min={10}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(parseInt(e.target.value))}
                              required
                              className="pl-8 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-4 text-lg font-bold text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                            />
                         </div>
                      </div>
                      
                      <div className="space-y-1">
                         <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Estimated Timeline</label>
                         <input
                           type="text"
                           placeholder="e.g. 5 days, 2 weeks"
                           value={deliveryTime}
                           onChange={(e) => setDeliveryTime(e.target.value)}
                           required
                           className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-4 text-base font-medium text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                         />
                      </div>

                      <div className="space-y-1">
                         <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Cover Letter</label>
                         <textarea
                           className="flex min-h-[160px] w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-4 text-base text-slate-900 dark:text-slate-100 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none leading-relaxed"
                           placeholder="Introduce yourself, explain why you're a strong fit, and describe your approach to completing this project successfully..."
                           value={coverLetter}
                           onChange={(e) => setCoverLetter(e.target.value)}
                           required
                         />
                      </div>

                      {submitError && (
                        <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                          <AlertCircle size={20} className="shrink-0" />
                          <p className="font-medium">{submitError}</p>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button type="submit" className="w-full gap-2 py-7 text-lg rounded-full shadow-lg shadow-primary-500/25 hover:-translate-y-1 transition-all bg-gradient-to-r from-primary-600 to-primary-500" isLoading={isSubmitting}>
                          <Send size={20} />
                          Send Proposal
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-6 text-center">
                      <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                         <ShieldCheck size={14} /> Safe and secure. <a href="#" className="underline decoration-slate-300 underline-offset-2">Terms apply</a>.
                      </p>
                    </div>
                  </div>
                )}
               </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
