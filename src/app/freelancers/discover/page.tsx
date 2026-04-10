"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { Card } from '../../../components/ui/Card';
import { 
  Compass, 
  Users,
  LayoutDashboard,
  PlusSquare,
  ClipboardList,
  Search,
  MessageSquare,
  Settings,
  Star,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { callBackend } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import Link from 'next/link';

type FreelancerProfile = {
  avatar?: string;
  title?: string;
  department?: string;
  bio?: string;
  skills?: string[];
};

type FreelancerCard = {
  id: string;
  name: string;
  rating?: number;
  profile?: FreelancerProfile;
};

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Users },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

const DEPARTMENTS = [
  'All Profiles',
  'IT & Software',
  'Finance & Accounting',
  'Design & Creative',
  'Marketing & Sales',
  'Engineering & Architecture',
  'Other'
];

export default function DiscoverFreelancersPage() {
  const [freelancers, setFreelancers] = useState<FreelancerCard[]>([]);
  const [filtered, setFiltered] = useState<FreelancerCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState('All Profiles');

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const data = await callBackend('freelancers');
        setFreelancers(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to fetch freelancers:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchFreelancers();
  }, []);

  useEffect(() => {
    if (activeDepartment === 'All Profiles') {
      setFiltered(freelancers);
    } else {
      setFiltered(freelancers.filter(f => f.profile?.department === activeDepartment));
    }
  }, [activeDepartment, freelancers]);

  return (
    <ProtectedRoute allowedRoles={['client']}>
    <DashboardLayout sidebarItems={sidebarItems} title="Find Freelancers">
      <div className="space-y-8 py-3 sm:space-y-10 sm:py-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
             Discover <span className="text-primary-600">Talent</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
             Explore top-rated freelancers perfectly categorized for your project&apos;s needs.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
           {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDepartment(dept)}
                className={cn(
                  "px-4 sm:px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase border transition-all duration-300",
                  activeDepartment === dept 
                     ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xl shadow-slate-900/10" 
                     : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                 {dept}
              </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {isLoading ? (
             [1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="border-transparent p-6 space-y-4">
                   <div className="flex items-center gap-4">
                     <Skeleton className="h-16 w-16 rounded-2xl" />
                     <div className="space-y-2">
                       <Skeleton className="h-5 w-32" />
                       <Skeleton className="h-4 w-24" />
                     </div>
                   </div>
                   <Skeleton className="h-16 w-full" />
                   <Skeleton className="h-10 w-full" />
                </Card>
             ))
          ) : filtered.length === 0 ? (
             <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50 dark:bg-slate-900/20">
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                   <Compass size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">No Freelancers Found</h3>
                <p className="text-slate-500">There are currently no listed freelancers available in the &quot;{activeDepartment}&quot; department.</p>
             </div>
          ) : (
             filtered.map((freelancer) => {
               const skills = freelancer.profile?.skills ?? [];

               return (
               <Card key={freelancer.id} className="group border-transparent hover:border-primary-200 dark:hover:border-primary-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left p-6 sm:p-8">
                 <div className="w-full flex items-start flex-col gap-6">
                    <div className="w-full flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden shrink-0 ring-4 ring-white dark:ring-slate-950 shadow-inner">
                        {freelancer.profile?.avatar ? (
                          <img src={freelancer.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="text-slate-400" size={24} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{freelancer.name}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                               {freelancer.rating || 5.0} Rating
                            </span>
                         </div>
                      </div>
                    </div>

                    <div className="w-full flex-1 space-y-4">
                       <div>
                         <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{freelancer.profile?.title || 'Freelancer'}</p>
                         <p className="text-[10px] uppercase font-black tracking-widest text-primary-600 mt-1">{freelancer.profile?.department || 'IT & Software'}</p>
                       </div>
                       
                       <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {freelancer.profile?.bio || 'No bio provided.'}
                       </p>

                       <div className="flex flex-wrap gap-2 pt-2">
                         {skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider rounded-lg">
                               {skill}
                            </span>
                         ))}
                         {skills.length > 3 && (
                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                               +{skills.length - 3} more
                            </span>
                         )}
                       </div>
                    </div>

                    <div className="w-full pt-4 mt-auto">
                       <Link href={`/freelancers/${freelancer.id}`} className="block w-full">
                         <Button className="w-full h-12 rounded-2xl font-bold bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 group-hover:scale-[1.02] transition-transform">
                            View Full Profile
                         </Button>
                       </Link>
                    </div>
                 </div>
               </Card>
             )})
          )}
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}
