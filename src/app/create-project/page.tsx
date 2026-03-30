"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIProjectPlanner } from '@/components/workspace/AIProjectPlanner';
import { AIExpertMatching } from '@/components/workspace/AIExpertMatching';
import { SmartPricingWidget } from '@/components/projects/SmartPricingWidget';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { callBackend } from '@/lib/api';

export default function CreateProjectPage() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState("Build a high-performance Flutter mobile app for a fintech startup");
  const [aiData, setAiData] = useState<any>(null);

  const sidebarItems = [
    { name: 'Dashboard', href: '/client/dashboard', icon: require('lucide-react').LayoutDashboard },
    { name: 'Post a Project', href: '/create-project', icon: require('lucide-react').PlusSquare },
    { name: 'Manage Projects', href: '/client/manage-projects', icon: require('lucide-react').ClipboardList },
    { name: 'Find Freelancers', href: '/freelancers/discover', icon: require('lucide-react').Search },
    { name: 'Messages', href: '/messages', icon: require('lucide-react').MessageSquare },
    { name: 'Payments', href: '/client/payments', icon: require('lucide-react').CreditCard },
    { name: 'Settings', href: '/client/settings', icon: require('lucide-react').Settings },
  ];

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Create Project">
        <div className="max-w-4xl mx-auto py-8">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => setStep(step > 1 ? step - 1 : 1)}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 text-slate-500 transition-all font-bold"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-3 flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">
                Step 0{step} of 03
              </span>
              <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 transition-all duration-500" 
                  style={{ width: `${(step / 3) * 100}%` }} 
                />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">

                <div className="space-y-3">
                  <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                    Describe your <span className="text-primary-600">Vision.</span>
                  </h1>
                  <p className="text-base font-medium text-slate-500 max-w-2xl">
                    Our AI will architect the technical requirements, milestones, and match the elite team for you.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="relative group">
                    <textarea
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      placeholder="e.g., Build a high-performance Flutter mobile app for a fintech startup"
                      className="w-full h-40 p-6 rounded-3xl bg-white dark:bg-slate-900 
                      border-2 border-slate-200 dark:border-slate-800 
                      focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 
                      transition-all text-lg font-medium outline-none resize-none shadow-sm
                      text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <Sparkles className="text-primary-500 animate-pulse" size={24} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-2">Try:</span>
                    {["Build a Flutter e-commerce app", "Villa booking website with admin panel", "AI-powered legal document analyzer"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setOutcome(suggestion)}
                        className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:border-primary-500/50 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  {outcome.length > 10 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 mt-4"
                    >
                      <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2">Project Complexity Estimate</div>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-500",
                                outcome.length > 50 ? "bg-amber-500 w-2/3" : "bg-emerald-500 w-1/3"
                              )} 
                            />
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap">
                            {outcome.length > 50 ? 'MEDIUM' : 'EASY'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Smart Pricing Engine Integration */}
                  <SmartPricingWidget outcome={outcome} />
                </div>
                
                <div className="flex justify-end pt-6">
                  <button 
                    onClick={() => setStep(1.5)}
                    disabled={outcome.length < 10}
                    className="h-14 px-8 rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-slate-700 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Intelligence Plan
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1.5 */}
            {step === 1.5 && (
              <motion.div key="step1.5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">

                <div className="space-y-3">
                  <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                    AI is architecting your <span className="text-primary-600">Outcome.</span>
                  </h1>
                  <p className="text-base font-medium text-slate-500 max-w-2xl">
                    We've broken down your vision into actionable milestones and technical requirements.
                  </p>
                </div>

                <AIProjectPlanner 
                  outcome={outcome} 
                  onPlanGenerated={(data) => {
                    console.log("AI DATA RECEIVED:", data);
                    setAiData(data);
                  }} 
                />

                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      console.log("BUTTON CLICKED", aiData);

                      if (!aiData) {
                        alert("Wait for AI to finish generating plan");
                        return;
                      }

                      setStep(2);
                    }}
                    disabled={!aiData}
                    className="h-14 px-8 rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-slate-700 transition-all shadow-xl disabled:opacity-50"
                  >
                    Verify Plan & Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">

                <div className="space-y-3">
                  <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                    Assemble your <span className="text-primary-600">Elite Team.</span>
                  </h1>
                  <p className="text-base font-medium text-slate-500 max-w-2xl">
                    AI has ranked the top 1% of experts based on your specific technical stack and outcome needs.
                  </p>
                </div>

                <AIExpertMatching outcome={outcome} />

                <div className="flex justify-end pt-6">
                  <button 
                    onClick={() => setStep(3)}
                    className="h-14 px-8 rounded-xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
                  >
                    Finalize Workspace
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center justify-center text-center space-y-6">

                <div className="h-20 w-20 rounded-[2rem] bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-4">
                  <CheckCircle2 size={40} strokeWidth={3} />
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                    Workspace Ready.
                  </h1>
                  <p className="text-base font-medium text-slate-500 max-w-xl mx-auto">
                    Your project environment is indexed, experts are notified, and the AI Co-Pilot is standing by.
                  </p>
                </div>

                <Button 
                  onClick={async () => {
                    if (!user) return;

                    try {
                      const result = await callBackend('workspaces/create-from-ai', 'POST', {
                        outcome,
                        aiData
                      });

                      if (result.projectId) {
                        window.location.href = `/workspace/${result.projectId}`;
                      }

                    } catch (err) {
                      console.error('Workspace Creation Error:', err);
                    }
                  }}
                  className="h-14 px-8 rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-slate-700 transition-all shadow-xl mt-4"
                >
                  Launch Intelligence Workspace
                </Button>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
