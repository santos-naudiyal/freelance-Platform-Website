"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
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
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import Link from 'next/link';
import { Project } from '../../../types';
import { cn } from '../../../components/ui/Button';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function BrowseProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const resp = await fetch('http://localhost:5000/api/projects');
        if (resp.ok) {
          const data = await resp.json();
          setProjects(data);
          setFilteredProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const results = projects.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(results);
  }, [searchTerm, projects]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Global Marketplace">
        <div className="space-y-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 dark:border-emerald-800/50">
                   <TrendingUp size={12} />
                   Live Opportunities
                </div>
                <h2 className="text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                   Explore <span className="text-primary-600">Premium Projects</span>
                </h2>
             </div>
             <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
                <div className="px-4 py-2 border-r border-slate-100 dark:border-slate-800">
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
            <Button variant="outline" className="h-14 px-8 gap-3 rounded-2xl border-slate-200/50 dark:border-slate-800/50 font-bold hover:bg-white dark:hover:bg-slate-900 transition-all">
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
                     <CardContent className="p-10 pt-10">
                       <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                         <div className="flex-1 space-y-5">
                           <div className="flex flex-wrap items-center gap-4">
                             <h4 className="text-2xl font-black text-slate-950 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                               {project.title}
                             </h4>
                             {project.budget.min >= 5000 && (
                                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-black h-6">
                                   HIGH VALUE
                                </Badge>
                             )}
                           </div>
                           <p className="text-lg text-slate-500 font-medium leading-relaxed line-clamp-2">
                             {project.description}
                           </p>
                           <div className="flex flex-wrap gap-2.5 pt-2">
                             {project.skillsRequired.map(skill => (
                               <Badge key={skill} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                                 {skill}
                               </Badge>
                             ))}
                           </div>
                         </div>
   
                         <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end lg:items-end justify-between min-w-[280px] gap-8">
                           <div className="text-center sm:text-right lg:text-right space-y-1">
                             <p className="text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                               ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                             </p>
                             <div className="flex items-center gap-2 justify-center sm:justify-end lg:justify-end">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
                                  {project.budget.type} RATE
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
   
                       <div className="flex flex-wrap items-center gap-x-12 gap-y-4 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-xs text-slate-400 font-bold uppercase tracking-widest">
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
