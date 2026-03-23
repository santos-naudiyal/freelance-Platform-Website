"use client";

import React, { use } from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AICostRiskEstimator } from '@/components/workspace/AICostRiskEstimator';
import { AIProjectPlanner } from '@/components/workspace/AIProjectPlanner';
import { useWorkspace } from '@/hooks/useWorkspace';
import { AIExpertMatching } from '@/components/workspace/AIExpertMatching';
import { ActivityFeed } from '@/components/workspace/ActivityFeed';
import { Timeline } from '@/components/workspace/Timeline';
import { TaskBoard } from '@/components/workspace/TaskBoard';
import { Chat } from '@/components/workspace/Chat';

export default function WorkspacePage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = use(params);
  const { workspace, loading } = useWorkspace(project);

  if (loading) {
    return (
      <WorkspaceLayout projectSlug={project}>
        <div className="flex items-center justify-center h-full">
           <div className="animate-pulse flex items-center gap-2 text-primary-600 font-bold">
              <Sparkles size={20} /> Loading Workspace Data...
           </div>
        </div>
      </WorkspaceLayout>
    );
  }

  const projectOutcome = workspace?.title || project.replace(/-/g, ' ');

  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Project Progress Card */}
        <div className="premium-card p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary-600/20 to-transparent blur-3xl -z-0" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-display font-black tracking-tight mb-2 uppercase">{workspace?.title || 'Project Workspace'}</h2>
                <p className="text-slate-400 font-medium">Status: {workspace?.status || 'Active'}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-display font-black text-primary-400">{workspace?.progress || 0}%</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Overall Progress</div>
              </div>
            </div>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-10">
              <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full shadow-lg shadow-primary-500/50 transition-all duration-1000" style={{ width: `${workspace?.progress || 0}%` }} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Task Completion
                </div>
                <div className="text-lg font-bold">{workspace?.completedTasks || 0} / {workspace?.totalTasks || 0} ({workspace?.progress || 0}%)</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Clock size={12} className="text-blue-400" />
                  Last Activity
                </div>
                <div className="text-lg font-bold">10 mins ago</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <AlertCircle size={12} className="text-rose-400" />
                  AI Delay Detection
                </div>
                <div className="text-lg font-bold text-emerald-400">0 Delays Detected</div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1.5 mb-2">
                  <Users size={12} className="text-purple-400" />
                  Who's working now
                </div>
                <div className="flex -space-x-2 overflow-hidden justify-end">
                  <div className="relative">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-slate-900 bg-emerald-400"></span>
                  </div>
                  <div className="relative z-10">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="Marcus" />
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-slate-900 bg-amber-400 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: AI Intelligence & Recent Activity */}
          <div className="lg:col-span-2 space-y-10">
            <section>
               <AIProjectPlanner outcome={projectOutcome} />
            </section>
            
            <section>
                <AICostRiskEstimator project={workspace} />
            </section>

             <section>
                <AIExpertMatching outcome={projectOutcome} />
            </section>

             <section>
                <Timeline workspaceId={project} />
             </section>

             <section>
                 <ActivityFeed workspaceId={project} />
             </section>
          </div>

          {/* Sidebar Area: Team & Resources */}
          <div className="space-y-8">
            <section>
               <Chat workspaceId={project} />
            </section>

            <section>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <Users size={16} />
                Workspace Experts
              </h3>
              <div className="space-y-3">
                {workspace?.members?.map((member: any) => (
                  <div key={member.name || member.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name || 'User'}`} 
                          className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800" 
                          alt={member.name || 'User'} 
                        />
                        <div className={cn(
                          "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-950",
                          "bg-emerald-500" // assume online for now
                        )} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{member.name || 'Workspace Member'}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{member.role || 'Member'}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!workspace?.members || workspace.members.length === 0) && (
                   <div className="p-4 text-center text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      No members joined yet.
                   </div>
                )}
              </div>
            </section>

            <button className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-sm border border-slate-100 dark:border-slate-800">
              Invite an Expert
            </button>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
