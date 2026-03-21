"use client";

import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden md:pt-40 md:pb-32">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100/40 blur-[120px] dark:bg-primary-900/20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px] dark:bg-indigo-900/20" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter text-slate-950 dark:text-white leading-[1.05]"
          >
            Build anything with <br />
            <span className="text-gradient font-black">experts in hours</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed"
          >
            The world's first <span className="font-bold text-slate-900 dark:text-slate-200">Work Operating System</span>. 
            Describe your outcome, and we'll build the workspace, recommend experts, and track progress for you.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative premium-glass rounded-[2.3rem] p-2 flex items-center shadow-2xl">
              <div className="flex-1 px-6">
                <label htmlFor="project-creator" className="block text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1">
                  What do you want to build?
                </label>
                <input 
                  id="project-creator"
                  type="text" 
                  placeholder="e.g. Build a Flutter app, Create a landing page..."
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium text-lg"
                />
              </div>
              <button 
                onClick={() => window.location.href = '/create-project'}
                className="h-[4.5rem] px-10 rounded-2xl bg-primary-600 text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary-500/30 flex items-center gap-2 group"
              >
                Continue 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20 opacity-40 grayscale contrast-125 dark:invert dark:opacity-30">
              <div className="text-3xl font-black tracking-tighter">STRIPE</div>
              <div className="text-3xl font-black tracking-tighter">NETFLIX</div>
              <div className="text-3xl font-black tracking-tighter">UBER</div>
              <div className="text-3xl font-black tracking-tighter">AIRBNB</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
