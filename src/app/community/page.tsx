"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  Search,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function CommunityPage() {
  const circles = [
    { name: 'Flutter Elite', members: 120, tags: ['Mobile', 'Fintech'], icon: Hash },
    { name: 'AI Architects', members: 85, tags: ['LLMs', 'MLOps'], icon: Hash },
    { name: 'Product Visionaries', members: 64, tags: ['UX', 'Strategy'], icon: Hash },
  ];

  const outcomes = [
    { 
      expert: 'Sarah Chen', 
      client: 'NeoVault', 
      title: 'Real-time Core Sync', 
      results: '99.99% Uptime', 
      time: '2h ago' 
    },
    { 
      expert: 'Marcus Volkov', 
      client: 'Lumina HQ', 
      title: 'Architecture Blueprint', 
      results: 'Verified by Peer Review', 
      time: '5h ago' 
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          
          {/* Sidebar: Navigation & Circles */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Workspace Network</h3>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                  <TrendingUp size={18} /> Outcome Feed
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-500 font-bold text-sm transition-all">
                  <MessageSquare size={18} /> Global Discussions
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-500 font-bold text-sm transition-all">
                  <ShieldCheck size={18} /> Peer Review Hub
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-500 font-bold text-sm transition-all">
                  <Sparkles size={18} /> Project Showcases
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-500 font-bold text-sm transition-all">
                  <Users size={18} /> Freelancer Groups
                </button>
              </nav>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expert Circles</h3>
                <button className="text-primary-600 hover:scale-110 transition-transform">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {circles.map(circle => (
                  <button key={circle.name} className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400">
                        <circle.icon size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{circle.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-medium text-slate-400">{circle.members} Elite Experts</span>
                       <div className="flex -space-x-2 overflow-hidden">
                         {[1,2,3].map(i => (
                           <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Circle${i}`} className="h-5 w-5 rounded-full border border-white dark:border-slate-950 bg-slate-100" />
                         ))}
                       </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content: Outcome Feed */}
          <div className="lg:col-span-6 space-y-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                 <Sparkles size={24} className="text-primary-600" /> Live Outcome Stream
               </h2>
               <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                 <input type="text" placeholder="Search insights..." className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-medium w-48 focus:ring-2 focus:ring-primary-500 outline-none" />
               </div>
            </div>

            <div className="space-y-8">
              {outcomes.map((outcome, i) => (
                <div key={i} className="premium-card p-8 group hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100 dark:ring-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${outcome.expert}`} className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-lg" alt={outcome.expert} />
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{outcome.expert}</div>
                        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5">
                          Verified Completion <span className="h-1 w-1 rounded-full bg-slate-300" /> {outcome.time}
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-200">
                      Success
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h4 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">{outcome.title}</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                      "I just finalized the {outcome.title} for {outcome.client}. The outcome metrics show {outcome.results} within the first hour of deployment."
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="text-center px-4 border-r border-slate-200 dark:border-slate-800">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Duration</div>
                        <div className="text-sm font-bold">12 Days</div>
                      </div>
                      <div className="text-center px-4">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Complexity</div>
                        <div className="text-sm font-bold text-primary-600">High</div>
                      </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                      View Workspace <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area: Trends & Meta */}
          <div className="lg:col-span-3 space-y-10">
            <div className="premium-card p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[40%] h-full bg-primary-600/20 blur-3xl" />
               <div className="relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6">Network Health</h3>
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between items-end text-[10px] font-black uppercase mb-2">
                       <span>Total Outomces</span>
                       <span className="text-primary-400">12,402</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary-500 w-[85%] rounded-full shadow-lg shadow-primary-500/50" />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Seats</div>
                       <div className="text-lg font-bold">4.2k</div>
                     </div>
                     <div>
                       <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Growth</div>
                       <div className="text-lg font-bold text-emerald-400">+12%</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Trending Tech Outomces</h3>
              <div className="space-y-1">
                {['#RealTimeBidding', '#FintechInfra', '#AutonomousUX', '#EdgeScaling'].map(tag => (
                  <button key={tag} className="w-full flex items-center justify-between px-4 py-2 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{tag}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
