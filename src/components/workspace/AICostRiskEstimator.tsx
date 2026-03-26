"use client";

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/hooks/useAI';

export function AICostRiskEstimator({ project }: { project: any }) {
  const { analyzeRisk, loading, error } = useAI();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (project && !analysis && !loading) {
      analyzeRisk({
        title: project.title,
        description: project.description || 'A software development project.',
        budget: project.budget,
        skillsRequired: project.skills || []
      }).then(res => {
        if (res) setAnalysis(res);
      });
    }
  }, [project]);

  if (loading || !analysis) {
    return (
       <div className="premium-card p-8 bg-slate-900 border-none relative overflow-hidden text-white flex justify-center items-center h-64">
          <div className="animate-pulse flex items-center gap-2 text-primary-400 font-bold">
             <Zap size={20} /> Analyzing Project Risks...
          </div>
       </div>
    );
  }

  const { risks = [], bottleneck, costOptimization, speedBoost } = analysis;

  return (
    <div className="space-y-6">
      <div className="premium-card p-8 bg-slate-900 border-none relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary-600/20 to-transparent blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-primary-600 shadow-lg shadow-primary-500/20">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-display font-black tracking-tight uppercase">AI Intelligence Core</h3>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 text-rose-400 font-medium text-sm border border-rose-500/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {Array.isArray(risks) && risks.map((risk: any, idx: number) => (
              <div key={`${risk.title}-${idx}`} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{risk.title}</span>
                  <span className={cn("text-xs font-black uppercase tracking-widest", risk.color)}>{risk.status}</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", risk.color?.replace('text', 'bg'))} 
                    style={{ width: `${risk.score}%` }} 
                  />
                </div>
                <div className="text-xl font-display font-black">{risk.score}%</div>
              </div>
            ))}
          </div>

          {bottleneck && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{bottleneck.title}</h4>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  "{bottleneck.message}"
                </p>
                <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-1.5 hover:text-primary-300 transition-colors">
                  View Recommendations <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {costOptimization && (
          <div className="premium-card p-6 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30">
                <TrendingDown size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Cost Optimization</span>
            </div>
            <p className="text-sm font-bold mb-2">{costOptimization.title}</p>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              {costOptimization.message}
            </p>
          </div>
        )}

        {speedBoost && (
          <div className="premium-card p-6 bg-white dark:bg-slate-900 border-primary-500/30 shadow-primary-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/30">
                <TrendingUp size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Speed Boost</span>
            </div>
            <p className="text-sm font-bold mb-2">{speedBoost.title}</p>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              {speedBoost.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
