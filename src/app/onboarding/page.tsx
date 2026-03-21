"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { User, ShieldCheck, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    id: 1,
    icon: <User size={28} />,
    title: 'Create Your Profile',
    subtitle: 'Who are you?',
    description: 'Set up your profile so experts or clients can understand your work style, goals, and expertise.',
    cta: 'Build Profile',
    color: 'from-primary-500 to-indigo-600',
    bg: 'bg-primary-50 dark:bg-primary-950/20',
    accent: 'text-primary-600',
    fields: [
      { label: 'Full Name', placeholder: 'e.g. Santosh Sharma' },
      { label: 'Role', placeholder: 'e.g. Flutter Developer / Client' },
      { label: 'Location', placeholder: 'e.g. Jaipur, India' },
    ]
  },
  {
    id: 2,
    icon: <ShieldCheck size={28} />,
    title: 'Verify Your Skills',
    subtitle: 'Prove your expertise',
    description: 'AI validates your skill claims against real project history and portfolios to grant you a Verified badge.',
    cta: 'Verify Skills',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    accent: 'text-emerald-600',
    skills: ['Flutter', 'React', 'Node.js', 'UI/UX Design', 'Backend', 'DevOps', 'Product Management', 'QA']
  },
  {
    id: 3,
    icon: <Zap size={28} />,
    title: 'Join Your First Workspace',
    subtitle: 'Start collaborating',
    description: 'Create a project or get matched to a client workspace. Your Work OS is ready.',
    cta: 'Go to Dashboard',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    accent: 'text-violet-600',
  }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const current = STEPS[step];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
                i <= step ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700"
              )}>
                {i < step ? <CheckCircle2 size={16} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 rounded-full transition-all duration-500",
                  i < step ? "bg-primary-500" : "bg-slate-200 dark:bg-slate-800"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="space-y-10"
          >
            {/* Step header */}
            <div className="space-y-4">
              <div className={cn("inline-flex h-16 w-16 rounded-3xl items-center justify-center bg-gradient-to-br text-white shadow-2xl", current.color)}>
                {current.icon}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Step {current.id} of 3 — {current.subtitle}</div>
                <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">{current.title}</h1>
              </div>
              <p className="text-base font-medium text-slate-500 leading-relaxed">{current.description}</p>
            </div>

            {/* Step-specific content */}
            {step === 0 && (
              <div className="space-y-4">
                {current.fields?.map(f => (
                  <div key={f.label} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select your skills</div>
                <div className="flex flex-wrap gap-3">
                  {current.skills?.map(skill => {
                    const selected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => setSelectedSkills(prev => selected ? prev.filter(s => s !== skill) : [...prev, skill])}
                        className={cn(
                          "px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2",
                          selected
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600 shadow-sm"
                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 hover:border-slate-200"
                        )}
                      >
                        {selected && <CheckCircle2 size={14} className="inline mr-2" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
                {selectedSkills.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs font-black text-emerald-600 uppercase tracking-widest">
                    ✓ {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected for verification
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Create a Project', icon: '🚀', href: '/create-project' },
                  { label: 'Explore Experts', icon: '🔍', href: '/explore' },
                  { label: 'Build Instant Team', icon: '⚡', href: '/instant-team' },
                  { label: 'My Dashboard', icon: '📊', href: '/freelancer/dashboard' },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:ring-2 hover:ring-primary-500/20 hover:shadow-xl transition-all flex flex-col gap-4 group"
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center justify-between">
                      {item.label}
                      <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center gap-4 pt-4">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="h-14 px-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-sm font-black text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : (window.location.href = '/freelancer/dashboard')}
                className="flex-1 h-14 rounded-2xl bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {current.cta}
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
