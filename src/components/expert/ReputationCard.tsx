"use client";

import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Star, 
  ShieldCheck, 
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Metric = {
  label: string;
  value: string;
  subtext: string;
  icon: any;
  color: string;
  percentage: number;
};

const metrics: Metric[] = [
  { 
    label: 'Outcome Success', 
    value: '99.2%', 
    subtext: 'Top 0.1% Globally', 
    icon: Target, 
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
    percentage: 99
  },
  { 
    label: 'Delivery Velocity', 
    value: '1.2x', 
    subtext: 'Faster than average', 
    icon: Zap, 
    color: 'text-primary-500 bg-primary-50 dark:bg-primary-950/20',
    percentage: 85
  },
  { 
    label: 'Client Satisfaction', 
    value: '4.9/5', 
    subtext: 'Verified Reviews', 
    icon: Star, 
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
    percentage: 98
  },
  { 
    label: 'Repeat Rate', 
    value: '92%', 
    subtext: 'Long-term partners', 
    icon: BarChart3, 
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20',
    percentage: 92
  },
];

export function ReputationCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, i) => (
        <motion.div 
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="premium-card p-6 space-y-4 hover:shadow-xl transition-all group"
        >
          <div className="flex justify-between items-start">
            <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", metric.color)}>
              <metric.icon size={24} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                {metric.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {metric.subtext}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>{metric.label}</span>
              <span>{metric.percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${metric.percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn("h-full rounded-full", metric.color.split(' ')[0].replace('text', 'bg'))}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
