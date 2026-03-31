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
  CreditCard, 
  Settings,
  SearchIcon,
  Filter,
  User,
  Briefcase,
  ChevronRight,
  MessageCircle,
  Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { callBackend } from '@/lib/api';
import { Project } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const projects = await callBackend('projects/my');
        // Filter projects that are in_progress or completed (have active chats)
        const inProgress = (projects || []).filter((p: Project) => 
          p.status === 'in_progress' || p.status === 'completed'
        );
        setActiveProjects(inProgress);
        
        // Auto-select first project if available
        if (inProgress.length > 0 && !selectedProject) {
          setSelectedProject(inProgress[0]);
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
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarItems={sidebarItems} title="Messages">
        <div className="h-[calc(100vh-160px)] max-w-7xl mx-auto">
          
          <div className="flex h-full gap-8">
            
            {/* CONVERSATION LIST (LEFT PANE) */}
            <div className="w-96 flex flex-col gap-6 h-full">
              
              {/* Search & Filter */}
              <div className="flex items-center gap-3">
                <div className="flex-grow relative group">
                  <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search chats..."
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
                      onClick={() => setSelectedProject(project)}
                      className={cn(
                        "w-full p-5 rounded-2xl border transition-all text-left group relative overflow-hidden",
                        selectedProject?.id === project.id
                          ? "bg-primary-600 border-primary-600 shadow-xl shadow-primary-600/20"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800"
                      )}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                          selectedProject?.id === project.id 
                            ? "bg-white/20 text-white" 
                            : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary-500 transition-colors"
                        )}>
                          <Briefcase size={22} />
                        </div>
                        <div className="overflow-hidden">
                          <h5 className={cn(
                            "text-sm font-black truncate",
                            selectedProject?.id === project.id ? "text-white" : "text-slate-900 dark:text-white"
                          )}>
                            {project.title}
                          </h5>
                          <p className={cn(
                            "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                            selectedProject?.id === project.id ? "text-white/60" : "text-slate-400"
                          )}>
                            {project.status.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      {selectedProject?.id === project.id && (
                        <motion.div layoutId="active-chat" className="absolute left-0 top-0 h-full w-1 bg-white" />
                      )}
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
            <div className="flex-grow h-full bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 p-2 overflow-hidden shadow-inner flex flex-col">
              {selectedProject ? (
                <ChatInterface 
                  projectId={selectedProject.id} 
                  recipientName={user?.role === 'client' ? 'Assigned Freelancer' : 'Project Client'}
                />
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
