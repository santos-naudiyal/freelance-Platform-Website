"use client";

import { motion } from 'framer-motion';
import { Zap, Globe, Award, MessageSquare, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function FeaturesSection() {
  const { user } = useAuthStore();
  const clientFeatures = [
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
      title: 'Milestone Control',
      description: 'Break work into clear deliverables, approvals, and status updates so everyone knows what is finished and what comes next.',
      icon: ClipboardCheck,
      color: 'from-rose-500 to-pink-500',
    },
    {
      title: 'Team Ecosystem',
      description: 'Seamlessly add designers, developers, and PMs to the same workspace. They collaborate together, you scale faster.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const freelancerFeatures = [
    {
      title: 'AI Project Matching',
      description: 'Get matched with high-paying projects that perfectly fit your skills and expertise automatically.',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Dedicated Workspaces',
      description: 'Run your projects in a unified workspace. Task management, files, and chat all in one place.',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Premium Clients',
      description: 'Connect with established businesses and promising startups looking for top-tier talent like you.',
      icon: Award,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Streamlined Collaboration',
      description: 'Keep clients in the loop with real-time updates of your tasks, commits, and deliverables.',
      icon: MessageSquare,
      color: 'from-primary-500 to-violet-500',
    },
    {
      title: 'Guaranteed Payments',
      description: 'Work with peace of mind. Clear milestones and approvals mean you get paid faster for completed tasks.',
      icon: ClipboardCheck,
      color: 'from-rose-500 to-pink-500',
    },
    {
      title: 'Build Your Reputation',
      description: 'Earn badges, perfect ratings, and scale your freelance business on a platform built for elite professionals.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const features = user?.role === 'freelancer' ? freelancerFeatures : clientFeatures;

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
    <section className="bg-white py-20 dark:bg-slate-950 lg:py-32">
      <div className="section-shell">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-4xl space-y-5 text-center sm:mb-20 sm:space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-black text-slate-950 dark:text-white leading-[1.2] md:leading-[1.1] tracking-tighter">
            {user?.role === 'freelancer' ? (
              <>
                The Operating System for <br className="hidden sm:block" />
                <span className="text-gradient">Elite Freelancers</span>
              </>
            ) : (
              <>
                The Operating System for <br className="hidden sm:block" />
                <span className="text-gradient">Elite Outcomes</span>
              </>
            )}
          </h2>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
            {user?.role === 'freelancer'
              ? "Traditional platforms just give you a profile. We've built an execution layer that helps you attract premium clients and manage work seamlessly."
              : "Traditional marketplaces are just job boards. We've built an execution layer that turns your vision into a managed reality."}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.title} 
              variants={itemVariants}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium transition-all duration-500 hover:border-primary-200 dark:border-slate-800/50 dark:bg-slate-900 dark:hover:border-primary-800 sm:p-8"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-primary-500/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 sm:mb-8 sm:h-14 sm:w-14`}>
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
