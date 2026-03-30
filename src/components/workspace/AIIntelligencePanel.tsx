"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '@/hooks/useAI';

export function AIIntelligencePanel({ projectId }: { projectId: string }) {
  const { getInsights, loading, error } = useAI();
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    if (projectId && !insights && !loading) {
      getInsights(projectId).then(res => {
        if (res) setInsights(res);
      });
    }
  }, [projectId]);

  if (loading || !insights) {
    return (
      <div className="premium-card p-8 bg-slate-900 border-none relative overflow-hidden text-white flex justify-center items-center h-48">
         <div className="animate-pulse flex items-center gap-2 text-primary-400 font-bold">
            <Sparkles size={20} className="animate-spin" /> AI Intelligence Core is thinking...
         </div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Intelligence Header */}
      <div className="premium-card p-8 bg-slate-900 border-none relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary-600/20 to-transparent blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-600 shadow-lg shadow-primary-500/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-xl font-display font-black tracking-tight uppercase">AI Project Manager</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Proactive Intelligence Core</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-display font-black text-primary-400">{velocityScore}%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Velocity Score</div>
            </div>
          </div>

          <p className="text-lg font-medium text-slate-300 mb-8 border-l-2 border-primary-500 pl-4 py-1 italic">
            "{summary}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-500" />
                Live Alerts
              </h4>
              <div className="space-y-3">

                    <div className={cn(
                      "mt-0.5 h-2 w-2 rounded-full shrink-0",
                      alert.severity === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
                      alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    )} />
                    <p className="text-xs font-bold text-slate-200">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Zap size={14} className="text-primary-500" />
                AI Suggested Actions
              </h4>
              <div className="space-y-3">
                {suggestions.map((sug: any) => (
                  <div key={sug.id || sug.action} className="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 group hover:bg-primary-500/20 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">{sug.action}</span>
                      <ArrowRight size={14} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-400">{sug.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next Big Move</span>
                <p className="text-sm font-bold text-primary-400">{nextBigMove}</p>
              </div>
              <button className="h-12 px-6 rounded-xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                Executive Action <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
