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
      <div className="premium-card p-8 bg-slate-900 border-none relative overflow-hidden text-white flex justify-center items-center h-48 rounded-[2rem]">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/10 to-transparent animate-pulse" />
         <div className="relative z-10 flex items-center gap-3 text-primary-400 font-bold">
            <Sparkles size={20} className="animate-spin" /> AI Project Manager is thinking...
         </div>
      </div>
    );
  }

  // Safely destructure insights with defaults
  const {
    velocityScore = 0,
    summary = "No summary available.",
    alerts = [],
    suggestions = [],
    nextBigMove = "No next move predicted."
  } = insights;

  return (
    <div className="space-y-6">
      {/* Intelligence Header */}
      <div className="premium-card p-8 bg-slate-900 border-none relative overflow-hidden text-white rounded-[2rem]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary-600/20 to-transparent blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary-600 shadow-xl shadow-primary-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-display font-black tracking-tight uppercase">AI Project Manager</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Proactive Intelligence Core</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-display font-black text-primary-400">
                {velocityScore}%
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Velocity</div>
            </div>
          </div>

          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-medium text-slate-300 mb-8 border-l-4 border-primary-500 pl-6 py-2 italic leading-relaxed"
          >
            "{summary}"
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Live Alerts Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-500" />
                Live Strategic Alerts
              </h4>
              <div className="space-y-4">
                {alerts.length > 0 ? alerts.map((alert: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start hover:bg-white/10 transition-colors">
                    <div className={cn(
                      "mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 shadow-lg",
                      alert.severity === 'high' ? 'bg-rose-500 shadow-rose-500/50' : 
                      alert.severity === 'medium' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-blue-500 shadow-blue-500/50'
                    )} />
                    <p className="text-sm font-bold text-slate-200">{alert.message}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-500 font-medium italic">No active alerts at this time.</p>
                )}
              </div>
            </div>

            {/* Suggested Actions Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Zap size={14} className="text-primary-500" />
                AI Suggested Actions
              </h4>
              <div className="space-y-4">
                {suggestions.length > 0 ? suggestions.map((sug: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-[1.5rem] bg-primary-500/10 border border-primary-500/20 group hover:bg-primary-500/20 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-white uppercase tracking-tight">{sug.action}</span>
                      <ArrowRight size={14} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 leading-normal">{sug.reason}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-500 font-medium italic">No suggested actions right now.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Decision Section */}
          <div className="mt-10 pt-10 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-primary-500" /> Next Big Move
                </span>
                <p className="text-md font-bold text-primary-400 tracking-tight">{nextBigMove}</p>
              </div>
              <button className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-white/5">
                Executive Action <CheckCircle2 size={18} className="text-primary-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
