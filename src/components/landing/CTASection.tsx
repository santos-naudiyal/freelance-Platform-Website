"use client";

import Link from 'next/link';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function CTASection() {
  const { user } = useAuthStore();
  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-slate-950 sm:py-24">
      <div className="section-shell">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 overflow-hidden rounded-[2.5rem] bg-slate-950 p-6 text-center text-white shadow-3xl shadow-primary-500/10 space-y-8 sm:space-y-10 sm:p-10 md:rounded-[4rem] md:p-20 lg:p-32"
        >
          {/* Background Gradient Blasts */}
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-primary-600/30 to-transparent blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[100%] bg-gradient-to-r from-indigo-600/30 to-transparent blur-[120px] -z-10" />

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary-400">
            <Zap size={14} className="fill-current" />
            Join the future of work
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-black leading-[1.1] tracking-tighter">
            {user?.role === 'freelancer' ? (
              <>
                Ready to find <br className="hidden md:block" />
                <span className="text-gradient from-primary-400 to-indigo-400">Your Next Project?</span>
              </>
            ) : (
              <>
                Ready to build <br className="hidden md:block" />
                <span className="text-gradient from-primary-400 to-indigo-400">Your Vision?</span>
              </>
            )}
          </h2>
          
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl">
            {user?.role === 'freelancer'
              ? "Showcase your skills and let our AI match you with premium clients and high-paying projects. Join the elite circle of professionals on FreelanceHub."
              : "Describe your outcome and watch our AI-powered OS assemble your dream team and project workspace in minutes. Join the elite circle of builders on FreelanceHub."}
          </p>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row sm:gap-5 sm:pt-8">
            <Link href={user?.role === 'freelancer' ? '/freelancer/dashboard' : (user ? '/create-project' : '/auth/register')} className="w-full sm:w-auto">
              <Button size="lg" className="h-14 w-full rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 px-8 text-base font-black text-white shadow-xl shadow-primary-500/20 transition-all duration-300 hover:scale-105 active:scale-95 group sm:w-auto sm:px-10 sm:text-lg">
                {user?.role === 'freelancer' ? 'Dashboard' : (user ? 'Create a Project' : 'Join as Client')} <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={user?.role === 'freelancer' ? '/projects' : '/freelancers/discover'} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 w-full rounded-full border-white/20 px-8 text-base font-bold text-white hover:bg-white/10 sm:w-auto sm:px-10 sm:text-lg">
                {user?.role === 'freelancer' ? 'Explore Projects' : 'Explore Experts'}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
