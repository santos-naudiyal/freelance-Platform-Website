"use client";

import Link from 'next/link';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="container px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 p-12 md:p-32 rounded-[4rem] bg-slate-950 text-white overflow-hidden text-center space-y-10 shadow-3xl shadow-primary-500/10"
        >
          {/* Background Gradient Blasts */}
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-primary-600/30 to-transparent blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[100%] bg-gradient-to-r from-indigo-600/30 to-transparent blur-[120px] -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Zap size={14} className="fill-current" />
            Join the future of work
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-black leading-[1.1] tracking-tighter">
            Ready to build <br className="hidden md:block" />
            <span className="text-gradient from-primary-400 to-indigo-400">Your Vision?</span>
          </h2>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Describe your outcome and watch our AI-powered OS assemble your dream team and project workspace in minutes. 
            Join the elite circle of builders on Freelace.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-slate-950 hover:bg-white/90 rounded-full group transition-all duration-300">
                Create a Project <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/freelancers/discover">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10 rounded-full">
                Explore Experts
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
