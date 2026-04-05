"use client";

import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

export function HeroSection() {
  const { user } = useAuthStore();
  return (
    <section className="relative pt-32 pb-24 overflow-hidden md:pt-52 md:pb-40 bg-[var(--background)]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-primary-500/20 blur-[130px] dark:bg-primary-600/10 mix-blend-multiply dark:mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[130px] dark:bg-indigo-600/10 mix-blend-multiply dark:mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-[100px] dark:bg-violet-600/10 mix-blend-multiply dark:mix-blend-screen" 
        />
      </div>

      <div className="container px-6 mx-auto">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10">
          {/* Premium Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full premium-glass text-primary-700 dark:text-primary-300 text-sm font-medium border border-primary-200/50 dark:border-primary-800/50"
          >
            <Sparkles size={14} className="text-primary-500 animate-pulse" />
            <span className="tracking-tight">Trusted by 50,000+ industry leaders</span>
          </motion.div> 

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.05] md:leading-[0.95]"
          >
            Build anything with<br className="hidden sm:block" />
            <span className="text-gradient filter drop-shadow-sm"> experts in hours</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed px-4 sm:px-0"
          >
            The world's first <span className="font-bold text-slate-900 dark:text-slate-200">Work Operating System</span>. 
            Describe your outcome, and we'll build the workspace, recommend experts, and track progress for you.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl relative group mt-12"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative premium-glass rounded-[2.5rem] p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center shadow-2xl bg-white/90 dark:bg-slate-900/90 gap-3 border-2 border-white dark:border-white/5">
              <div className="flex-1 px-6 sm:px-8 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-white/10 group-focus-within:border-primary-500/50 transition-colors">
                <label htmlFor="project-creator" className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 mb-1.5">
                  What do you want to build?
                </label>
                <input 
                  id="project-creator"
                  type="text" 
                  placeholder="e.g. Build a mobile app..."
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold text-lg sm:text-xl p-0"
                />
              </div>
              <button 
                onClick={() => window.location.href = user ? (user.role === 'client' ? '/create-project' : '/freelancer/dashboard') : '/auth/register'}
                className="h-14 sm:h-[4.5rem] px-8 sm:px-12 rounded-[1.75rem] bg-primary-600 text-white font-black uppercase tracking-widest text-sm hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 group shrink-0"
              >
                <span>{user ? (user.role === 'client' ? 'Continue' : 'Dashboard') : 'Get Started'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Build Flutter app', 'Create landing page', 'Automate business process'].map((example) => (
                <button 
                  key={example}
                  className="text-xs font-bold px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-700 transition-all cursor-pointer"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Social Proof Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-20 w-full"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-10">
              Powering innovation at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-20 opacity-40 grayscale contrast-125 dark:invert dark:opacity-30">
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">STRIPE</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">NETFLIX</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">UBER</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">AIRBNB</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
