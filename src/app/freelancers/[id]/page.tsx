"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { callBackend } from '../../../lib/api';
import { 
  Users, 
  Star, 
  MapPin, 
  Briefcase, 
  Globe, 
  Github, 
  Navigation,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  LayoutDashboard,
  PlusSquare,
  ClipboardList,
  Search,
  MessageSquare,
  CreditCard,
  Settings
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Users },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await callBackend(`freelancers/${id}`);
        setFreelancer(data);
      } catch (err) {
        console.error("Failed to fetch freelancer profile:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  return (
    <ProtectedRoute allowedRoles={['client', 'freelancer', 'admin']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Freelancer Profile">
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          
          <button 
             onClick={() => router.back()} 
             className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
             <ChevronLeft size={16} /> Back to previous page
          </button>

          {isLoading ? (
            <div className="space-y-6">
               <Skeleton className="h-64 w-full rounded-[3rem]" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-40 w-full rounded-3xl" />
                  <Skeleton className="h-40 w-full rounded-3xl md:col-span-2" />
               </div>
            </div>
          ) : !freelancer ? (
            <div className="py-20 text-center text-slate-500 font-bold">Freelancer not found.</div>
          ) : (
            <div className="space-y-8">
               {/* Header Hero Card */}
               <Card className="overflow-hidden border-transparent shadow-2xl shadow-primary-500/5 bg-white dark:bg-slate-950">
                 <div className="h-32 w-full bg-gradient-to-r from-primary-600 to-indigo-600"></div>
                 <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
                       <div className="flex items-end gap-6">
                          <div className="h-32 w-32 rounded-3xl bg-slate-100 dark:bg-slate-800 border-8 border-white dark:border-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                             {freelancer.freelancerDetails?.profile?.avatar || freelancer.avatar ? (
                               <img src={freelancer.freelancerDetails?.profile?.avatar || freelancer.avatar} alt="Profile" className="h-full w-full object-cover" />
                             ) : (
                               <Users className="text-slate-400" size={48} />
                             )}
                          </div>
                          <div className="pb-2">
                             <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                                {freelancer.name}
                             </h1>
                             <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-400">
                                   <MapPin size={16} /> {freelancer.country || 'Global'}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                                   <CheckCircle2 size={16} /> Identity Verified
                                </span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap gap-3 pb-2">
                          <Button className="rounded-full shadow-lg shadow-primary-500/20 px-8 font-black">
                             Invite to Job
                          </Button>
                          <Button variant="outline" className="rounded-full px-6 text-slate-700 dark:text-slate-300">
                             <MessageSquare className="mr-2" size={16} /> Message
                          </Button>
                       </div>
                    </div>
                 </div>
               </Card>

               {/* Content Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Left Column: Stats & Links */}
                  <div className="space-y-8">
                     <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                        <CardContent className="p-6 space-y-6">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Hourly Rate</p>
                              <p className="text-3xl font-display font-black text-slate-900 dark:text-white">
                                 ${freelancer.freelancerDetails?.profile?.hourlyRate || '0'} <span className="text-sm text-slate-400">/hr</span>
                              </p>
                           </div>
                           <hr className="border-slate-200 dark:border-slate-800" />
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Success Metrics</p>
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Rating</span>
                                    <span className="flex items-center gap-1 text-sm font-black text-slate-900 dark:text-white">
                                       <Star size={14} className="text-amber-400 fill-amber-400" /> {freelancer.freelancerDetails?.rating || 5.0}
                                    </span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Jobs Completed</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">12</span>
                                 </div>
                              </div>
                           </div>
                           <hr className="border-slate-200 dark:border-slate-800" />
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Professional Links</p>
                              <div className="space-y-3">
                                 {freelancer.freelancerDetails?.profile?.githubUrl && (
                                    <a href={freelancer.freelancerDetails.profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                       <Github size={18} /> GitHub Profile
                                    </a>
                                 )}
                                 {freelancer.freelancerDetails?.profile?.portfolioLinks?.length > 0 && (
                                    <a href={freelancer.freelancerDetails.profile.portfolioLinks[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                       <Globe size={18} /> Portfolio Website
                                    </a>
                                 )}
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Right Column: Bio & Skills */}
                  <div className="md:col-span-2 space-y-8">
                     <div>
                        <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                           <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
                              {freelancer.freelancerDetails?.profile?.title || 'Professional Freelancer'}
                           </h2>
                           <Badge variant="info" className="uppercase tracking-widest text-[9px] px-3">
                              {freelancer.freelancerDetails?.profile?.department || 'IT & Software'}
                           </Badge>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                           {freelancer.freelancerDetails?.profile?.bio || 'This freelancer has not provided a bio yet.'}
                        </div>
                     </div>

                     <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                           <Briefcase size={20} className="text-primary-500" /> Skills & Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {freelancer.freelancerDetails?.profile?.skills?.length > 0 ? (
                              freelancer.freelancerDetails.profile.skills.map((skill: string, idx: number) => (
                                 <span key={idx} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl">
                                    {skill}
                                 </span>
                              ))
                           ) : (
                              <span className="text-sm text-slate-500">No specific skills listed.</span>
                           )}
                        </div>
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
