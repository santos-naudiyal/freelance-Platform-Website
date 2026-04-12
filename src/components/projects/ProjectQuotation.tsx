"use client";

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Clock, 
  TrendingUp,
  Zap,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Trophy,
  ShieldCheck,
  Globe,
  IndianRupee,
  Cpu,
  BarChart3,
  ArrowUpRight,
  type LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAI } from '@/hooks/useAI';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Skeleton } from '@/components/ui/Skeleton';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface QuotationData {
  summary: { text: string; complexity: string; confidenceScore: number };
  architectureFlow: { phase: string; details: string; technologies: string[] }[];
  pricing: { 
    indianMarket: { currency: string; min: number; max: number; recommended: number; };
    globalMarket: { currency: string; min: number; max: number; recommended: number; };
  };
  timeline: { minDays: number; maxDays: number; recommended: string };
  tasks: { name: string; description: string; hours: number; costINR: number; costUSD: number; }[];
  skills: string[];
  risks: { risk: string; mitigation: string }[];
  marketInsights: { demand: string; competition: string; analysis: string; };
  pricingOptions: {
    basic: { priceINR: number; priceUSD: number; features: string[] };
    standard: { priceINR: number; priceUSD: number; features: string[] };
    premium: { priceINR: number; priceUSD: number; features: string[] };
  };
  projectTitle: string;
}

export function ProjectQuotation({ outcome, targetBudget }: { outcome: string; targetBudget?: { amount: string; currency: 'INR' | 'USD' } }) {
  const { generateQuotation, loading, error } = useAI();
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [market, setMarket] = useState<'indianMarket' | 'globalMarket'>('indianMarket');

  useEffect(() => {
    if (outcome && !loading && !quotation) {
      generateQuotation(outcome, targetBudget).then((data) => {
        if (data) setQuotation(normalizeQuotationForBudget(data, outcome, targetBudget));
      });
    }
  }, [outcome, generateQuotation, loading, quotation, targetBudget]);

  const downloadPDF = () => {
    if (!quotation) return;
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const mkt = quotation.pricing[market];
    const currency = mkt.currency;
    const lineItems = quotation.tasks.map((task) => [
      task.name,
      task.description,
      `${task.hours} hrs`,
      `${currency} ${(market === 'indianMarket' ? task.costINR : task.costUSD).toLocaleString()}`
    ]);
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 34, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('PROJECT QUOTATION', 14, 16);
    doc.setFontSize(10);
    doc.text(quotation.projectTitle, 14, 25);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 16);
    doc.text(`Quote: ${currency} ${mkt.recommended.toLocaleString()}`, 160, 25);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text('Scope Summary', 14, 46);
    const summaryLines = doc.splitTextToSize(quotation.summary.text, 180);
    doc.setFontSize(9);
    doc.text(summaryLines, 14, 54);
    
    autoTable(doc, {
      startY: 68,
      head: [['Commercial Summary', 'Value']],
      body: [
        ['Client Budget Cap', `${currency} ${mkt.max.toLocaleString()}`],
        ['Recommended Quote', `${currency} ${mkt.recommended.toLocaleString()}`],
        ['Timeline', quotation.timeline.recommended],
        ['Costing Items', `${quotation.tasks.length} delivery items`],
      ],
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Item', 'Deliverables', 'Effort', 'Cost']],
      body: lineItems,
      foot: [['', '', 'Total', `${currency} ${mkt.recommended.toLocaleString()}`]],
      headStyles: { fillColor: [37, 99, 235] },
      footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 88 },
        2: { cellWidth: 22, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' },
      },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Milestone', 'Delivery Share']],
      body: [
        ['Kickoff and design approval', '20%'],
        ['Core development completed', '40%'],
        ['Admin/API/integrations completed', '25%'],
        ['Final QA, deployment, handover', '15%'],
      ],
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Note: Final quotation can change only if the approved scope, integrations, pages, or third-party requirements change.', 14, Math.min(doc.lastAutoTable.finalY + 12, 285));

    const fileName = `Quotation_${quotation.projectTitle.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  if (loading) return (
    <div className="w-full space-y-10 py-10">
      <Skeleton className="h-[28rem] w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Skeleton className="h-full w-full min-h-[400px]" />
      </div>
    </div>
  );

  if (error) return <div className="p-8 text-rose-500 font-bold text-center bg-rose-50 rounded-3xl border border-rose-100">AI Architecting failed. Please refresh.</div>;
  if (!quotation) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-12 pb-32"
      id="quotation-container"
    >
      {/* 1. HERO ARCHITECT CARD */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[3.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className="relative premium-glass p-10 lg:p-14 rounded-[3rem] border-primary-100/20 dark:border-primary-800/20 shadow-2xl overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 p-32 -mr-24 -mt-24 bg-primary-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 p-32 -ml-24 -mb-24 bg-indigo-500/10 blur-[100px] rounded-full" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-600/30">
                  <Trophy size={32} />
                </div>
                <div className="space-y-1">
                  <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                    {quotation.projectTitle}
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Project quotation with line-item costing</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <Badge icon={Cpu} text={`${quotation.summary.complexity} Complexity`} color="rose" />
                <Badge icon={ShieldCheck} text={`${quotation.summary.confidenceScore}% Confidence`} color="emerald" />
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Clock size={14} className="text-amber-500" />
                  Est. Delivery: {quotation.timeline.recommended}
                </div>
              </div>

              <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                {quotation.summary.text}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-[2rem] shadow-inner w-full sm:w-auto">
                <MarketToggle active={true} onClick={() => {}} icon={<IndianRupee size={14} />} label="Indian Market" />
              </div>
              <Button 
                onClick={downloadPDF}
                className="h-16 px-8 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-950 text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3 group/btn w-full sm:w-auto"
              >
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                Download Brief
              </Button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BentoStat label="Budget Cap" value={`${quotation.pricing[market].currency} ${quotation.pricing[market].max.toLocaleString()}`} icon={Zap} color="primary" />
            <BentoStat label="Recommended Quote" value={`${quotation.pricing[market].currency} ${quotation.pricing[market].recommended.toLocaleString()}`} icon={CheckCircle2} color="emerald" />
            <BentoStat label="Costing Items" value={`${quotation.tasks.length} Items`} icon={TrendingUp} color="indigo" />
            <BentoStat label="Delivery Time" value={quotation.timeline.recommended} icon={Clock} color="amber" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* 2. DELIVERY MODULES */}
          <SectionHeader icon={Layers} title="Delivery Modules" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotation.architectureFlow.map((flow, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-10 -mr-10 -mt-10 bg-slate-50 dark:bg-slate-800/30 rounded-full group-hover:bg-primary-500/10 transition-colors" />
                <span className="text-[11px] font-black tracking-[0.2em] text-primary-500 uppercase mb-4 block">Engine 0{idx + 1}</span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-3">{flow.phase}</h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{flow.details}</p>
                <div className="flex flex-wrap gap-2">
                  {flow.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border border-white dark:border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3. COST BREAKDOWN */}
          <SectionHeader icon={BarChart3} title="Detailed Cost Breakdown" />
          <div className="premium-glass p-0 rounded-[2.5rem] border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Cost Item</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Effort</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {quotation.tasks.map((task, i) => (
                  <tr key={i} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 dark:text-white text-base mb-1">{task.name}</div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">{task.description}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-400">
                        {task.hours} Hours
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-900 dark:text-white">
                      {quotation.pricing[market].currency} {(market === 'indianMarket' ? task.costINR : task.costUSD).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950 text-white">
                <tr>
                  <td className="px-8 py-5 text-sm font-black uppercase tracking-widest">Recommended Quote</td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-300">{quotation.timeline.recommended}</td>
                  <td className="px-8 py-5 text-right text-lg font-black">
                    {quotation.pricing[market].currency} {quotation.pricing[market].recommended.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* 5. MARKET INTELLIGENCE */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-500" />
            <div className="relative p-10 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 text-white shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="absolute bottom-0 right-0 p-32 -mr-32 -mb-32 bg-primary-600/30 blur-[80px] rounded-full" />
              
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <TrendingUp size={22} className="text-primary-400" />
                </div>
                <h4 className="text-base font-black uppercase tracking-widest">Market Intelligence</h4>
              </div>

              <div className="space-y-10 flex-grow relative z-10">
                <IntelligenceBlock label="Strategy Dynamics" value={quotation.marketInsights.analysis} />
                <IntelligenceBlock label="Yield Potential" value={quotation.marketInsights.demand} />
                <IntelligenceBlock label="Competitive Landscape" value={quotation.marketInsights.competition} />
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Cpu size={14} className="text-primary-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite Talent Matrix</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quotation.skills.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 hover:bg-white/10 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6. RISK MITIGATION RIGOR */}
          <div className="p-10 rounded-[2.5rem] bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-500/5">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-600 mb-8 flex items-center gap-2">
              <AlertTriangle size={18} />
              Tactical Risk Mitigation
            </h4>
            <div className="space-y-8">
              {quotation.risks.map((risk, i) => (
                <div key={i} className="space-y-2 group">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{risk.risk}</div>
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 border-rose-200 dark:border-rose-900 pl-4 py-1 italic">
                    {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REAL TIME INDICATOR */}
          <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="h-2 w-2 rounded-full bg-emerald-500 absolute" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Real-Time Market Rate Active</span>
          </div>

        </div>

      </div>
    </motion.div>
  );
}

function normalizeQuotationForBudget(
  quotation: QuotationData,
  outcome: string,
  targetBudget?: { amount: string; currency: 'INR' | 'USD' }
): QuotationData {
  const amount = Number(String(targetBudget?.amount || '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(amount) || amount <= 0) return quotation;

  const rate = 83;
  const inrCap = targetBudget?.currency === 'USD' ? amount * rate : amount;
  const usdCap = targetBudget?.currency === 'USD' ? amount : amount / rate;
  const inrRecommended = roundMoney(inrCap * 0.9, 'INR');
  const usdRecommended = roundMoney(usdCap * 0.9, 'USD');
  const tasks = buildCostBreakdown(outcome, inrRecommended, usdRecommended);

  return {
    ...quotation,
    summary: {
      ...quotation.summary,
      text: `This quotation is scoped to stay within the client's ${targetBudget?.currency} ${amount.toLocaleString()} budget. It includes design, development, backend/API, admin controls where required, testing, deployment, and handover.`
    },
    pricing: {
      indianMarket: {
        currency: 'INR',
        min: roundMoney(inrRecommended * 0.75, 'INR'),
        max: roundMoney(inrCap, 'INR'),
        recommended: inrRecommended
      },
      globalMarket: {
        currency: 'USD',
        min: roundMoney(usdRecommended * 0.75, 'USD'),
        max: roundMoney(usdCap, 'USD'),
        recommended: usdRecommended
      }
    },
    tasks,
    architectureFlow: quotation.architectureFlow?.length ? quotation.architectureFlow : buildArchitecture(outcome)
  };
}

function buildCostBreakdown(outcome: string, totalINR: number, totalUSD: number) {
  const scope = outcome.toLowerCase();
  const items = [
    { name: 'Requirement Mapping', description: 'Finalize roles, features, screens, acceptance criteria, and milestones.', weight: 0.08, hours: 8 },
    { name: 'UI/UX Design', description: 'Wireframes, visual design, responsive layouts, user journeys, and design handoff.', weight: 0.16, hours: 24 },
    { name: scope.includes('app') || scope.includes('flutter') || scope.includes('mobile') ? 'Mobile App Development' : 'Frontend Development', description: 'Client-facing screens, forms, validations, navigation, and responsive implementation.', weight: 0.26, hours: 44 },
    { name: 'Backend API and Database', description: 'APIs, data models, authentication, business rules, and secure database setup.', weight: 0.2, hours: 34 },
    { name: 'Admin Panel', description: 'Admin dashboard for users, content, projects, orders, bookings, reports, and settings as needed.', weight: 0.14, hours: 26 },
    { name: 'Integrations and Notifications', description: 'Payment gateway, email/SMS/WhatsApp, file upload, analytics, or required third-party services.', weight: 0.07, hours: 14 },
    { name: 'QA, Deployment and Handover', description: 'Testing, bug fixing, production deployment, documentation, and handover.', weight: 0.09, hours: 18 }
  ];
  let runningINR = 0;
  let runningUSD = 0;

  return items.map((item, index) => {
    const last = index === items.length - 1;
    const costINR = last ? totalINR - runningINR : roundMoney(totalINR * item.weight, 'INR');
    const costUSD = last ? totalUSD - runningUSD : roundMoney(totalUSD * item.weight, 'USD');
    runningINR += costINR;
    runningUSD += costUSD;
    return { name: item.name, description: item.description, hours: item.hours, costINR, costUSD };
  });
}

function buildArchitecture(outcome: string) {
  const isApp = /app|flutter|mobile|ios|android/i.test(outcome);
  return [
    { phase: 'UI/UX and Product Flow', details: 'Screens, navigation, user journeys, forms, and responsive states are finalized before development.', technologies: ['Figma', 'Design System', 'Responsive UI'] },
    { phase: isApp ? 'Mobile App Build' : 'Frontend Build', details: 'Client-facing interface is implemented with validations, reusable components, and production-ready user flows.', technologies: isApp ? ['Flutter', 'Dart', 'State Management'] : ['Next.js', 'React', 'Tailwind CSS'] },
    { phase: 'Backend, Database and Admin', details: 'APIs, database models, authentication, admin controls, and business rules are built around the approved workflow.', technologies: ['Node.js', 'Firebase/PostgreSQL', 'REST APIs'] },
    { phase: 'Testing and Launch', details: 'QA, bug fixes, deployment, handover notes, and launch support are completed before closure.', technologies: ['QA Checklist', 'Cloud Hosting', 'Documentation'] }
  ];
}

function roundMoney(value: number, currency: 'INR' | 'USD') {
  const unit = currency === 'INR' ? 100 : 10;
  return Math.max(unit, Math.round(value / unit) * unit);
}

type StatColor = 'primary' | 'emerald' | 'indigo' | 'amber';

function BentoStat({ label, value, icon: Icon, color }: { label: string; value: string; icon: LucideIcon; color: StatColor }) {
  const colors: Record<StatColor, string> = {
    primary: "text-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-primary-500/10",
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-emerald-500/10",
    indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-indigo-500/10",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-amber-500/10"
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 flex items-center gap-5 group hover:border-primary-500/20 transition-all shadow-lg hover:shadow-xl">
      <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg", colors[color])}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, text, color }: { icon: LucideIcon, text: string, color: 'rose' | 'emerald' | 'amber' }) {
  const colors = {
    rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    amber: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50"
  };

  return (
    <div className={cn("inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm", colors[color])}>
      <Icon size={14} />
      {text}
    </div>
  );
}

function MarketToggle({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all", 
        active 
          ? "bg-white dark:bg-slate-700 shadow-xl text-slate-900 dark:text-white scale-105" 
          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon, title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-600">
        <Icon size={22} />
      </div>
      <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
        {title}
      </h3>
      <div className="flex-grow h-px bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent ml-4" />
    </div>
  );
}

function IntelligenceBlock({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-3 group/intel">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/intel:text-primary-400 transition-colors">{label}</span>
        <ArrowUpRight size={14} className="text-slate-600 group-hover/intel:text-primary-400 transition-transform group-hover/intel:translate-x-0.5 group-hover/intel:-translate-y-0.5" />
      </div>
      <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
        &quot;{value}&quot;
      </p>
    </div>
  );
}
