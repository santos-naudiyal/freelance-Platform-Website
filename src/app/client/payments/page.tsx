"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { auth } from '../../../lib/firebase';
import { useAuthStore } from '../../../store/useAuthStore';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings as SettingsIcon,
  Search,
  CheckCircle2,
  Lock,
  FileText,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { motion } from 'framer-motion';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Users },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: SettingsIcon },
];

export default function ClientPaymentsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to prevent flicking if needed, or real logic
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Financial Management">
        <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
          
          {/* Animated Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] animate-pulse" />
          
          <div className="max-w-4xl w-full relative z-10 text-center space-y-12">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800/50 rounded-[3.5rem] p-12 sm:p-24 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 text-blue-500/5 rotate-12">
                <CreditCard size={200} strokeWidth={1} />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
                  <Lock size={14} className="text-blue-400" />
                  Enterprise Security
                </div>

                <h2 className="text-4xl sm:text-7xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                   The Future of <br/> 
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Global Billing</span>
                </h2>

                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                  We're building a seamless escrow and automated invoicing system. Pay your global talent with one click, in any currency.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  {[
                    { icon: CheckCircle2, text: 'Smart Escrow' },
                    { icon: FileText, text: 'Auto-Invoicing' },
                    { icon: Sparkles, text: 'Custom Tax Forms' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <item.icon size={14} className="text-blue-500" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left space-y-1">
                  <p className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">Early Access Program</p>
                  <p className="text-xs text-slate-500 font-medium tracking-tight">Join 200+ companies testing our Beta</p>
                </div>
                <Button className="h-14 px-10 rounded-2xl font-black bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                  Join Waitlist
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
