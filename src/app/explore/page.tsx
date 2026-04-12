"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useExperts } from '@/hooks/useExperts';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ExplorePage() {
  const { experts, loading } = useExperts();
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Elite <span className="text-primary-600">Expertise</span> Core.
            </h1>
            <p className="text-lg font-medium text-slate-500 max-w-2xl">
              Access the top 1% of global talent, ranked by verified project outcomes and real-time performance data.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by skill or outcome..." 
                  className="pl-12 pr-6 py-4 rounded-xl bg-transparent border-none text-sm font-medium w-80 focus:ring-0 outline-none"
                />
              </div>
              <button className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-all">
                <Filter size={20} />
              </button>
            </div>
            
            <div className="flex gap-2 justify-end">
              {['Design', 'Engineering', 'Marketing', 'Product'].map((filter) => (
                <button key={filter} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary-600 hover:text-white transition-all">
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="h-48 w-full rounded-[2.5rem]" />
                <div className="space-y-4 px-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-4 w-1/4" />
                  <div className="space-y-2 py-4">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            experts.map((expert) => (
              <div 
                key={expert.id} 
                className="premium-card p-0 overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary-500/20 transition-all flex flex-col h-full"
                onClick={() => window.location.href = `/expert/${expert.id}`}
              >
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                     <img src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.id}`} className="h-28 w-28 rounded-3xl p-1 bg-white dark:bg-slate-900 shadow-2xl group-hover:scale-110 transition-transform duration-500" alt={expert.name} />
                  </div>
                  <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-lg">
                     {(expert.profile as any)?.match || '98'}% Match
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase truncate">{expert.name}</h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 font-black text-[10px]">
                      <Star size={12} fill="currentColor" />
                      {(expert.profile as any)?.rating || '5.0'}
                    </div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{(expert.profile as any)?.title || 'Elite Technical Lead'}</div>

                  <div className="space-y-4 mb-8 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Job Success Flow</span>
                        <span className="text-primary-600">99%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[99%] bg-primary-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Reliability Score</span>
                        <span className="text-emerald-500">100%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {(expert.profile as any)?.skills.slice(0, 3).map((skill: any) => (
                      <span key={skill} className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-tight border border-slate-100 dark:border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Est. Rate</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">₹85 - ₹120/hr</span>
                    </div>
                    <button className="h-12 w-12 rounded-2xl bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center group-hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10 group-hover:shadow-primary-600/20">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Load More Slot */}
          <button className="premium-card min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-primary-600 hover:border-primary-500/50 transition-all bg-transparent">
            <Sparkles size={32} strokeWidth={1.5} />
            <div className="text-center">
              <div className="text-xs font-black uppercase tracking-widest">Discover More</div>
              <div className="text-[10px] font-medium opacity-60">500+ Elite Experts</div>
            </div>
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
