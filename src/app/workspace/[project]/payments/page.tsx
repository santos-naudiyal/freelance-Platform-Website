import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  ShieldCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default async function PaymentsPage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;

  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Financial Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="premium-card p-8 bg-slate-900 text-white border-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary-600 shadow-lg shadow-primary-500/20">
                <CreditCard size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Budget</span>
            </div>
            <div className="text-4xl font-display font-black tracking-tight mb-2">$8,500.00</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <TrendingUp size={12} />
              Verified Escrow
            </div>
          </div>

          <div className="premium-card p-8 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30">
                <ArrowDownLeft size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Paid to Date</span>
            </div>
            <div className="text-4xl font-display font-black tracking-tight mb-2 text-slate-900 dark:text-white">$3,200.00</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">4 Milestones Completed</div>
          </div>

          <div className="premium-card p-8 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/30">
                <Clock size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Remaining</span>
            </div>
            <div className="text-4xl font-display font-black tracking-tight mb-2 text-slate-900 dark:text-white">$5,300.00</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next due in 4 days</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Milestone Payment Flow */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-black tracking-tight">Financial Flow</h3>
              <Button size="sm" variant="outline" className="h-10 px-4 rounded-xl font-bold gap-2">
                <Plus size={16} /> Add Milestone
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'UI/UX Final Prototype', amount: '$1,200', status: 'Paid', date: 'Mar 10' },
                { name: 'Core API Integration', amount: '$2,000', status: 'Completed', date: 'Mar 15' },
                { name: 'Database Architecture', amount: '$1,500', status: 'In Progress', date: 'Mar 25', progress: 65 },
                { name: 'Frontend React Development', amount: '$2,500', status: 'Pending', date: 'Apr 10' },
              ].map((milestone, i) => (
                <div key={i} className="premium-card p-6 flex flex-col gap-6 group hover:shadow-xl transition-all border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                        milestone.status === 'Paid' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30" : 
                        milestone.status === 'Completed' ? "bg-blue-100 text-blue-600 dark:bg-blue-950/30" :
                        milestone.status === 'In Progress' ? "bg-primary-100 text-primary-600 dark:bg-primary-950/30" :
                        "bg-slate-100 text-slate-400 dark:bg-slate-800"
                      )}>
                        {milestone.status === 'Paid' ? <ShieldCheck size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{milestone.name}</h4>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{milestone.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{milestone.amount}</div>
                      <div className={cn(
                        "text-[9px] font-black uppercase tracking-[0.1em]",
                        milestone.status === 'Paid' ? "text-emerald-500" :
                        milestone.status === 'Completed' ? "text-blue-500" :
                        milestone.status === 'In Progress' ? "text-primary-500" :
                        "text-slate-400"
                      )}>{milestone.status}</div>
                    </div>
                  </div>

                  {milestone.status === 'In Progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Milestone Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${milestone.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {milestone.status === 'Completed' && (
                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 h-12 rounded-xl bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-lg">
                        Release Payment
                      </Button>
                      <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-700 font-black text-[10px] uppercase tracking-widest">
                        Review Assets
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Secure Escrow Protection Card */}
          <div className="space-y-6">
            <div className="premium-card p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-primary-950 text-white border-none shadow-2xl shadow-primary-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-primary-600 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20">
                   <ShieldCheck size={28} />
                </div>
                <h3 className="text-2xl font-display font-black tracking-tight mb-4 leading-tight italic uppercase">Intelligence Escrow</h3>
                <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                  Your funds are architected into the project outcome. They are only released when milestones meet the AI-verified criteria and your approval.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    'Outcome-Based Protection',
                    'Biometric Consent Flow',
                    'Real-time Audit Trail'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 shadow-sm shadow-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-5 rounded-[1.5rem] bg-white text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                  Escrow Audit Log
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
