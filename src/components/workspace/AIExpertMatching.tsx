"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAI } from '@/hooks/useAI';

type RecommendedExpert = {
  id: string;
  name: string;
  role: string;
  match: number;
  reason: string;
  rate: string;
  avatar: string;
};

export function AIExpertMatching({ outcome }: { outcome: string }) {
  const { matchExperts, loading, error } = useAI();
  const [experts, setExperts] = useState<RecommendedExpert[]>([]);
  const lastGeneratedOutcome = React.useRef<string | null>(null);

  useEffect(() => {
    if (outcome && lastGeneratedOutcome.current !== outcome && !loading) {
      lastGeneratedOutcome.current = outcome;
      matchExperts(outcome).then((result) => {
        if (result && result.experts) {
          setExperts(result.experts);
        }
      });
    }
  }, [outcome, loading]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-display font-black tracking-tight flex items-center gap-3">
            <Sparkles className={loading ? "text-primary-500 animate-spin" : "text-primary-500"} />
            Elite Matching Core
          </h3>
          <p className="text-sm font-medium text-slate-500">Ranked by outcome compatibility and performance metrics.</p>
        </div>
        {experts.length > 0 && (
          <div className="px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-950/30 text-primary-600 text-[10px] font-black uppercase tracking-widest">
            {experts.length} Experts Match Your Outcome
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 font-medium text-sm border border-rose-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
             <div className="space-y-4">
                <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
                <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
             </div>
        ) : experts.length === 0 ? (
             <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                No matching experts found. Try adjusting your project requirements.
             </div>
        ) : (
          experts.map((expert, idx) => (
            <div key={expert.id} className="premium-card p-6 flex flex-col md:flex-row items-center gap-8 relative hover:ring-2 hover:ring-primary-500/20 transition-all">
              {idx === 0 && (
                <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                  Best Fit
                </div>
              )}
              
              <div className="flex items-center gap-6 flex-1 w-full">
                <div className="relative">
                  <img src={expert.avatar} alt={expert.name} className="h-20 w-20 rounded-3xl bg-slate-100 dark:bg-slate-800 object-cover border-2 border-slate-100 dark:border-slate-800 shadow-xl" />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary-600 shadow-sm">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h4 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">{expert.name}</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-black uppercase tracking-widest text-primary-600">{expert.match}% Match</div>
                        <div className="text-xs font-medium text-slate-500">{expert.rate}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{expert.role}</div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 max-w-lg italic">
                    "{expert.reason}"
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-initial h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 dark:border-slate-800" onClick={() => window.location.href=`/expert/${expert.id}`}>
                  View Profile
                </Button>
                <Button className="flex-1 md:flex-initial h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-950 hover:bg-slate-800 text-white shadow-xl">
                  Add to Workspace
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
