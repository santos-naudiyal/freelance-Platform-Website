"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { auth } from '../../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings as SettingsIcon,
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button, cn } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/client/post-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: SettingsIcon },
];

export default function ClientPaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const resp = await fetch('http://localhost:5000/api/payments/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          setTransactions(data);
        }
      } catch (err) {
        console.error('Failed to fetch payment history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Financial Management">
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 dark:border-blue-800/50">
                   <CreditCard size={12} />
                   Secure Transactions
                </div>
                <h2 className="text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                   Payments & <span className="text-primary-600">Billing</span>
                </h2>
             </div>
             <Button className="h-14 px-8 rounded-2xl font-black shadow-xl shadow-primary-500/20 hover:scale-105 transition-all gap-3">
                <PlusSquare size={20} />
                Add Payment Method
             </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => <Card key={i} className="p-8 space-y-4"><Skeleton className="h-4 w-1/3"/><Skeleton className="h-10 w-2/3"/></Card>)
            ) : (
              <>
                <Card className="p-8 bg-slate-950 text-white border-0 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors">
                      <TrendingUp size={120} />
                   </div>
                   <div className="relative z-10 space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Spent</p>
                      <h3 className="text-4xl font-black">$12,450.00</h3>
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                         <TrendingUp size={14} />
                         +12% from last month
                      </div>
                   </div>
                </Card>
                <Card className="p-8 border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Pending Invoices</p>
                      <h3 className="text-4xl font-black text-slate-950 dark:text-white">$1,500.00</h3>
                      <p className="text-xs text-slate-500 font-medium italic">1 invoice awaiting approval</p>
                   </div>
                </Card>
                <Card className="p-8 border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Next Auto-pay</p>
                      <h3 className="text-4xl font-black text-slate-950 dark:text-white">Mar 25</h3>
                      <p className="text-xs text-slate-500 font-medium">Standard Subscription ($49/mo)</p>
                   </div>
                </Card>
              </>
            )}
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">Recent Transactions</h3>
                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary-600 p-0 hover:bg-transparent">Download CSV</Button>
             </div>

             <Card className="overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800/50">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Freelancer</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                       {isLoading ? (
                          [1, 2, 3].map(i => (
                             <tr key={i}>
                                <td colSpan={5} className="px-8 py-4"><Skeleton className="h-8 w-full rounded-xl"/></td>
                             </tr>
                          ))
                       ) : (
                         transactions.map((tx) => (
                           <tr key={tx.id} className="group hover:bg-white dark:hover:bg-slate-900 transition-colors">
                             <td className="px-8 py-6">
                               <div className="flex flex-col">
                                 <span className="text-sm font-bold text-slate-950 dark:text-white">{tx.project}</span>
                                 <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{tx.id}</span>
                               </div>
                             </td>
                             <td className="px-8 py-6">
                               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{tx.freelancer}</span>
                             </td>
                             <td className="px-8 py-6">
                               <Badge className={cn(
                                 "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                 tx.status === 'completed' 
                                   ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50" 
                                   : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/50"
                               )}>
                                 {tx.status}
                               </Badge>
                             </td>
                             <td className="px-8 py-6">
                               <span className="text-sm font-black text-slate-950 dark:text-white">${tx.amount.toLocaleString()}</span>
                             </td>
                             <td className="px-8 py-6">
                               <span className="text-sm font-medium text-slate-500">{tx.date}</span>
                             </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                  </table>
                </div>
             </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
