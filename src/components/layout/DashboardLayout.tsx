"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Menu, X, Bell, User as UserIcon,
  Briefcase, FileText, MessageSquare, Settings as SettingsIcon,
  Search, CheckCircle2, Zap, LogOut
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
          "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black transition-all duration-300 uppercase tracking-widest",
          isActive
            ? "bg-primary-600 text-white shadow-xl shadow-primary-500/25 border-b-2 border-primary-700 -translate-y-0.5 active:translate-y-0"
            : "text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/40"
        )}
      >
        <item.icon
          size={18}
          className={cn(
            "shrink-0 transition-all duration-300",
            isActive ? "text-white scale-110" : "text-slate-400 group-hover:text-primary-500 group-hover:scale-110"
          )}
        />
        <span className="truncate">{item.name}</span>
        {isActive && (
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-glow animate-pulse" />
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
        "fixed inset-y-0 left-0 z-[100] w-[88vw] max-w-72 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-white/5 transition-all duration-500 ease-in-out shadow-2xl lg:w-72 lg:max-w-none lg:shadow-none",
        "lg:translate-x-0 lg:opacity-100",
        isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex h-20 sm:h-24 items-center justify-between px-5 sm:px-8 shrink-0 gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Zap size={20} className="text-white" />
            </div>
            <span className="truncate text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              FreelanceHub<span className="text-primary-600">.</span>
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-2xl text-slate-400 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-all group"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center overflow-hidden shrink-0 ring-4 ring-white dark:ring-slate-900 shadow-lg shadow-primary-500/10">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
              ) : (
                <UserIcon size={18} className="text-white" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-950 dark:text-white truncate uppercase tracking-tight">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">{user?.role || 'freelancer'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-6 sm:py-8 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="px-5 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Main Menu</p>
          {activeSidebarItems.slice(0, -1).map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
          <div className="pt-10">
            <p className="px-5 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Configuration</p>
            {activeSidebarItems.slice(-1).map((item) => (
              <SidebarLink key={item.name} item={item} />
            ))}
          </div>
        </nav>

        {/* Upgrade Banner + Logout */}
        <div className="px-3 sm:px-4 pb-6 sm:pb-8 space-y-4 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
          >
            <LogOut size={18} className="shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

    <div className="flex-1 lg:pl-72 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex min-h-16 sm:min-h-20 items-center justify-between gap-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-4 sm:px-6 lg:px-10 py-3">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 rounded-2xl text-slate-400 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-900 transition-all"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Page Title */}
          <div className="flex-1 min-w-0 pr-2 sm:pr-4">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight truncate">
                {title}
              </h1>
          </div>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button className="relative p-2.5 rounded-2xl text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all group">
              <Bell size={22} className="group-hover:shake transition-transform" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white dark:border-slate-950" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-100 dark:border-white/10">
              <div className="hidden md:block text-right">
                <p className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">{user?.name || 'User'}</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                   <span className="h-1 w-1 rounded-full bg-emerald-500" />
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">{user?.role}</p>
                </div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-lg shadow-primary-500/10">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon size={18} className="text-white" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-7xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
