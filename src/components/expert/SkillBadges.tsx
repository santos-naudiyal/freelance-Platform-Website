"use client";

import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Code2, 
  Palette, 
  Globe, 
  Lock,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Skill = {
  name: string;
  level: 'Expert' | 'Lead' | 'Architect';
  icon: any;
  projects: number;
};

const verifiedSkills: Skill[] = [
  { name: 'Flutter Development', level: 'Architect', icon: Cpu, projects: 12 },
  { name: 'Firebase Infrastructure', level: 'Lead', icon: Globe, projects: 15 },
  { name: 'UI Systems Design', level: 'Expert', icon: Palette, projects: 8 },
  { name: 'Node.js Backend', level: 'Architect', icon: Code2, projects: 20 },
  { name: 'Security & Auth', level: 'Lead', icon: Lock, projects: 10 },
];

export function SkillBadges() {
  return (
    <div className="flex flex-wrap gap-3">
      {verifiedSkills.map((skill) => (
        <div 
          key={skill.name} 
          className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 hover:shadow-md transition-all cursor-default"
        >
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary-600 transition-colors">
            <skill.icon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{skill.name}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black uppercase tracking-widest text-primary-600">{skill.level}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{skill.projects} Outcomes</span>
            </div>
          </div>
          <div className="ml-1 text-emerald-500">
            <CheckCircle2 size={12} fill="currentColor" className="text-white dark:text-slate-900" />
          </div>

          {/* Verification Tooltip Concept */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 rounded-xl bg-slate-900 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
            <div className="flex items-center gap-2 mb-2 text-primary-400 font-black uppercase tracking-widest">
              <ShieldCheck size={12} />
              Verified Performance
            </div>
            This skill was verified through {skill.projects} successful workspace completions with a 4.8+ rating.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
          </div>
        </div>
      ))}

      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary-600 hover:border-primary-500/50 transition-all text-xs font-bold">
        <Zap size={14} />
        Verify More Skills
      </button>
    </div>
  );
}
