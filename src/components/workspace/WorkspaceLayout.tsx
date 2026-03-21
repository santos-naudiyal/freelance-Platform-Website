"use client";

import React from 'react';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { Bell, Search, Settings, MoreHorizontal, ShieldCheck, Activity } from 'lucide-react';
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
  
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-white dark:bg-slate-950">
        <WorkspaceSidebar projectSlug={projectSlug} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Workspace Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">
              {workspace?.title || projectSlug.replace(/-/g, ' ')}
            </h1>
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors",
              loading ? "bg-slate-100 text-slate-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            )}>
              {loading ? (
                <>...Syncing</>
              ) : (
                <><Activity size={12} className="animate-pulse" /> Live OS Active</>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
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
            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 transition-colors">
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
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  </AuthGuard>
  );
}
