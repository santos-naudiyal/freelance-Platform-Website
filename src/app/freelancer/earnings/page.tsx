"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { auth } from '../../../lib/firebase';
import { useAuthStore } from '../../../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  Calendar,
  Sparkles,
  ArrowRight,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { Button, cn } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { motion } from 'framer-motion';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function FreelancerEarningsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user || !auth.currentUser) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const resp = await fetch('http://localhost:5000/api/payments/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch earning history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchEarnings();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Financial Overview">
        <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
          
          {/* Animated Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
          
          <div className="max-w-3xl w-full relative z-10 text-center space-y-12">
            
            {/* Main Coming Soon Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800/50 rounded-[3rem] p-10 sm:p-20 shadow-2xl relative overflow-hidden"
            >
              {/* Glowing Icon */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary-500/40"
              >
                <DollarSign size={40} className="text-white" strokeWidth={3} />
              </motion.div>

              <div className="space-y-6">
                <Badge className="px-5 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] border-none">
                  Launching Q2 2024
                </Badge>
                
                <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                  Payment <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Nexus</span>
                </h2>
                
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                  We're re-engineering our financial infrastructure to provide instant withdrawals, multi-currency support, and direct bank transfers.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-slate-200/50 dark:border-slate-800/50 text-left">
                {[
                  { icon: Zap, label: 'Instant Payouts' },
                  { icon: Globe, label: 'Global Transfers' },
                  { icon: Lock, label: 'Secure Escrow' }
                ].map((feature, i) => (
                  <div key={i} className="space-y-3 p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <feature.icon size={20} className="text-primary-500 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {feature.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter/Notify Section */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                Get notified when we go live
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 h-14 rounded-2xl px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium text-sm"
                />
                <Button className="h-14 px-8 rounded-2xl font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-transform">
                  Notify Me
                </Button>
              </div>
            </div>

          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
