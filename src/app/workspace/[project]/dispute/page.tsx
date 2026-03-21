"use client";

import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck, 
  Scale, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Gavel
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default async function DisputeResolutionPage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;
  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-black uppercase tracking-widest">
              <AlertCircle size={14} /> Active Milestone Dispute
            </div>
            <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase leading-[1.1]">
              Mediation <span className="text-rose-600">Protocol.</span>
            </h1>
            <p className="text-lg font-medium text-slate-500 max-w-xl">
              Collaboratively resolve the conflict regarding Milestone 3: "Core API Integration".
            </p>
          </div>
          <div className="premium-card p-6 bg-slate-900 text-white border-none shadow-2xl">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Escrow at Stake</div>
             <div className="text-3xl font-display font-black">$2,450.00</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Mediation Timeline */}
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                   <MessageSquare size={18} /> Dispute Chat Log
                 </h3>
                 <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <Clock size={14} /> 48h limit remaining
                 </span>
              </div>

              <div className="space-y-6">
                {[
                  { sender: 'Client (NeoVault)', msg: "The API endpoints don't match the documentation provided in Phase 1. We need a refactor.", time: 'Yesterday' },
                  { sender: 'Expert (Sarah Chen)', msg: "The documentation was updated during the last sync. I can adjust it, but the current build is optimized for scaling.", time: 'Yesterday' },
                ].map((msg, i) => (
                  <div key={i} className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">{msg.sender}</span>
                      <span className="text-[9px] font-bold text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">"{msg.msg}"</p>
                  </div>
                ))}

                {/* AI Mediation Suggestion */}
                <div className="premium-card p-8 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 h-full w-[40%] bg-primary-600/20 blur-3xl" />
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-400">
                          <TrendingUp size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest">AI Mediator Analysis</h4>
                          <span className="text-[10px] text-slate-400 font-medium">Outcome Recommendation</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed">
                        Based on the workspace activity logs and the original outcome description, Sarah's implementation fulfills 92% of the technical requirements. 
                        <strong> Recommendation:</strong> Sarah performs a 3-hour refactor on endpoints `v1/auth`, and NeoVault releases 90% of the milestone funds immediately.
                      </p>
                      <div className="flex gap-4 pt-4">
                         <Button className="flex-1 h-12 rounded-xl bg-primary-600 text-white font-bold text-xs uppercase tracking-widest">Accept AI Proposal</Button>
                         <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10">Counter Offer</Button>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>

          {/* Dispute Sidebar */}
          <div className="space-y-10">
            <div className="premium-card p-8 bg-white dark:bg-slate-900 border-none shadow-xl">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                 <Scale size={18} className="text-primary-600" /> Resolution Options
               </h3>
               <div className="space-y-4">
                 <button className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                   <div className="text-xs font-black text-slate-900 dark:text-white uppercase mb-1">Mutual Cancellation</div>
                   <div className="text-[10px] text-slate-400 font-medium">Split funds 50/50 and end workspace.</div>
                 </button>
                 <button className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                   <div className="text-xs font-black text-rose-600 uppercase mb-1">Escalate to Admin</div>
                   <div className="text-[10px] text-slate-400 font-medium">A human moderator will review the audit log.</div>
                 </button>
               </div>
            </div>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2 px-4">
                <ShieldCheck size={16} /> Trust Documentation
              </h3>
              <div className="space-y-2">
                {['Original Outcome Brief', 'Audit Log: v1.0.4', 'Peer Review Certificate'].map(doc => (
                  <button key={doc} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 hover:text-primary-600 transition-all">
                    {doc} <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </section>

            <div className="premium-card p-6 bg-slate-950 text-white border-none shadow-2xl flex items-center gap-4">
               <Gavel size={32} className="text-primary-500 shrink-0" />
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Binding Arbitration</h4>
                 <p className="text-[9px] font-medium text-slate-400">Decisions made via collective mediation or admin review are final and binding.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
