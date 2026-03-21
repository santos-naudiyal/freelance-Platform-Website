"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Lock, 
  FileText,
  UserCheck,
  Zap,
  ArrowRight,
  Info,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function VerificationPortal() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="h-20 w-20 rounded-[2rem] bg-primary-100 dark:bg-primary-950/30 text-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/20 mb-4">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">Architect of Trust</h1>
          <p className="text-lg font-medium text-slate-500 max-w-xl">
            Verify your identity and technical credentials to unlock the Titanium Expert status and gain access to high-value project outcomes.
          </p>
        </div>

        <div className="premium-card p-12 bg-white dark:bg-slate-900 border-none shadow-2xl relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-primary-600 transition-all duration-700" style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { id: 1, label: 'Identity Proof', icon: UserCheck },
              { id: 2, label: 'Skill Verification', icon: Zap },
              { id: 3, label: 'Final Review', icon: Search },
            ].map(item => (
              <div key={item.id} className={cn(
                "flex flex-col items-center gap-3 transition-opacity",
                step === item.id ? "opacity-100" : "opacity-40"
              )}>
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  step >= item.id ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-black tracking-tight uppercase">Government Identity</h2>
                <p className="text-sm font-medium text-slate-500">Securely upload a valid Passport or National ID.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-primary-600 group-hover:bg-white transition-all">
                    <Upload size={32} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white uppercase">Front of ID</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">PNG, JPG up to 10MB</div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-primary-600 group-hover:bg-white transition-all">
                    <Upload size={32} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white uppercase">Back of ID</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">PNG, JPG up to 10MB</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400">
                <Info size={20} className="shrink-0" />
                <p className="text-xs font-medium leading-relaxed uppercase tracking-tight">
                  Your data is encrypted and only used for verification purposes. We do not store original ID documents once verified.
                </p>
              </div>

              <div className="flex justify-end pt-8">
                 <Button onClick={() => setStep(2)} className="h-14 px-10 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest gap-2">
                   Next: Skill Verification <ArrowRight size={18} />
                 </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                <h2 className="text-2xl font-display font-black tracking-tight uppercase">Technical Proof</h2>
                <p className="text-sm font-medium text-slate-500">Link your professional accounts for automated skill verification.</p>
              </div>

              <div className="space-y-4">
                 {[
                   { name: 'GitHub Architecture Proof', status: 'Connected', icon: FileText },
                   { name: 'LinkedIn Professional History', status: 'Pending', icon: FileText },
                   { name: 'AWS/GCP Certifications', status: 'Connect Now', icon: FileText },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                     <div className="flex items-center gap-4">
                       <item.icon className="text-slate-400" size={24} />
                       <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{item.name}</span>
                     </div>
                     <span className={cn(
                       "text-[9px] font-black uppercase tracking-widest",
                       item.status === 'Connected' ? "text-emerald-500" : "text-primary-600 cursor-pointer hover:underline"
                     )}>
                       {item.status}
                     </span>
                   </div>
                 ))}
              </div>

              <div className="flex justify-between pt-8">
                 <Button variant="outline" onClick={() => setStep(1)} className="h-14 px-10 rounded-xl font-black text-xs uppercase tracking-widest">
                   Back
                 </Button>
                 <Button onClick={() => setStep(3)} className="h-14 px-10 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest gap-2">
                   Next: Final Review <ArrowRight size={18} />
                 </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
               <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 mx-auto mb-8">
                 <CheckCircle2 size={48} strokeWidth={2.5} />
               </div>
               <div className="space-y-4">
                 <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">Submission Received</h2>
                 <p className="text-lg font-medium text-slate-500 max-w-md mx-auto">
                   Our Trust System is currently auditing your submission. You will be notified within 24 hours of your verification outcome.
                 </p>
               </div>
               <div className="pt-8">
                 <Button onClick={() => window.location.href = '/'} className="h-16 px-12 rounded-2xl bg-primary-600 text-white font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20">
                   Back to Dashboard
                 </Button>
               </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
