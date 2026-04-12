import React, { useState } from 'react';
import { Sparkles, Loader2, IndianRupee, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { apiClient } from '../../lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartPricingWidgetProps {
  outcome: string;
}

interface PricingData {
  minRate: number;
  maxRate: number;
  marketConfidence: string;
  recommendation: string;
  complexityScore: number;
}

export function SmartPricingWidget({ outcome }: SmartPricingWidgetProps) {
  const [isEstimating, setIsEstimating] = useState(false);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = async () => {
    if (!outcome || outcome.length < 10) return;
    
    try {
      setIsEstimating(true);
      setError(null);
      
      const response = await apiClient.post('/ai/estimate-price', { outcome }) as any;
      
      if (response && response.minRate) {
        setPricingData(response);
      } else {
        throw new Error('Could not parse pricing estimation.');
      }
    } catch (err: any) {
      console.error('Pricing Error:', err);
      setError(err?.message || 'Failed to estimate pricing. Try again.');
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-emerald-500" />
              <h4 className="font-bold text-slate-900 dark:text-white">Smart Pricing Engine</h4>
            </div>
            <p className="text-xs font-medium text-slate-500 max-w-sm">
              Not sure what to pay? Let AI analyze your scope and suggest a fair market rate to attract top 1% talent.
            </p>
          </div>
          <Button 
            onClick={handleEstimate}
            disabled={isEstimating || outcome.length < 10}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20"
          >
            {isEstimating ? (
              <><Loader2 size={16} className="mr-2 animate-spin" /> Analyzing Market...</>
            ) : (
              <><TrendingUp size={16} className="mr-2" /> Estimate Fair Price</>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </motion.div>
          )}

          {pricingData && !isEstimating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Range</p>
                <div className="flex items-center gap-2 text-2xl font-display font-black text-slate-900 dark:text-white">
                  <IndianRupee size={24} className="text-emerald-500 stroke-[3]" />
                  {pricingData.minRate.toLocaleString()} - {pricingData.maxRate.toLocaleString()}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                    Confidence: {pricingData.marketConfidence}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">
                    Complexity: {pricingData.complexityScore}/10
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">
                  "{pricingData.recommendation}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
