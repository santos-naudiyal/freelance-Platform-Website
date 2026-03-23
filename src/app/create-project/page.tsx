"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIProjectPlanner } from '@/components/workspace/AIProjectPlanner';
import { AIExpertMatching } from '@/components/workspace/AIExpertMatching';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function CreateProjectPage() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState("Build a high-performance Flutter mobile app for a fintech startup");
  const [aiData, setAiData] = useState<any>(null);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => setStep(step > 1 ? step - 1 : 1)}
            className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Step 0{step} of 03</span>
            <div className="h-1 w-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 transition-all duration-500" 
                style={{ width: `${(step / 3) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Describe your <span className="text-primary-600">Vision.</span>
                </h1>
                <p className="text-lg font-medium text-slate-500 max-w-2xl">
                  Our AI will architect the technical requirements, milestones, and match the elite team for you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="e.g., Build a high-performance Flutter mobile app for a fintech startup"
                    className="w-full h-40 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-xl font-medium outline-none resize-none"
                  />
                  <div className="absolute top-8 right-8 flex items-center gap-2">
                    <Sparkles className="text-primary-500 animate-pulse" size={24} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-2">Try:</span>
                  {["Build a Flutter e-commerce app", "Villa booking website with admin panel", "AI-powered legal document analyzer"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setOutcome(suggestion)}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-primary-600 hover:border-primary-500/50 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {outcome.length > 10 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-6 rounded-3xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30"
                  >
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1">Project Complexity Estimate</div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
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
              </div>
              
              <div className="flex justify-end pt-8">
                <button 
                  onClick={() => setStep(1.5)}
                  disabled={outcome.length < 10}
                  className="h-16 px-12 rounded-2xl bg-slate-950 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Intelligence Plan
                </button>
              </div>
            </motion.div>
          )}

          {step === 1.5 && (
            <motion.div 
              key="step1.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  AI is architecting your <span className="text-primary-600">Outcome.</span>
                </h1>
                <p className="text-lg font-medium text-slate-500 max-w-2xl">
                  We've broken down your vision into actionable milestones and technical requirements.
                </p>
              </div>

              <AIProjectPlanner outcome={outcome} onPlanGenerated={(data) => setAiData(data)} />
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  className="h-16 px-12 rounded-2xl bg-slate-950 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                >
                  Verify Plan & Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Assemble your <span className="text-primary-600">Elite Team.</span>
                </h1>
                <p className="text-lg font-medium text-slate-500 max-w-2xl">
                  AI has ranked the top 1% of experts based on your specific technical stack and outcome needs.
                </p>
              </div>

              <AIExpertMatching outcome={outcome} />

              <div className="flex justify-end pt-8">
                <button 
                  onClick={() => setStep(3)}
                  className="h-16 px-12 rounded-2xl bg-primary-600 text-white font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
                >
                  Finalize Workspace
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 scale-125 mb-8">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">Workspace Ready.</h1>
                <p className="text-lg font-medium text-slate-500 max-w-xl">
                  Your project environment is indexed, experts are notified, and the AI Co-Pilot is standing by.
                </p>
              </div>
              <Button 
                onClick={async () => {
                  if (!user) return;
                  try {
                    const workspaceId = outcome.toLowerCase().replace(/\s+/g, '-').slice(0, 20) + '-' + Math.random().toString(36).substr(2, 5);
                    
                    // Extract budget and skills from aiData if available
                    const budgetMatch = aiData?.analysis?.investment?.match(/\$(\d+,\d+|\d+)/g);
                    const minBudget = budgetMatch ? parseInt(budgetMatch[0].replace(/[$,]/g, '')) : 5000;
                    const maxBudget = budgetMatch && budgetMatch.length > 1 ? parseInt(budgetMatch[1].replace(/[$,]/g, '')) : minBudget + 5000;

                    await setDoc(doc(db, 'Projects', workspaceId), {
                      id: workspaceId,
                      title: outcome,
                      description: aiData?.analysis?.description || "A high-performance project architected by AI.",
                      clientId: user.id,
                      status: 'open',
                      budget: {
                        min: minBudget,
                        max: maxBudget,
                        type: 'fixed'
                      },
                      skillsRequired: aiData?.analysis?.skills || ['Software Development', 'AI Architecture'],
                      progress: 0,
                      createdAt: serverTimestamp(),
                    });
                    // Initialize some tasks
                    const tasksRef = collection(db, 'Projects', workspaceId, 'tasks');
                    await addDoc(tasksRef, { title: 'Project Initialization', status: 'done', priority: 'medium', createdAt: serverTimestamp() });
                    await addDoc(tasksRef, { title: 'Technical Architecture Review', status: 'in_progress', priority: 'high', createdAt: serverTimestamp() });
                    
                    window.location.href = `/workspace/${workspaceId}`;
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="h-16 px-12 rounded-2xl bg-slate-950 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
              >
                Launch Intelligence Workspace
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
