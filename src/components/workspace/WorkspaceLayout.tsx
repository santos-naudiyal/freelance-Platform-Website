"use client";

import React from 'react';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { Bell, Search, MoreHorizontal, Activity, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/hooks/useWorkspace';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuthStore } from '@/store/useAuthStore';

export function WorkspaceLayout({ 
  children, 
  projectSlug 
}: { 
  children: React.ReactNode, 
  projectSlug: string 
}) {
  const { workspace, loading } = useWorkspace(projectSlug);
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-white dark:bg-slate-950">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close workspace navigation"
            className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <WorkspaceSidebar
          projectSlug={projectSlug}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Workspace Header */}
        <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
            <h1 className="truncate text-base sm:text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">
              {workspace?.title || projectSlug.replace(/-/g, ' ')}
            </h1>
            <div className={cn(
              "mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors",
              loading ? "bg-slate-100 text-slate-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            )}>
              {loading ? (
                <>...Syncing</>
              ) : (
                <><Activity size={12} className="animate-pulse" /> Live OS Active</>
              )}
            </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks, files..." 
                className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none text-sm font-medium w-64 focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 transition-colors">
              <Bell size={20} />
            </button>
            <button className="hidden sm:block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 p-[2px]">
              <div className="h-full w-full rounded-[9px] bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt={user?.name || "User"} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  </AuthGuard>
  );
}
