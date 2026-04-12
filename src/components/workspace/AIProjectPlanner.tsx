"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '@/hooks/useAI';

type PlannedTask = {
  id: string;
  title: string;
  duration: string;
  role: string;
};

type PlannedMilestone = {
  id: string;
  title: string;
  description: string;
  tasks: PlannedTask[];
  isExpanded?: boolean;
};

export function AIProjectPlanner({ outcome, onPlanGenerated }: { outcome: string, onPlanGenerated?: (data: { plan: PlannedMilestone[], analysis: any }) => void }) {
  const { generatePlan, loading, error } = useAI();
  const [plan, setPlan] = useState<PlannedMilestone[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const lastGeneratedOutcome = React.useRef<string | null>(null);

  useEffect(() => {
    if (outcome && lastGeneratedOutcome.current !== outcome && !loading) {
      lastGeneratedOutcome.current = outcome;
      generatePlan(outcome).then((result) => {
        if (result) {
          setPlan(result.plan || []);
          setAnalysis(result.analysis || null);
          if (onPlanGenerated) {
            onPlanGenerated(result);
          }
        }
      });
    }
  }, [outcome, onPlanGenerated, loading]);

  const toggleMilestone = (id: string) => {
    setPlan(plan.map(m => m.id === id ? { ...m, isExpanded: !m.isExpanded } : m));
  };

  return (
    <div className="space-y-6">
      <div className="premium-glass p-8 rounded-[2.5rem] border-primary-100 dark:border-primary-900 shadow-2xl shadow-primary-500/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
            <Sparkles size={20} className={loading ? "animate-spin" : ""} />
          </div>
          <div>
            <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">AI Outcome Plan</h3>
            <p className="text-xs font-black uppercase tracking-widest text-primary-600">Generated for: "{outcome}"</p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 text-rose-600 font-medium text-sm border border-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
            <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        ) : (
          <>
            {analysis && (
              <div className="mb-10 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Zap size={14} className="text-primary-500" />
                  Detected Required Expertise
                </div>
                <div className="flex flex-wrap gap-2">
                 {analysis.skills?.map((skill: string, index: number) => (

                    <div key={`${skill}-${index}`} className="px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 text-xs font-bold text-primary-600 flex items-center gap-2">
                      <CheckCircle2 size={12} />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {plan.map((milestone, idx) => (
                <div key={milestone.id} className="premium-card p-0 overflow-hidden border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => toggleMilestone(milestone.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black text-xs">
                        0{idx + 1}
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{milestone.title}</h4>
                        <p className="text-xs font-medium text-slate-500">{milestone.description}</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("text-slate-400 transition-transform", milestone.isExpanded && "rotate-180")} size={20} />
                  </button>

                  <AnimatePresence>
                    {milestone.isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
                      >
                        <div className="p-6 space-y-3">
                          {milestone.tasks?.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary-500" />
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{task.role}</span>
                                <span className="text-[10px] font-black text-slate-500 flex items-center gap-1">
                                  <Clock size={12} /> {task.duration}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {analysis && (
              <div className="mt-12 grid grid-cols-2 gap-4 lg:gap-8 pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estimated Timeline</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{analysis.timeline}</span>
                  </div>
                </div>
                <div className="flex flex-col p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estimated Investment</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{analysis.investment.replace(/USD/g, 'INR').replace(/\$/g, '₹')}</span>
                  </div>
                  <p className="mt-4 text-[10px] font-medium text-slate-500">Based on elite market rates and project complexity.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

