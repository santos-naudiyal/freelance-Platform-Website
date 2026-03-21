"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../ui/Button';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Menu, X, Bell, User as UserIcon,
  Briefcase, FileText, MessageSquare, DollarSign, Settings as SettingsIcon,
  PlusSquare, ClipboardList, Search, CreditCard, CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user } = useAuthStore();

  const freelancerSidebar = [
    { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
    { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
    { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
    { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
    { name: 'Settings', href: '/freelancer/settings', icon: SettingsIcon },
  ];

  const clientSidebar = [
    { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Post a Project', href: '/client/post-project', icon: PlusSquare },
    { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
    { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Payments', href: '/client/payments', icon: CreditCard },
    { name: 'Settings', href: '/client/settings', icon: SettingsIcon },
  ];

  const activeSidebarItems = user?.role === 'client' ? clientSidebar : freelancerSidebar;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 flex-col premium-glass border-r border-slate-200/50 dark:border-slate-800/50 transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center px-8 border-b border-slate-200/50 dark:border-slate-800/50">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              FreelanceHub
            </span>
          </Link>
        </div>
        
        <div className="flex flex-col flex-1 gap-2 px-6 py-8 overflow-y-auto">
          {activeSidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold tracking-tight transition-all duration-300",
                  isActive
                    ? "bg-primary-600 text-white shadow-xl shadow-primary-500/20"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/50"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-900/40 text-white space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upgrade to Pro</p>
            <p className="text-sm text-slate-100">Unlock elite features and faster matching.</p>
            <button className="w-full py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-xs font-bold transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 premium-glass border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-6">
             <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-500 border-2 border-white dark:border-slate-950" />
             </button>
             <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-primary-500/20 flex items-center justify-center">
                <UserIcon size={20} className="text-slate-500" />
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
