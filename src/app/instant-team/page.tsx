"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Zap, 
  CheckCircle2, 
  Users, 
  Plus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ROLES = [
  { label: 'Flutter Developer', color: 'from-blue-500 to-indigo-600', experts: 120 },
  { label: 'Backend Engineer', color: 'from-emerald-500 to-green-600', experts: 98 },
  { label: 'UI/UX Designer', color: 'from-violet-500 to-purple-600', experts: 74 },
  { label: 'Project Manager', color: 'from-amber-500 to-orange-600', experts: 55 },
  { label: 'QA Engineer', color: 'from-rose-500 to-red-600', experts: 43 },
  { label: 'DevOps Specialist', color: 'from-slate-500 to-slate-700', experts: 31 },
];

const TEAM_TEMPLATES = [
  {
    name: 'Mobile App Pack',
    roles: ['Flutter Developer', 'Backend Engineer', 'UI/UX Designer'],
    icon: '📱',
    timeline: '4–6 weeks',
    budget: '$2,400–$4,000'
  },
  {
    name: 'Web Platform Pack',
    roles: ['Backend Engineer', 'UI/UX Designer', 'Project Manager'],
    icon: '🌐',
    timeline: '6–8 weeks',
    budget: '$3,800–$6,500'
  },
  {
    name: 'Full Product Squad',
    roles: ['Flutter Developer', 'Backend Engineer', 'UI/UX Designer', 'Project Manager'],
    icon: '🚀',
    timeline: '8–12 weeks',
    budget: '$6,000–$12,000'
  },
];

const SUGGESTED_EXPERTS = [
  { name: 'Sarah Chen', role: 'Flutter Developer', rating: 4.9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', rate: '$95/hr' },
  { name: 'Marcus Volkov', role: 'Backend Engineer', rating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', rate: '$110/hr' },
  { name: 'Alex Rivera', role: 'UI/UX Designer', rating: 5.0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', rate: '$85/hr' },
];

export default function InstantTeamPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [teamBuilt, setTeamBuilt] = useState(false);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const applyTemplate = (roles: string[]) => {
    setSelectedRoles(roles);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        {/* Hero */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/30 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap size={12} />
            Instant Team Builder
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.0]">
            Build your <span className="text-primary-600">dream team</span><br />in seconds.
          </h1>
          <p className="text-lg font-medium text-slate-500 max-w-xl mx-auto">
            Select the roles your project needs. Our AI instantly assembles an elite, pre-vetted team and creates a shared workspace.
          </p>
        </div>

        {/* Templates */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Sparkles size={14} className="text-primary-500" />
            Quick Start Templates
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM_TEMPLATES.map((template) => (
              <button
                key={template.name}
                onClick={() => applyTemplate(template.roles)}
                className="premium-card p-6 text-left group hover:ring-2 hover:ring-primary-500/30 transition-all"
              >
                <div className="text-3xl mb-4">{template.icon}</div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">{template.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {template.roles.map(r => (
                    <span key={r} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500 uppercase">{r}</span>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span>{template.timeline}</span>
                  <span className="text-primary-600">{template.budget}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Role Selector */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Plus size={14} />
            Select Required Roles
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ROLES.map((role) => {
              const isSelected = selectedRoles.includes(role.label);
              return (
                <button
                  key={role.label}
                  onClick={() => toggleRole(role.label)}
                  className={cn(
                    "p-6 rounded-[2rem] border-2 text-left transition-all duration-200",
                    isSelected 
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 shadow-lg shadow-primary-500/10" 
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center shadow-md",
                      `bg-gradient-to-br ${role.color}`
                    )}>
                      <Users size={18} className="text-white" />
                    </div>
                    <div className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected ? "border-primary-500 bg-primary-500" : "border-slate-200 dark:border-slate-700"
                    )}>
                      {isSelected && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </div>
                  <div className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white mb-1">{role.label}</div>
                  <div className="text-[10px] font-medium text-slate-400">{role.experts} experts available</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Build Team Action */}
        <AnimatePresence>
          {selectedRoles.length > 0 && !teamBuilt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="premium-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 border-none text-white"
            >
              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Selected Roles</div>
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map(r => (
                    <span key={r} className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setTeamBuilt(true)}
                className="h-16 px-12 rounded-2xl bg-primary-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 whitespace-nowrap flex items-center gap-3"
              >
                <Zap size={18} />
                Build Instant Workspace
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggested Experts after building */}
        <AnimatePresence>
          {teamBuilt && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  <CheckCircle2 size={12} />
                  AI Matched {SUGGESTED_EXPERTS.length} Experts
                </div>
                <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Your Elite Team</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUGGESTED_EXPERTS.map((expert, idx) => (
                  <motion.div
                    key={expert.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="premium-card p-8 text-center space-y-4 hover:ring-2 hover:ring-primary-500/20 transition-all"
                  >
                    <img src={expert.avatar} alt={expert.name} className="h-20 w-20 rounded-3xl mx-auto bg-slate-100 dark:bg-slate-800 shadow-xl" />
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{expert.name}</h3>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{expert.role}</div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                        <Star size={12} fill="currentColor" />
                        {expert.rating}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1 text-xs font-black text-slate-500">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Verified
                      </div>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-xs font-black text-primary-600">{expert.rate}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => window.location.href = '/create-project'}
                  className="h-16 px-16 rounded-2xl bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-3"
                >
                  Create Team Workspace
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
