import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api/client';
import { Card, CardContent } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Sparkles, UserCheck, Star, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function AIRecommendedExperts({ projectDescription }: { projectDescription: string }) {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response: any = await apiClient.post('/ai/match-experts', { outcome: projectDescription });
        if (response && response.experts) {
          setExperts(response.experts);
        }
      } catch (err) {
        console.error('Failed to load experts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectDescription) {
      fetchExperts();
    }
  }, [projectDescription]);

  if (loading) {
    return (
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-primary-500 animate-pulse" size={20} />
          <h3 className="font-bold text-slate-900 border-b-2 border-primary-500 pb-1 pr-4 inline-block">Matching Elite Experts</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="min-w-[300px] h-40 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (experts.length === 0) return null;

  return (
    <div className="mb-12 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
             <Sparkles size={20} />
          </div>
          <div>
             <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">AI Highly Recommended</h3>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Matched to your project scope</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
        {experts.map((expert, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: idx * 0.1 }}
            className="snap-start shrink-0 w-[340px]"
          >
            <Card className="h-full border border-primary-100/50 bg-gradient-to-br from-white to-primary-50/30 shadow-xl shadow-primary-500/5 hover:border-primary-200 transition-all rounded-[2rem] overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                      <UserCheck className="text-slate-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{typeof expert === 'object' ? expert.name || expert.id : expert}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Top Rated Talent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-black text-slate-800 bg-white shadow-sm px-2 py-1 rounded-lg">
                     <Star size={14} className="fill-amber-400 text-amber-400" /> 5.0
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                     <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">Verified Skills</span>
                  </div>
                  <Button variant="outline" className="w-full bg-white group-hover:bg-primary-50 hover:text-primary-600 transition-colors border-primary-100 text-primary-600">
                     <Zap size={16} className="mr-2 fill-primary-500 text-primary-500" /> Invite to bid
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
