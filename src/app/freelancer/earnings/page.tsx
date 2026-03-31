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
  ArrowRight
} from 'lucide-react';
import { Button, cn } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

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
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-800/50">
                   <Sparkles size={12} />
                   Income Dashboard
                </div>
                <h2 className="text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                   Your <span className="text-primary-600">Earnings</span>
                </h2>
             </div>
             <Button className="h-14 px-10 rounded-2xl font-black shadow-2xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all gap-3 bg-slate-950 text-white hover:bg-slate-900">
                <Wallet size={20} />
                Withdraw Funds
             </Button>
          </div>

          {/* Core Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => <Card key={i} className="p-8 space-y-4"><Skeleton className="h-4 w-1/3"/><Skeleton className="h-10 w-2/3"/></Card>)
            ) : (
              <>
                <Card className="p-8 bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-0 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors">
                      <TrendingUp size={120} />
                   </div>
                   <div className="relative z-10 space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Balance Available</p>
                      <h3 className="text-4xl font-black">$4,280.50</h3>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Pending: $850.00</p>
                         <ArrowRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                </Card>
                <Card className="p-8 hover:border-slate-200 dark:hover:border-slate-800 transition-all group">
                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Earned (YTD)</p>
                      <h3 className="text-4xl font-black text-slate-950 dark:text-white">$32,150.00</h3>
                      <div className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                         <TrendingUp size={14} />
                         +18.4% VS LAST YEAR
                      </div>
                   </div>
                </Card>
                <Card className="p-8 hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Avg. Project Value</p>
                      <h3 className="text-4xl font-black text-slate-950 dark:text-white">$1,850.00</h3>
                      <p className="text-xs text-slate-500 font-medium">Top 5% in your category</p>
                   </div>
                </Card>
              </>
            )}
          </div>

          {/* Payment History Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xl font-black text-slate-950 dark:text-white">Recent Payments</h3>
                   <Button variant="ghost" className="text-xs font-black text-primary-600 hover:bg-transparent">See All</Button>
                </div>
                <div className="space-y-4">
                   {isLoading ? (
                     [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)
                   ) : (
                     history.map(item => (
                       <div key={item.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-lg transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                             <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText size={20} className="text-slate-400" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-950 dark:text-white">{item.project}</p>
                                <p className="text-xs font-medium text-slate-400">{item.client} • {item.date}</p>
                             </div>
                          </div>
                          <div className="text-right space-y-1">
                             <p className="text-lg font-black text-slate-950 dark:text-white">${item.amount}</p>
                             <Badge className={cn(
                               "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                               item.status === 'paid' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20"
                             )}>{item.status}</Badge>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-950 dark:text-white px-2">Earning Insights</h3>
                <Card className="h-full min-h-[300px] flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/20 border-dashed border-2">
                   <div className="text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center mx-auto">
                         <Calendar size={24} className="text-primary-500" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">Visualization of your earnings growth <br/> will appear here as you complete projects.</p>
                   </div>
                </Card>
             </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
