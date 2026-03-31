"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, MessageSquare, CreditCard, Award } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'AI Outcome Designer',
      description: 'Describe your goal in natural language. Our AI breaks it down into a structured project with tasks and milestones.',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Autonomous Workspaces',
      description: 'Every project gets a dedicated operating system. Manage tasks, files, and communications in one unified interface.',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Expert Matchmaking',
      description: 'Stop browsing through thousands of profiles. We recommend the top 3 experts perfectly suited for your outcome.',
      icon: Award,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Live Progress Sync',
      description: 'Watch your project come to life with real-time tracking of every task, commit, and deliverable in the workspace.',
      icon: MessageSquare,
      color: 'from-primary-500 to-violet-500',
    },
    {
      title: 'Pay-on-Progress',
      description: 'Payments are automatically tied to workspace milestones. Funds release only when deliverables meet your standards.',
      icon: CreditCard,
      color: 'from-rose-500 to-pink-500',
    },
    {
      title: 'Team Ecosystem',
      description: 'Seamlessly add designers, developers, and PMs to the same workspace. They collaborate together, you scale faster.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-slate-950">
      <div className="container px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20 space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-black text-slate-950 dark:text-white leading-[1.2] md:leading-[1.1] tracking-tighter">
            The Operating System for <br className="hidden sm:block" />
            <span className="text-gradient">Elite Outcomes</span>
          </h2>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
            Traditional marketplaces are just job boards. We've built an execution layer that turns your vision into a managed reality.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.title} 
              variants={itemVariants}
              className="group relative p-8 rounded-[2rem] bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800/50 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-500 shadow-premium overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-primary-500/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                <feature.icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
