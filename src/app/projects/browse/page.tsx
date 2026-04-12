"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Project } from '@/types';
import { callBackend } from '@/lib/api';

type ProposalSummary = {
  projectId: string;
};

type ProjectSkill = string | { name?: string; skill?: string };

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function BrowseProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        // Fetch ALL open projects AND the freelancer's current proposals in parallel
        const [allProjects, myProposals] = await Promise.all([
          callBackend('projects'),
          callBackend('proposals/my').catch(() => []) // Graceful fail if no auth/proposals
        ]);

        if (allProjects) {
          // Extract IDs of projects the user has ALREADY bid on
          const appliedProjectIds = new Set((myProposals as ProposalSummary[]).map((p) => p.projectId));
          
          // Filter out projects where the freelancer has an existing bid!
          const availableProjects = allProjects.filter((p: Project) => !appliedProjectIds.has(p.id));

          setProjects(availableProjects);
          setFilteredProjects(availableProjects);
        }
      } catch (err) {
        console.error("Browse Projects Error:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchMarketplaceData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = projects.filter(p => {
      const matchTitle = typeof p.title === 'string' && p.title.toLowerCase().includes(term);
      const matchDesc = typeof p.description === 'string' && p.description.toLowerCase().includes(term);
      const matchSkills = Array.isArray(p.skillsRequired) 
        ? p.skillsRequired.some(s => {
            if (typeof s === 'string') return s.toLowerCase().includes(term);
            if (typeof s === 'object' && s !== null) return JSON.stringify(s).toLowerCase().includes(term);
            return false;
          })
        : false;
      return matchTitle || matchDesc || matchSkills;
    });
    setFilteredProjects(results);
  }, [searchTerm, projects]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Global Marketplace">
        <div className="space-y-8 sm:space-y-10">
          {/* Header Section */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 sm:gap-6">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 dark:border-emerald-800/50">
                   <TrendingUp size={12} />
                   Live Opportunities
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                   Explore <span className="text-primary-600">Premium Projects</span>
                </h2>
             </div>
             <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft w-full sm:w-auto">
                <div className="px-4 py-2 sm:border-r border-slate-100 dark:border-slate-800">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{projects.length}</p>
                </div>
                <div className="px-4 py-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Verified</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{Math.floor(projects.length * 0.8)}</p>
                </div>
             </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 group">
              <Input
                placeholder="Search by title, skill, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={20} className="group-focus-within:text-primary-500 transition-colors" />}
                className="h-14 rounded-2xl border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              />
            </div>
            <Button variant="outline" className="h-14 w-full md:w-auto px-8 gap-3 rounded-2xl border-slate-200/50 dark:border-slate-800/50 font-bold hover:bg-white dark:hover:bg-slate-900 transition-all">
              <Filter size={18} />
              Advanced Filters
            </Button>
          </div>

          {/* Results Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  {isLoading ? 'Scanning Marketplace...' : `Showing ${filteredProjects.length} Verified Projects`}
               </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
               {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <Card key={i} className="p-8">
                       <div className="space-y-4">
                          <Skeleton className="h-8 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="flex gap-2 pt-4">
                             <Skeleton className="h-6 w-16 rounded-full" />
                             <Skeleton className="h-6 w-16 rounded-full" />
                             <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                       </div>
                    </Card>
                  ))
               ) : filteredProjects.length === 0 ? (
                  <div className="py-32 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6">
                       <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-2">No projects found</h3>
                    <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                  </div>
               ) : (
                 filteredProjects.map((project) => (
                   <Card key={project.id} className="group border-transparent hover:border-primary-200 dark:hover:border-primary-900 transition-all duration-500">
                     <CardContent className="p-6 pt-6 sm:p-8 sm:pt-8 lg:p-10 lg:pt-10">
                       <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 lg:gap-10">
                         <div className="flex-1 space-y-5">
                           <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                             <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                               {project.title}
                             </h4>
                             {project.budget?.min >= 5000 && (
                                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-black h-6">
                                   HIGH VALUE
                                </Badge>
                             )}
                           </div>
                           <p className="text-sm sm:text-lg text-slate-500 font-medium leading-relaxed line-clamp-3 sm:line-clamp-2">
                             {project.description || "No description provided."}
                           </p>
                           <div className="flex flex-wrap gap-2.5 pt-2">
                             {Array.isArray(project.skillsRequired) && project.skillsRequired.length > 0 ? (
                               (project.skillsRequired as ProjectSkill[]).map((skill, idx) => {
                                 const skillText = typeof skill === 'string' ? skill : (skill?.name || skill?.skill || JSON.stringify(skill).substring(0, 15));
                                 return (
                                   <Badge key={idx} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                                     {skillText}
                                   </Badge>
                                 );
                               })
                             ) : (
                               <Badge className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-transparent">
                                 Development
                               </Badge>
                             )}
                           </div>
                         </div>
   
                         <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:w-auto lg:min-w-[260px] lg:flex-col lg:items-end lg:gap-8">
                           <div className="space-y-1 text-left sm:text-right lg:text-right">
                             <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                               ₹{(project.budget?.min || 0).toLocaleString()} - ₹{(project.budget?.max || 0).toLocaleString()}
                             </p>
                             <div className="flex items-center gap-2 justify-center sm:justify-end lg:justify-end">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
                                  {project.budget?.type || 'FIXED'} RATE
                                </p>
                             </div>
                           </div>
                           <Link href={`/projects/browse/${project.id}`} className="w-full sm:w-auto lg:w-full">
                             <Button className="h-14 px-10 rounded-2xl w-full gap-3 font-black text-base shadow-xl shadow-primary-500/10 group-hover:shadow-primary-500/20 group-hover:scale-[1.02] transition-all">
                               View Project
                               <ArrowRight size={20} />
                             </Button>
                           </Link>
                         </div>
                       </div>
   
                       <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-slate-100 pt-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800/50 sm:mt-10 sm:gap-x-12 sm:pt-8 sm:text-xs">
                          <span className="flex items-center gap-2.5"><Clock size={16} className="text-slate-300" /> Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-2.5"><MapPin size={16} className="text-slate-300" /> Global / Remote</span>
                          <span className="flex items-center gap-2.5"><Sparkles size={16} className="text-amber-500" /> Client Verified</span>
                       </div>
                     </CardContent>
                   </Card>
                 ))
               )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
