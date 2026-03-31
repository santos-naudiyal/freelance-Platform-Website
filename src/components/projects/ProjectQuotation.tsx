"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  Zap,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Trophy,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAI } from '@/hooks/useAI';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

// Extend the jsPDF type to include autoTable or use explicit call
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface QuotationData {
  summary: { text: string; complexity: string; confidenceScore: number };
  pricing: { currency: string; min: number; max: number; recommended: number };
  timeline: { minDays: number; maxDays: number; recommended: string };
  tasks: { name: string; description: string; hours: number; cost: number }[];
  skills: string[];
  risks: { risk: string; mitigation: string }[];
  marketInsights: { avgPrice: string; demand: string; competition: string };
  pricingOptions: {
    basic: { price: number; features: string[] };
    standard: { price: number; features: string[] };
    premium: { price: number; features: string[] };
  };
  projectTitle: string;
}

export function ProjectQuotation({ outcome }: { outcome: string }) {
  const { generateQuotation, loading, error } = useAI();
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [activeTier, setActiveTier] = useState<'basic' | 'standard' | 'premium'>('standard');

  useEffect(() => {
    if (outcome && !loading && !quotation) {
      generateQuotation(outcome).then((data) => {
        if (data) setQuotation(data);
      });
    }
  }, [outcome, generateQuotation, loading, quotation]);

  const downloadPDF = () => {
    if (!quotation) {
      console.error("No quotation data available for download");
      return;
    }

    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('PROJECT QUOTATION', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

      // Project Info
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.text(quotation.projectTitle || 'Project Proposal', 14, 50);
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      const complexity = quotation.summary?.complexity || 'Standard';
      const confidence = quotation.summary?.confidenceScore || 100;
      doc.text(`Complexity: ${complexity} | Confidence: ${confidence}%`, 14, 56);

      // Summary
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text('Project Overview', 14, 70);
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const summaryText = quotation.summary?.text || '';
      const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 28);
      doc.text(splitSummary, 14, 76);

      let currentY = 76 + (splitSummary.length * 5) + 10;

      // Financial Summary Table
      autoTable(doc, {
        startY: currentY,
        head: [['Metric', 'Estimate']],
        body: [
          ['Minimum Investment', `${quotation.pricing?.currency || 'INR'} ${(quotation.pricing?.min || 0).toLocaleString()}`],
          ['Maximum Investment', `${quotation.pricing?.currency || 'INR'} ${(quotation.pricing?.max || 0).toLocaleString()}`],
          ['Recommended Budget', `${quotation.pricing?.currency || 'INR'} ${(quotation.pricing?.recommended || 0).toLocaleString()}`],
          ['Estimated Timeline', quotation.timeline?.recommended || 'TBD'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
      });

      currentY = doc.lastAutoTable?.finalY || (currentY + 40);

      // Task Breakdown
      if (quotation.tasks && quotation.tasks.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Detailed Task Breakdown', 14, currentY + 15);
        autoTable(doc, {
          startY: currentY + 20,
          head: [['Task', 'Description', 'Hours', 'Cost']],
          body: quotation.tasks.map(t => [
            t.name || 'Task', 
            t.description || '',
            t.hours || 0, 
            `${quotation.pricing?.currency || 'INR'} ${(t.cost || 0).toLocaleString()}`
          ]),
          theme: 'grid',
          headStyles: { fillColor: [30, 41, 59] },
          columnStyles: {
            1: { cellWidth: 80 }
          }
        });
        currentY = doc.lastAutoTable?.finalY || (currentY + 60);
      }

      // Risks
      if (quotation.risks && quotation.risks.length > 0) {
        if (currentY > 230) { doc.addPage(); currentY = 20; } else { currentY += 15; }
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Risk Analysis & Mitigation', 14, currentY);
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Risk Factor', 'Mitigation Strategy']],
          body: quotation.risks.map(r => [r.risk || 'General Risk', r.mitigation || 'N/A']),
          theme: 'striped',
          headStyles: { fillColor: [225, 29, 72] }, // Rose-600
        });
      }

      // Save
      const fileName = `Quotation_${(quotation.projectTitle || 'Project').replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Falling back to text download.");
      
      // Fallback to text download
      const textContent = `
        PROJECT QUOTATION: ${quotation.projectTitle}
        Total Budget: ${quotation.pricing.currency} ${quotation.pricing.recommended.toLocaleString()}
        Timeline: ${quotation.timeline.recommended}
        
        Summary:
        ${quotation.summary.text}
      `;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quotation_${quotation.projectTitle.replace(/\s+/g, '_')}.txt`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse space-y-6">
        <div className="h-8 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-full bg-slate-50 dark:bg-slate-900 rounded-md" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-50 dark:bg-slate-900 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-500 font-medium text-center">Error generating quotation. Please try again.</div>;
  if (!quotation) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-10 pb-20"
    >
      {/* HEADER SECTION */}
      <div className="premium-glass p-10 rounded-[3rem] border-primary-100 dark:border-primary-900 shadow-2xl shadow-primary-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 -mr-20 -mt-20 bg-primary-500/10 blur-3xl rounded-full" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-600/30">
                <Trophy size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase line-clamp-1">
                  {quotation.projectTitle}
                </h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                    quotation.summary.complexity === 'High' ? "bg-rose-100 text-rose-600" :
                    quotation.summary.complexity === 'Medium' ? "bg-amber-100 text-amber-600" : 
                    "bg-emerald-100 text-emerald-600"
                  )}>
                    {quotation.summary.complexity} Complexity
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={12} className="text-primary-500" />
                    {quotation.summary.confidenceScore}% Confidence
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={downloadPDF}
            className="h-14 px-8 rounded-2xl bg-slate-950 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
          >
            <Download size={20} />
            Download Legal PDF Quotation
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox label="Min Investment" value={`${quotation.pricing.currency} ${quotation.pricing.min.toLocaleString()}`} icon={Zap} color="text-primary-500" />
          <StatBox label="Max Investment" value={`${quotation.pricing.currency} ${quotation.pricing.max.toLocaleString()}`} icon={TrendingUp} color="text-emerald-500" />
          <StatBox label="Recommended" value={`${quotation.pricing.currency} ${quotation.pricing.recommended.toLocaleString()}`} icon={CheckCircle2} color="text-indigo-500" />
          <StatBox label="Timeline" value={quotation.timeline.recommended} icon={Clock} color="text-amber-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PRICING TIERS */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={20} className="text-primary-500" />
              Strategic Pricing Tiers
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['basic', 'standard', 'premium'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={cn(
                    "p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group",
                    activeTier === tier 
                      ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 shadow-xl shadow-primary-500/10" 
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-200"
                  )}
                >
                  <div className="flex flex-col h-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary-500 transition-colors">
                      {tier}
                    </span>
                    <div className="text-xl font-black text-slate-900 dark:text-white my-2">
                      ₹{quotation.pricingOptions[tier].price.toLocaleString()}
                    </div>
                    <ul className="mt-4 space-y-2 flex-grow">
                      {quotation.pricingOptions[tier].features.slice(0, 4).map((f, i) => (
                        <li key={i} className="text-[10px] font-bold text-slate-500 flex items-start gap-2">
                          <CheckCircle2 size={12} className="text-primary-500 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {activeTier === tier && (
                    <motion.div layoutId="tier-active" className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* TASK BREAKDOWN */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={20} className="text-primary-500" />
              Detailed Execution Roadmap
            </h3>
            <div className="premium-card p-0 overflow-hidden border-slate-100 dark:border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Task / Phase</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hours</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Estimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  {quotation.tasks.map((task, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{task.name}</div>
                        <div className="text-[10px] font-medium leading-relaxed">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold">{task.hours}h</td>
                      <td className="px-6 py-4 text-right text-xs font-black text-slate-900 dark:text-white">
                        ₹{task.cost.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INSIGHTS & RISKS */}
        <div className="space-y-8">
          {/* MARKET INSIGHTS */}
          <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-10 -mr-10 -mb-10 bg-primary-600/20 blur-2xl rounded-full" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Market Dynamics</h4>
            <div className="space-y-6 relative z-10">
              <InsightRow label="Market Price Range" value={quotation.marketInsights.avgPrice} />
              <InsightRow label="Project Demand" value={quotation.marketInsights.demand} highlight />
              <InsightRow label="Competition" value={quotation.marketInsights.competition} />
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-800 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Expertise Requirements</span>
              <div className="flex flex-wrap gap-2">
                {quotation.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RISK ANALYSIS */}
          <div className="p-8 rounded-[2.5rem] bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-600 mb-6 flex items-center gap-2">
              <AlertTriangle size={16} />
              Risk Mitigation
            </h4>
            <div className="space-y-4">
              {quotation.risks.map((risk, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-tight">{risk.risk}</div>
                  <div className="text-[10px] font-medium text-slate-500 italic">Mitigation: {risk.mitigation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function StatBox({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4 group hover:border-primary-500/30 transition-all">
      <div className={cn("p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 group-hover:scale-110 transition-transform", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-sm font-black text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function InsightRow({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="font-bold text-slate-400 lowercase italic">{label}</span>
      <span className={cn("font-black", highlight ? "text-primary-400" : "text-white")}>{value}</span>
    </div>
  );
}
