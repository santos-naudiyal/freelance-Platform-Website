"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  BarChart, 
  PlayCircle,
  Clock,
  ArrowRight,
  Library,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function LearnPage() {
  const labs = [
    { name: 'Architecture for 100M+', badge: 'Titanium Architect', difficulty: 'Elite', time: '12h' },
    { name: 'AI Collaborative Flows', badge: 'Co-Pilot Expert', difficulty: 'Advanced', time: '6h' },
    { name: 'Secure Fintech Sync', badge: 'Compliance Lead', difficulty: 'Elite', time: '15h' },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary-600/30 via-indigo-600/10 to-transparent blur-3xl" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-primary-400 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> Elite Certification Core
            </div>
            <h1 className="text-6xl font-display font-black tracking-tight leading-[1.1]">
              Architect your <span className="text-primary-500">Reputation.</span>
            </h1>
            <p className="text-xl font-medium text-slate-400 max-w-2xl">
              Earn verified skill infrastructure badges and learn elite project execution from the top 1% of Titanium Experts.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="h-16 px-10 rounded-2xl font-black bg-primary-600 shadow-xl shadow-primary-500/20">
                Explore Labs
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl font-black border-white/20 text-white hover:bg-white/10 transition-all">
                View Roadmap
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content: Certification Labs */}
          <div className="lg:col-span-8 space-y-16">
            <section>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-display font-black tracking-tight flex items-center gap-3">
                  <ShieldCheck className="text-primary-600" size={28} /> Active Certification Labs
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
                  View All Labs <ArrowRight size={12} className="inline ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {labs.map((lab, i) => (
                  <div key={i} className="premium-card p-8 group hover:shadow-2xl transition-all duration-500 border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 transition-colors">
                        <Zap className="text-slate-400 group-hover:text-primary-600 transition-colors" size={24} />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest">
                         {lab.difficulty}
                      </span>
                    </div>
                    <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase mb-2">{lab.name}</h4>
                    <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-primary-600">
                      <Trophy size={14} /> Earn: {lab.badge}
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <Clock size={14} /> {lab.time}
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                        Enter Lab <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-display font-black tracking-tight flex items-center gap-3 mb-10">
                <PlayCircle className="text-primary-600" size={28} /> Outcome Workshops
              </h3>
              <div className="premium-card p-0 overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-64 md:h-full relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Workshop" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-2xl group-hover:scale-125 transition-all">
                        <PlayCircle size={32} />
                      </div>
                    </div>
                  </div>
                  <div className="p-10 space-y-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Masterclass Series</div>
                    <h4 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">Elite Outcome Planning for Fintech Solutions</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                      Learn how Sarah Chen (Titanium Expert) architects data-sensitive infrastructures that pass 100% of audit requirements.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800" alt="Sarah Chen" />
                      <div>
                        <div className="text-xs font-bold">By Sarah Chen</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Titanium Expert</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar: Resources & Stats */}
          <div className="lg:col-span-4 space-y-12">
            <div className="premium-card p-8 bg-slate-50 dark:bg-slate-900/50 border-none">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Library size={18} className="text-primary-600" /> Resource Vault
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'System Design Patterns V2', type: 'PDF' },
                  { name: 'Risk Assessment Matrix', type: 'XLSX' },
                  { name: 'Elite Onboarding Kit', type: 'DOCX' },
                ].map(file => (
                  <button key={file.name} className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400">{file.type}</div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </button>
                ))}
              </div>
              <button className="w-full mt-8 py-4 rounded-xl border border-primary-500/30 text-primary-600 font-black text-[10px] uppercase tracking-widest hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all">
                 Request Template
              </button>
            </div>

            <section className="space-y-6">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 px-4">Expert Stats</h3>
               <div className="premium-card p-8 bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-none shadow-2xl shadow-primary-500/20">
                  <div className="space-y-8">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Badges Earned</div>
                      <div className="text-3xl font-display font-black">2.4k+</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Skills Verified</div>
                      <div className="text-3xl font-display font-black">8.6k+</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Success Rate Boost</div>
                      <div className="text-3xl font-display font-black text-emerald-400">+22%</div>
                    </div>
                  </div>
               </div>
            </section>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
