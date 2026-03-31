"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Menu, X, Bell, User as UserIcon,
  Briefcase, FileText, MessageSquare, DollarSign, Settings as SettingsIcon,
  Search, CheckCircle2, ChevronRight, Zap, LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

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

export function DashboardLayout({ children, title, sidebarItems }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const freelancerSidebar: SidebarItem[] = [
    { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
    { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
    { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
    { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
    { name: 'Settings', href: '/freelancer/settings', icon: SettingsIcon },
  ];

  const clientSidebar: SidebarItem[] = [
    { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Manage Projects', href: '/client/manage-projects', icon: Briefcase },
    { name: 'Find Freelancers', href: '/freelancers', icon: Search },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Settings', href: '/client/settings', icon: SettingsIcon },
  ];

  const activeSidebarItems = sidebarItems || (user?.role === 'client' ? clientSidebar : freelancerSidebar);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const SidebarLink = ({ item }: { item: SidebarItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
        )}
      >
        <item.icon
          size={18}
          className={cn(
            "shrink-0 transition-colors",
            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
          )}
        />
        <span className="truncate">{item.name}</span>
        {isActive && (
          <ChevronRight size={14} className="ml-auto text-white/70" />
        )}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ─── Mobile Overlay ─── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-md shadow-primary-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
              FreelanceHub
            </span>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-primary-200 dark:ring-primary-900">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
              ) : (
                <UserIcon size={17} className="text-white" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 capitalize truncate">{user?.role || 'freelancer'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Menu</p>
          {activeSidebarItems.slice(0, -1).map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
          <div className="pt-4">
            <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</p>
            {activeSidebarItems.slice(-1).map((item) => (
              <SidebarLink key={item.name} item={item} />
            ))}
          </div>
        </nav>

        {/* Upgrade Banner + Logout */}
        <div className="px-3 pb-4 space-y-2 shrink-0">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary-600 to-violet-700 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-200 mb-1">Pro Plan</p>
            <p className="text-sm font-medium text-white/90 mb-3">Unlock premium features & priority matching.</p>
            <button className="w-full py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-xs font-bold transition-colors">
              Upgrade Now →
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-all"
          >
            <LogOut size={17} className="shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Page Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white font-display truncate">
              {title}
            </h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 ml-1">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 font-medium capitalize">{user?.role}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center overflow-hidden ring-2 ring-primary-200 dark:ring-primary-900">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon size={17} className="text-white" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
