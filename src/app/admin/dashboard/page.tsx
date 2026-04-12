"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
  const stats = [
    { label: 'Active Workspaces', value: '1,240', trend: '+12%', color: 'text-primary-600' },
    { label: 'Escrow Volume', value: '₹2.4M', trend: '+18%', color: 'text-emerald-600' },
    { label: 'Verification Queue', value: '42', trend: 'Priority', color: 'text-amber-600' },
    { label: 'Platform Health', value: '99.9%', trend: 'Stable', color: 'text-blue-600' },
  ];

  const criticalProjects = [
    { id: 'neo-vault', name: 'NeoVault Mobile', status: 'At Risk', health: 45, expert: 'Sarah Chen' },
    { id: 'lumina-hq', name: 'Lumina Dashboard', status: 'Stalled', health: 32, expert: 'Marcus Volkov' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">Work OS Oversight</h1>
            <p className="text-slate-500 font-medium">Platform-wide governance and trust metrics.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-12 rounded-xl border-slate-200 dark:border-slate-800 font-bold px-6">
              Export Audit Log
            </Button>
            <Button className="h-12 rounded-xl bg-primary-600 text-white font-bold px-6 shadow-xl shadow-primary-500/20">
              System Settings
            </Button>
          </div>
        </div>

        {/* Top-level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="premium-card p-6 border-none shadow-xl">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div className={cn("text-3xl font-display font-black tracking-tight", stat.color)}>{stat.value}</div>
                <div className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Oversight */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-display font-black tracking-tight uppercase flex items-center gap-3">
                  <Activity size={20} className="text-primary-600" /> Critical Project Health
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
                  View All Projects <ArrowRight size={12} className="inline ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                {criticalProjects.map(project => (
                  <div key={project.id} className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl transition-all border-l-4 border-l-rose-500">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <BarChart3 size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{project.name}</div>
                        <div className="text-[10px] font-medium text-slate-400">Expert: {project.expert}</div>
                      </div>
                    </div>

                    <div className="flex-1 max-w-xs px-8">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest mb-1.5">
                         <span className="text-rose-500">Health Score</span>
                         <span>{project.health}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-rose-500" style={{ width: `${project.health}%` }} />
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest border border-rose-200">
                        {project.status}
                      </span>
                      <button className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 transition-all">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-display font-black tracking-tight uppercase flex items-center gap-3 mb-8">
                <ShieldCheck size={20} className="text-primary-600" /> Identity Verification Queue
              </h3>
              <div className="premium-card p-0 overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Expert</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Credentials</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Submission</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {[
                      { name: 'Elena Perez', docs: 'ID, Degree, GitHub', time: '2h ago' },
                      { name: 'Marcus Volkov', docs: 'ID, Certifications', time: '5h ago' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                            {row.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.docs}</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-400">{row.time}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors px-3 py-1 rounded-lg hover:bg-primary-50">
                            Review Docs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Area: Disputes & Alerts */}
          <div className="space-y-10">
            <div className="premium-card p-8 bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <AlertCircle size={18} className="text-rose-400" /> Active Disputes
                </h3>
                <div className="space-y-6">
                   <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                     <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Workspace: Apollo-SaaS</div>
                     <p className="text-xs font-medium mb-4 italic text-slate-300">"Milestone 3 rejected due to design mismatch. AI suggest 15% refund."</p>
                     <Button className="w-full h-10 rounded-lg bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest">Mediate Now</Button>
                   </div>
                </div>
              </div>
            </div>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2 px-4">
                <TrendingUp size={16} /> Platform Trends
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Avg Match Time', value: '4.2h' },
                  { label: 'Outcome Rate', value: '98.4%' },
                  { label: 'Conflict Ratio', value: '0.2%' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{item.value}</span>
                  </div>
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
