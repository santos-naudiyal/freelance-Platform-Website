"use client";

import { motion } from 'framer-motion';

export function StatsSection() {
  const stats = [
    { label: 'Active Workspaces', value: '12k+' },
    { label: 'Team Collaborations', value: '85k+' },
    { label: 'Project Success', value: '99.8%' },
    { label: 'Match Speed', value: '< 2hrs' },
  ];

  return (
    <section className="border-y border-slate-200/60 bg-slate-50 py-16 dark:border-slate-800/60 dark:bg-slate-950/50 sm:py-20">
      <div className="section-shell">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-12 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center space-y-2 md:space-y-3"
            >
              <div className="text-3xl sm:text-4xl md:text-6xl font-display font-black text-slate-950 dark:text-white tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest px-2 sm:px-4 leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
