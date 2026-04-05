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
  Calendar,
  Building2,
  Trophy,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import { Badge } from '../../../../components/ui/Badge';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { callBackend } from '../../../../lib/api';
import { Project } from '../../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { AIProposalGenerator } from '../../../../components/workspace/AIProposalGenerator';

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
        const data = await callBackend(`projects/${id}`);
        setProject(data);
        // Default bid amount to min budget
        if (data.budget?.min) {
           setBidAmount(data.budget.min);
        }
      } catch (err) {
        console.error('Failed to fetch project:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
       fetchProject();
    }
  }, [id]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await callBackend('proposals', 'POST', {
        projectId: id,
        bidAmount,
        coverLetter,
        deliveryTime
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIProposal = (data: { coverLetter: string, suggestedRate: number, estimatedDuration: string }) => {
    setCoverLetter(data.coverLetter);
    setBidAmount(data.suggestedRate);
    setDeliveryTime(data.estimatedDuration);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!isLoading && !project) {
    return (
      <ProtectedRoute allowedRoles={['freelancer']}>
        <DashboardLayout sidebarItems={sidebarItems} title="Project Details">
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Project not found</h3>
            <p className="text-slate-500">The project you are looking for may have been closed or removed.</p>
            <Button onClick={() => router.push('/projects/browse')}>Return to Browse</Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Project Details">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Back Button */}
          <Link href="/projects/browse" className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group">
            <div className="p-2 rounded-xl bg-primary-50 group-hover:bg-primary-100 mr-3 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to browse projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Project Info */}
            <div className="lg:col-span-8 space-y-8">
              {isLoading ? (
                <div className="space-y-6">
                   <Skeleton className="h-12 w-3/4" />
                   <div className="flex gap-2">
                     <Skeleton className="h-6 w-20" />
                     <Skeleton className="h-6 w-20" />
                   </div>
                   <Skeleton className="h-64 w-full rounded-3xl" />
                </div>
              ) : (
                <motion.div 
                   variants={containerVariants}
                   initial="hidden"
                   animate="visible"
                   className="space-y-10"
                >
                  {/* Header Content */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={project?.status === 'open' ? 'success' : 'secondary'} className="uppercase tracking-widest text-[10px] font-black px-3 py-1">
                        {project?.status === 'open' ? 'Accepting Bids' : 'Bidding Closed'}
                      </Badge>
                      <Badge variant="info" className="uppercase tracking-widest text-[10px] font-black px-3 py-1">Featured</Badge>
                      <Badge variant="success" className="uppercase tracking-widest text-[10px] font-black px-3 py-1">Payment Verified</Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                      {project?.title}
                    </h1>
                    <div className="flex items-center gap-6 text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-primary-500" />
                        <span>Client ID: {project?.clientId.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-primary-500" />
                        <span>Posted {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'recently'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                       <CardTitle className="text-2xl font-display font-black">Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        {project?.description}
                      </div>

                      <div className="space-y-4 pt-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Required Skills</h4>
                        <div className="flex flex-wrap gap-3">
                          {project?.skillsRequired.map((skill) => (
                            <Badge key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none px-4 py-2 font-bold transition-all hover:bg-primary-500 hover:text-white cursor-default">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Client Trust Section */}
                  <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] overflow-hidden border-t-4 border-t-primary-500">
                    <CardHeader className="p-8 pb-0">
                       <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Building2 size={24} className="text-white" />
                         </div>
                         <div>
                            <CardTitle className="text-2xl font-display font-black">About the Client</CardTitle>
                            <CardDescription>Verified business information</CardDescription>
                         </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Company Name</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{project?.clientDetails?.companyName || 'Private Client'}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Industry</p>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{project?.clientDetails?.industry || 'Not specified'}</p>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Business Website</p>
                                {project?.clientDetails?.website ? (
                                  <a href={project.clientDetails.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary-600 hover:underline flex items-center gap-1">
                                    {project.clientDetails.website} <ChevronRight size={14} />
                                  </a>
                                ) : (
                                  <p className="text-sm font-bold text-slate-500 italic">No website provided</p>
                                )}
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Business Location</p>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{project?.clientDetails?.address || 'Verified Remote Client'}</p>
                             </div>
                          </div>
                       </div>
                    </CardContent>
                  </Card>

                  {/* Extra Features / Trust Badges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: ShieldCheck, title: 'Safe Payments', desc: 'Secure escrow matching' },
                      { icon: Trophy, title: 'Top Rated', desc: 'Work with elite clients' },
                      { icon: Zap, title: 'Quick Start', desc: 'Direct contract release' }
                    ].map((feature, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/50 space-y-3">
                         <div className="p-3 w-fit rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-primary-600">
                           <feature.icon size={24} />
                         </div>
                         <h5 className="font-bold text-slate-900 dark:text-white">{feature.title}</h5>
                         <p className="text-xs text-slate-500">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Proposal Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                   <motion.div 
                     key="success"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="p-10 rounded-[40px] bg-primary-600 text-white shadow-2xl shadow-primary-500/30 text-center space-y-6"
                   >
                     <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto scale-110">
                        <CheckCircle2 size={40} className="text-white" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-display font-black uppercase tracking-tight">Proposal Sent!</h4>
                        <p className="text-primary-100 font-medium">The client will be notified and we'll let you know if they're interested.</p>
                     </div>
                     <Link href="/freelancer/proposals" className="block">
                       <Button className="w-full bg-white text-primary-600 hover:bg-slate-50 rounded-2xl font-black transition-transform active:scale-95 shadow-xl">
                         View My Proposals
                       </Button>
                     </Link>
                   </motion.div>
                ) : project?.status !== 'open' ? (
                   <motion.div 
                     key="closed" 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }}
                     className="p-10 rounded-[40px] bg-slate-900 text-white shadow-2xl border border-slate-800 text-center space-y-6 relative overflow-hidden"
                   >
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500" />
                     <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
                        <ShieldCheck size={32} className="text-primary-500" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-display font-black uppercase tracking-tight">Bidding Closed</h4>
                        <p className="text-slate-400 text-sm font-medium">The client has already selected a freelancer and started development for this project.</p>
                     </div>
                     <Link href="/projects/browse" className="block pt-2">
                       <Button variant="outline" className="w-full rounded-2xl border-slate-700 hover:bg-slate-800 text-white font-bold transition-all">
                         Browse Other Projects
                       </Button>
                     </Link>
                   </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     <Card className="border-none shadow-2xl shadow-slate-200/60 dark:shadow-none bg-white dark:bg-slate-900/60 backdrop-blur-3xl rounded-[40px] overflow-hidden">
                       <CardHeader className="p-8 pb-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2">Bid on project</p>
                          <CardTitle className="text-2xl font-display font-black">Submit Proposal</CardTitle>
                       </CardHeader>
                       <CardContent className="p-8 pt-4">
                         {isLoading ? (
                            <div className="space-y-4">
                               <Skeleton className="h-24 w-full" />
                               <Skeleton className="h-12 w-full" />
                               <Skeleton className="h-12 w-full" />
                            </div>
                         ) : (
                           <form onSubmit={handleSubmitProposal} className="space-y-6">
                             <AIProposalGenerator 
                                projectId={id as string} 
                                onGenerated={handleAIProposal} 
                             />
                             <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 space-y-4">
                               <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                  <span>Client Budget</span>
                                  <span className="text-slate-900 dark:text-white">
                                    ${project?.budget.min} - ${project?.budget.max}
                                  </span>
                               </div>
                               <Input
                                 type="number"
                                 label="Your Bid Amount ($)"
                                 value={bidAmount}
                                 onChange={(e) => setBidAmount(Number(e.target.value))}
                                 placeholder="Enter your bid..."
                                 required
                                 className="bg-white dark:bg-slate-900 dark:border-slate-700"
                               />
                             </div>
 
                             <Input
                               type="text"
                               label="Estimated Duration"
                               value={deliveryTime}
                               onChange={(e) => setDeliveryTime(e.target.value)}
                               placeholder="e.g. 5 days, 1 week..."
                               required
                               icon={<Clock size={16} />}
                             />
 
                             <Textarea
                               label="Cover Letter"
                               placeholder="Sell yourself! Highlight similar projects you've done..."
                               value={coverLetter}
                               onChange={(e) => setCoverLetter(e.target.value)}
                               required
                             />
 
                             {submitError && (
                                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex items-center gap-2">
                                  <Zap size={14} className="fill-red-500" /> {submitError}
                                </div>
                             )}
 
                             <Button 
                               type="submit" 
                               className="w-full h-14 rounded-2xl font-black text-lg group"
                               isLoading={isSubmitting}
                             >
                               Send Proposal <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                             </Button>
                           </form>
                         )}
                       </CardContent>
                       <CardFooter className="p-8 pt-0 flex flex-col items-center gap-2">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                            Fair bid policy applies
                          </p>
                       </CardFooter>
                     </Card>
                  </motion.div>
                )}
              </AnimatePresence>
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
