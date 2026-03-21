"use client";

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flag,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMilestones } from '@/hooks/useMilestones';
import { format } from 'date-fns';

export function Timeline({ workspaceId }: { workspaceId: string }) {
  const { milestones, loading } = useMilestones(workspaceId);

  // Derive current phase index based on completed milestones
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const currentPhaseIndex = Math.min(completedCount, 4);

  return (
    <div className="space-y-12">
      {/* Visual Progress Bar */}
      <div className="premium-card p-10 bg-slate-50 dark:bg-slate-900/50 border-none relative overflow-hidden">
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-0" />
          <div 
             className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 -translate-y-1/2 -z-0 shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-1000" 
             style={{ width: `${Math.min(100, (currentPhaseIndex / 4) * 100)}%` }}
          />
          
          {['Planning', 'Design', 'Development', 'Testing', 'Delivery'].map((phase, i) => (
            <div key={phase} className="relative z-10 flex flex-col items-center gap-3">
              <div className={cn(
                "h-6 w-6 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                i < currentPhaseIndex ? "bg-primary-600 border-primary-200 dark:border-primary-900 scale-125 shadow-lg shadow-primary-500/20" :
                i === currentPhaseIndex ? "bg-white dark:bg-slate-950 border-primary-500 scale-125 animate-pulse" :
                "bg-slate-200 dark:bg-slate-800 border-transparent"
              )}>
                {i < currentPhaseIndex && <CheckCircle2 size={10} className="text-white" />}
                {i === currentPhaseIndex && <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                i <= currentPhaseIndex ? "text-primary-600 dark:text-primary-400" : "text-slate-400"
              )}>
                {phase}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-slate-500 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-950/30 text-primary-600">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-primary-600">AI Prediction</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Expected delivery: AI is analyzing progress...</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </div>
      </div>

      {loading ? (
           <div className="space-y-6 pl-8 animate-pulse">
              <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
              <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
           </div>
      ) : milestones.length === 0 ? (
           <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-sm">
              No milestones defined yet. Use the AI Planner to generate a roadmap.
           </div>
      ) : (
      <div className="relative pl-8 space-y-10">
        <div className="absolute top-4 bottom-0 left-[11px] w-[2px] bg-slate-100 dark:bg-slate-800" />
        
        {milestones.map((milestone) => {
           // Default mappings if status is not fully standard yet
           const isCompleted = milestone.status === 'completed' || milestone.status === 'paid';
           const isCurrent = milestone.status === 'active' || milestone.status === 'in_progress' || (milestone.status === 'pending' && !isCompleted);
           const status = isCompleted ? 'completed' : (isCurrent ? 'current' : 'upcoming');

           return (
          <div key={milestone.id} className="relative group">
            <div className={cn(
              "absolute -left-[30px] h-6 w-6 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-300",
              status === 'completed' ? "bg-primary-600 border-primary-100 dark:border-primary-900" :
              status === 'current' ? "bg-white dark:bg-slate-950 border-primary-500 animate-pulse" :
              "bg-slate-100 dark:bg-slate-800 border-white dark:border-slate-950"
            )}>
              {status === 'completed' && <CheckCircle2 size={10} className="text-white" />}
              {status === 'current' && <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />}
            </div>

            <div className={cn(
              "premium-card p-6 border-slate-100 dark:border-slate-800 transition-all duration-500 group-hover:scale-[1.01]",
              status === 'current' ? "ring-2 ring-primary-500/20 bg-primary-50/10 dark:bg-primary-900/5 shadow-xl" : "shadow-sm"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className={cn(
                    "text-lg font-bold tracking-tight mb-1",
                    status === 'completed' ? "text-slate-500 line-through decoration-primary-500/30" : "text-slate-900 dark:text-white"
                  )}>
                    {milestone.title}
                  </h4>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Clock size={12} />
                    {milestone.dueDate ? `Due by ${format(milestone.dueDate, 'MMM dd')}` : 'No due date'}
                  </div>
                </div>
                {status === 'completed' ? (
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    Verified
                  </div>
                ) : status === 'current' ? (
                  <div className="px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    In Progress
                  </div>
                ) : null}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        )})}
      </div>
      )}
    </div>
  );
}
