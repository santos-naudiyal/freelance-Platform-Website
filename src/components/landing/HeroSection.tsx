"use client";

import { useState } from 'react';
import { ArrowRight, LogIn, Sparkles, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Modal } from '@/components/ui/Modal';

const HERO_PROJECT_REQUIREMENT_KEY = 'freelancehub.pendingProjectRequirement';

export function HeroSection() {
  const { user, isInitialized, isLoading } = useAuthStore();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [projectRequirement, setProjectRequirement] = useState('');
  const isAuthReady = isInitialized && !isLoading;

  const handleGetStarted = () => {
    const trimmedRequirement = projectRequirement.trim();
    if (trimmedRequirement) {
      window.localStorage.setItem(HERO_PROJECT_REQUIREMENT_KEY, trimmedRequirement);
    }

    if (!isAuthReady) return;

    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    window.location.href = user.role === 'client' ? '/create-project' : '/freelancer/dashboard';
  };

  const handleExampleClick = (example: string) => {
    setProjectRequirement(example);
    window.localStorage.setItem(HERO_PROJECT_REQUIREMENT_KEY, example);
  };

  return (
    <>
    <section className="relative overflow-hidden bg-slate-950 pb-20 pt-28 sm:pb-24 sm:pt-32 md:pb-32 md:pt-44 lg:pt-52">
      {/* Background Decorative Elements - Enhanced Premium Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] rounded-full bg-primary-600/30 blur-[140px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15], x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[140px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[20%] left-[45%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[110px] mix-blend-screen" 
        />
      </div>

      <div className="section-shell">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center space-y-8 sm:space-y-10">
          {/* Premium Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs sm:text-sm font-medium text-primary-300 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-primary-400 animate-pulse" />
            <span className="tracking-tight">Trusted by 50,000+ industry leaders</span>
          </motion.div> 

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white leading-[1.05] md:leading-[0.95]"
          >
            Build anything with<br className="hidden sm:block" />
            <span className="text-gradient filter drop-shadow-sm"> freelancers worldwide</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl px-2 text-base leading-relaxed text-slate-400 sm:px-0 sm:text-lg md:text-2xl"
          >
            Describe your project and get an AI-powered quotation instantly.
            Connect with verified freelancers worldwide, launch faster, and manage every milestone in one workspace.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6 w-full max-w-3xl group sm:mt-10 md:mt-12"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative flex flex-col items-stretch gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center sm:rounded-[2.5rem] sm:p-3">
              <div className="flex-1 px-6 sm:px-8 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10 group-focus-within:border-primary-500/50 transition-colors">
                <label htmlFor="project-creator" className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-1.5">
                  What do you want to build?
                </label>
                <input 
                  id="project-creator"
                  type="text" 
                  value={projectRequirement}
                  onChange={(event) => setProjectRequirement(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleGetStarted();
                  }}
                  placeholder="e.g. Build a mobile app..."
                  className="w-full bg-transparent border-none p-0 text-base font-bold text-white placeholder:text-slate-500 focus:ring-0 sm:text-xl"
                />
              </div>
              <button 
                onClick={handleGetStarted}
                className="flex h-14 shrink-0 items-center justify-center gap-3 rounded-[1.5rem] bg-primary-600 px-6 text-xs font-black uppercase tracking-[0.18em] text-white shadow-xl shadow-primary-500/30 transition-all hover:scale-[1.02] hover:bg-primary-700 active:scale-95 sm:h-[4.5rem] sm:rounded-[1.75rem] sm:px-12 sm:text-sm"
              >
                <span>{!isAuthReady ? 'Loading' : user ? (user.role === 'client' ? 'Continue' : 'Dashboard') : 'Get Started'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
            
            <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3">
              {['Build Flutter app', 'Create landing page', 'Automate business process'].map((example) => (
                <button 
                  key={example}
                  onClick={() => handleExampleClick(example)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-500 transition-all cursor-pointer hover:border-primary-300 hover:text-primary-600 dark:border-slate-800 dark:hover:border-primary-700 sm:px-4 sm:text-xs"
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
            className="w-full pt-14 sm:pt-20"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-10">
              Powering innovation at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-5 opacity-40 grayscale contrast-125 dark:invert dark:opacity-30 sm:gap-x-8 md:gap-x-20">
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">STRIPE</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">NETFLIX</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">UBER</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">AIRBNB</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    <Modal
      isOpen={showAuthPrompt}
      onClose={() => setShowAuthPrompt(false)}
      title="Create your free account"
      description="Sign up or log in to generate your AI project quotation and connect with freelancers worldwide."
      className="max-w-lg rounded-lg border-white/10 bg-slate-950 text-white dark:bg-slate-950 [&_h3]:text-white [&_svg]:shrink-0"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-300">
            <Sparkles size={13} />
            AI quotation ready
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-300">
            Tell us what you want to build, then get a smart quotation, matched freelance talent, and a project workspace after authentication.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => window.location.href = '/auth/register'}
            className="flex h-13 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700 active:scale-95"
          >
            <UserPlus size={18} />
            Sign Up
          </button>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="flex h-13 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-black uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
}
