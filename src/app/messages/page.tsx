"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  Settings,
  SearchIcon,
  Filter,
  User,
  Briefcase,
  MessageCircle,
  Inbox,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { callBackend } from '@/lib/api';
import { Project } from '@/types';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useSocket } from '@/components/providers/SocketProvider';
import Link from 'next/link';

type ProjectConversation = Project & {
  lastMessageAt?: string | number | Date;
};

const clientSidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

const freelancerSidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { unreadCounts, clearUnread } = useSocket();
  const [activeProjects, setActiveProjects] = useState<ProjectConversation[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectConversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const projects = await callBackend('projects/my');
        // Show projects that are in progress OR open (for clients to discuss bids)
        const filtered = (projects || []).filter((p: Project) => 
          user?.role === 'freelancer' || ['open', 'in_progress', 'completed'].includes(p.status)
        );
        // Sort by last message time (WhatsApp style)
        const sorted = (filtered || []).sort((a: ProjectConversation, b: ProjectConversation) => {
          const getTime = (value?: string | number | Date) => new Date(value || 0).getTime();
          return getTime(b.lastMessageAt || b.createdAt) - getTime(a.lastMessageAt || a.createdAt);
        });
        setActiveProjects(sorted);
        
        // Auto-select first project if available
        if (sorted.length > 0 && !selectedProject) {
          setSelectedProject(sorted[0]);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchActiveProjects();
  }, [user, selectedProject]);

  const filteredProjects = activeProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.otherPersonName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSidebar = user?.role === 'freelancer' ? freelancerSidebarItems : clientSidebarItems;
  const dashboardHref = user?.role === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard';

  return (
    <ProtectedRoute allowedRoles={['client', 'freelancer', 'admin']}>
      <DashboardLayout sidebarItems={activeSidebar} title="Messages">
        <div className="h-[calc(100vh-132px)] sm:h-[calc(100vh-160px)]">
          
          <div className="flex h-full gap-4 lg:gap-8">
            
            {/* CONVERSATION LIST (LEFT PANE) */}
            <div className={cn(
              "h-full flex-col gap-4 sm:gap-6 lg:flex w-full lg:w-96",
              isMobileListOpen ? "flex" : "hidden lg:flex"
            )}>
              
              {/* Search & Filter */}
              <div className="flex items-center gap-3">
                <div className="flex-grow relative group">
                  <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search people or projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  />
                </div>
                <Button variant="outline" className="h-12 w-12 rounded-2xl p-0 shrink-0">
                  <Filter size={18} />
                </Button>
              </div>

              {/* Conversations */}
              <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-slate-50 dark:bg-slate-900 animate-pulse rounded-2xl mx-1" />
                  ))
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setSelectedProject(project);
                        clearUnread(project.id);
                        setIsMobileListOpen(false);
                      }}
                      className={cn(
                        "w-full p-5 rounded-3xl border transition-all text-left group relative overflow-hidden",
                        selectedProject?.id === project.id
                          ? "bg-slate-950 dark:bg-white border-slate-950 dark:border-white shadow-2xl"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800"
                      )}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 relative transition-transform duration-500 group-hover:scale-110",
                          selectedProject?.id === project.id 
                            ? "bg-white/10 dark:bg-slate-900/10 text-white dark:text-slate-900" 
                            : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary-500 transition-colors"
                        )}>
                          <User size={24} />
                          {unreadCounts[project.id] > 0 && selectedProject?.id !== project.id && (
                            <div className="absolute -top-1.5 -right-1.5 h-6 w-6 bg-primary-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 animate-bounce shadow-lg">
                              {unreadCounts[project.id]}
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden space-y-0.5">
                          <h5 className={cn(
                            "text-base font-black truncate tracking-tight",
                            selectedProject?.id === project.id ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-white"
                          )}>
                             {project.otherPersonName || (user?.role === 'client' ? 'Assigned Freelancer' : 'Project Client')}
                             {project.otherPersonCompany && (
                               <span className={cn(
                                 "ml-2 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest",
                                 selectedProject?.id === project.id ? "bg-white/10 text-white/80" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                               )}>
                                 {project.otherPersonCompany}
                               </span>
                             )}
                          </h5>
                          <p className={cn(
                            "text-xs font-bold truncate opacity-80",
                            selectedProject?.id === project.id ? "text-white/60 dark:text-slate-950/60" : "text-slate-500"
                          )}>
                            {project.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-300">
                      <Inbox size={40} />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No conversations found</p>
                  </div>
                )}
              </div>

            </div>

            {/* CHAT INTERFACE (RIGHT PANE) */}
            <div className={cn(
              "h-full flex-grow flex-col overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-slate-50 p-2 shadow-inner dark:border-slate-800/50 dark:bg-slate-900/30",
              isMobileListOpen ? "hidden lg:flex" : "flex"
            )}>
              {selectedProject ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-3 py-3 dark:border-slate-800 lg:hidden">
                    <button
                      type="button"
                      onClick={() => setIsMobileListOpen(true)}
                      className="rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm transition-colors hover:text-primary-600 dark:bg-slate-950 dark:text-slate-300"
                    >
                      Back
                    </button>
                    <div className="min-w-0 text-right">
                      <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                        {selectedProject.otherPersonName || (user?.role === 'client' ? 'Assigned Freelancer' : 'Project Client')}
                      </p>
                      <p className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {selectedProject.title}
                      </p>
                    </div>
                  </div>
                  <ChatInterface 
                    projectId={selectedProject.id} 
                    recipientName={selectedProject.otherPersonName || (user?.role === 'client' ? 'Assigned Freelancer' : 'Project Client')}
                  />
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-50 dark:border-slate-800 relative">
                    <div className="absolute -top-10 -right-10 p-12 bg-primary-500/10 blur-3xl rounded-full" />
                    <MessageCircle size={64} className="text-primary-500 mx-auto relative z-10" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Select a conversation</h3>
                    <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">
                      Start chatting with your partner to align on project objectives and milestones.
                    </p>
                    <Link href={dashboardHref} className="inline-block pt-2 lg:hidden">
                      <Button size="sm" className="rounded-xl">Go to dashboard</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
