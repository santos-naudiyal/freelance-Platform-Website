"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIProjectPlanner } from '@/components/workspace/AIProjectPlanner';
import { AIExpertMatching } from '@/components/workspace/AIExpertMatching';
import { SmartPricingWidget } from '@/components/projects/SmartPricingWidget';
import { ProjectQuotation } from '@/components/projects/ProjectQuotation';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { callBackend } from '@/lib/api';

const HERO_PROJECT_REQUIREMENT_KEY = 'freelancehub.pendingProjectRequirement';
const DEFAULT_PROJECT_REQUIREMENT = 'Build a high-performance Flutter mobile app for a fintech startup';

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState(DEFAULT_PROJECT_REQUIREMENT);
  const [aiData, setAiData] = useState<any>(null);
  const [targetBudget, setTargetBudget] = useState<{ amount: string; currency: 'INR' | 'USD' }>({ amount: '', currency: 'INR' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const sidebarItems = [
    { name: 'Dashboard', href: '/client/dashboard', icon: require('lucide-react').LayoutDashboard },
    { name: 'Post a Project', href: '/create-project', icon: require('lucide-react').PlusSquare },
    { name: 'Manage Projects', href: '/client/manage-projects', icon: require('lucide-react').ClipboardList },
    { name: 'Proposals', href: '/client/proposals', icon: require('lucide-react').Users },
    { name: 'Find Freelancers', href: '/freelancers/discover', icon: require('lucide-react').Search },
    { name: 'Messages', href: '/messages', icon: require('lucide-react').MessageSquare },
    { name: 'Settings', href: '/client/settings', icon: require('lucide-react').Settings },
  ];

  useEffect(() => {
    const pendingRequirement = window.localStorage.getItem(HERO_PROJECT_REQUIREMENT_KEY);
    if (!pendingRequirement) return;

    setOutcome(pendingRequirement);
    window.localStorage.removeItem(HERO_PROJECT_REQUIREMENT_KEY);
  }, []);

  const handlePublishProject = async () => {
    if (!aiData || !user) return;
    
    setIsPublishing(true);
    try {
      // 1. Determine the budget
      let minBudget = 1000;
      let maxBudget = 5000;
      let currency = 'INR';

      if (targetBudget.amount && !isNaN(parseInt(targetBudget.amount))) {
        // Use client's target budget
        const amount = parseInt(targetBudget.amount);
        minBudget = Math.floor(amount * 0.8);
        maxBudget = amount;
        currency = targetBudget.currency;
      } else if (aiData.analysis?.investment) {
        // Fallback to AI investment parsing
        const parts = aiData.analysis.investment.split('-').map((p: string) => parseInt(p.replace(/[^0-9]/g, '')));
        if (parts.length >= 1 && !isNaN(parts[0])) minBudget = parts[0];
        if (parts.length >= 2 && !isNaN(parts[1])) maxBudget = parts[1];
        
        // Check if investment string contains $ or ₹
        if (aiData.analysis.investment.includes('$')) currency = 'USD';
      }

      // 2. Extract data from AI analysis
      const projectData = {
        title: outcome.split('.')[0].slice(0, 50), // Simple title extraction
        description: aiData.analysis?.description || outcome,
        budget: {
          min: minBudget,
          max: maxBudget,
          currency: currency,
          type: 'fixed'
        },
        skillsRequired: aiData.analysis?.skills || [],
        status: 'open'
      };

      await callBackend('projects', 'POST', projectData);
      setPublishSuccess(true);
      
      // Delay redirect to show success state
      setTimeout(() => {
        router.push('/client/manage-projects');
      }, 2000);
      
    } catch (err) {
      console.error("Publishing Failed:", err);
      alert("Failed to publish project. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Budget</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                          <button 
                            onClick={() => setTargetBudget(prev => ({ ...prev, currency: 'INR' }))}
                            className={cn("px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all", targetBudget.currency === 'INR' ? "bg-white dark:bg-slate-700 shadow-sm text-primary-600" : "text-slate-500")}
                          >
                            INR
                          </button>
                          <button 
                            onClick={() => setTargetBudget(prev => ({ ...prev, currency: 'USD' }))}
                            className={cn("px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all", targetBudget.currency === 'USD' ? "bg-white dark:bg-slate-700 shadow-sm text-primary-600" : "text-slate-500")}
                          >
                            USD
                          </button>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-primary-500 transition-colors">
                          {targetBudget.currency === 'INR' ? '₹' : '$'}
                        </div>
                        <input
                          type="number"
                          value={targetBudget.amount}
                          onChange={(e) => setTargetBudget(prev => ({ ...prev, amount: e.target.value }))}
                          placeholder="e.g., 50000"
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary-500 outline-none font-bold text-slate-900 dark:text-white transition-all transition-all"
                        />
                      </div>
                      <p className="text-[9px] font-medium text-slate-400">
                        * Your target budget helps AI align the roadmap with your financial goals.
                      </p>
                    </div>

                    <SmartPricingWidget outcome={outcome} />
                  </div>
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

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800 animate-fade-in">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">AI Architecting Complete</span>
                  </div>
                  <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                    Project Architecture & Quotation.
                  </h1>
                  <p className="text-lg font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Our AI has analyzed your vision and generated a comprehensive financial and technical roadmap. Review your detailed project quotation below and download the official PDF brief for your records.
                  </p>
                </div>

                {/* Project Quotation Section */}
                <div className="w-full mt-12 text-left space-y-10">
                  <ProjectQuotation outcome={outcome} targetBudget={targetBudget} />
                  
                  <div className="flex flex-col items-center gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-500 max-w-md">
                      Ready to launch? Publishing will make your project visible to the top 1% of freelancers.
                    </p>
                    <Button 
                      onClick={handlePublishProject}
                      isLoading={isPublishing}
                      disabled={publishSuccess}
                      className={cn(
                        "h-16 px-12 rounded-2xl font-black text-lg shadow-2xl transition-all",
                        publishSuccess ? "bg-emerald-600 hover:bg-emerald-600" : "bg-primary-600 hover:scale-105"
                      )}
                    >
                      {publishSuccess ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={24} /> Project Published!
                        </span>
                      ) : (
                        "Publish Project to Marketplace"
                      )}
                    </Button>
                    {publishSuccess && (
                      <p className="text-xs font-bold text-emerald-600 animate-pulse uppercase tracking-widest">
                        Redirecting to your dashboard...
                      </p>
                    )}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
