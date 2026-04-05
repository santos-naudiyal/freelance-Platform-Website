"use client";

import React from 'react';
import { CreditCard, CheckCircle2, Lock, Unlock, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Button } from '@/components/ui/Button';

interface PaymentsProps {
  workspaceId: string;
}

export function Payments({ workspaceId }: PaymentsProps) {
  const { workspace, loading } = useWorkspace(workspaceId);
  const currentProgress = workspace?.progress || 35; // Mock progress for showcase
  const totalAmount = 15000;

  const milestones = [
    { id: 1, title: 'UI/UX Design Phase', percentage: 20, description: 'Wireframes, High-fidelity mocks', status: currentProgress >= 20 ? 'released' : 'locked' },
    { id: 2, title: 'Core Development', percentage: 30, description: 'Backend APIs, Core Frontend features', status: currentProgress >= 50 ? 'released' : (currentProgress >= 20 ? 'in_progress' : 'locked') },
    { id: 3, title: 'Final Delivery & QA', percentage: 50, description: 'Testing, Deployment, Handoff', status: currentProgress >= 100 ? 'released' : 'locked' },
  ];

  let accumulatedPercentage = 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight flex items-center gap-3">
            <CreditCard className="text-primary-500" />
            Milestone Vault
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2">Payments are held securely and released automatically upon reaching progress milestones.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Contract Value</div>
          <div className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">${totalAmount.toLocaleString()}</div>
        </div>
      </div>

      <div className="premium-card p-8 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={24} />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Smart Escrow Active</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Funds secured by FreelanceHub Shield</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-900 dark:text-white">{currentProgress}% Done</div>
          </div>
        </div>

        {/* Dynamic Progress Bar tied to Milestones */}
        <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-12 shadow-inner overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/20"
            style={{ width: `${currentProgress}%` }}
          />
          {/* Milestone markers */}
          {milestones.map((m, i) => {
            const thisMarker = accumulatedPercentage + m.percentage;
            accumulatedPercentage = thisMarker;
            if (i === milestones.length - 1) return null; // No marker needed at 100% inside the bar
            return (
              <div 
                key={m.id} 
                className="absolute top-0 bottom-0 w-1 bg-white dark:bg-slate-950 z-10"
                style={{ left: `${thisMarker}%` }} 
              />
            );
          })}
        </div>

        <div className="space-y-4">
          {milestones.map((milestone, idx) => {
            const amount = (totalAmount * milestone.percentage) / 100;
            return (
              <div 
                key={milestone.id}
                className={cn(
                  "p-6 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6",
                  milestone.status === 'released' ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30" :
                  milestone.status === 'in_progress' ? "bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-800/30 ring-2 ring-primary-500/20" :
                  "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-70"
                )}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center border-2",
                    milestone.status === 'released' ? "bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-800/50 dark:border-emerald-700" :
                    milestone.status === 'in_progress' ? "bg-primary-100 border-primary-200 text-primary-600 dark:bg-primary-800/50 dark:border-primary-700 font-bold" :
                    "bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
                  )}>
                    {milestone.status === 'released' ? <CheckCircle2 size={24} /> : 
                     milestone.status === 'in_progress' ? <Activity size={24} className="animate-pulse" /> : 
                     <Lock size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Milestone 0{idx + 1}</span>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full",
                        milestone.status === 'released' ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100" :
                        milestone.status === 'in_progress' ? "bg-primary-200 text-primary-800 dark:bg-primary-800 dark:text-primary-100" :
                        "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      )}>
                        {milestone.percentage}% Release
                      </span>
                    </div>
                    <h4 className={cn(
                      "text-xl font-bold mb-1",
                      milestone.status === 'locked' ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-white"
                    )}>{milestone.title}</h4>
                    <p className="text-sm font-medium text-slate-500">{milestone.description}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={cn(
                    "text-2xl font-black tracking-tight mb-2",
                    milestone.status === 'released' ? "text-emerald-600" :
                    milestone.status === 'in_progress' ? "text-primary-600 dark:text-primary-400" :
                    "text-slate-400"
                  )}>
                    ${amount.toLocaleString()}
                  </div>
                  {milestone.status === 'released' ? (
                     <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1"><Unlock size={14}/> Funds Released</div>
                  ) : milestone.status === 'in_progress' ? (
                     <Button size="sm" className="h-9 px-6 font-bold text-xs uppercase tracking-widest rounded-xl bg-primary-600 shadow-md">Release Early</Button>
                  ) : (
                     <div className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1"><Lock size={14}/> Auto-locks till {milestone.title}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
