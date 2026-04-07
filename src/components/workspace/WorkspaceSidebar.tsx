"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Files, 
  MessageSquare, 
  Clock, 
  CreditCard,
  Settings,
  ChevronLeft,
  Activity,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/overview' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: MessageSquare, label: 'Chat', href: '/chat' },
  { icon: Files, label: 'Files', href: '/files' },
  { icon: CreditCard, label: 'Payments', href: '/payments' },
  { icon: Clock, label: 'Timeline', href: '/timeline' },
  { icon: Activity, label: 'Activity', href: '/activity' },
];

export function WorkspaceSidebar({
  projectSlug,
  isOpen = true,
  onClose,
}: {
  projectSlug: string;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const baseUrl = `/workspace/${projectSlug}`;

  return (
    <aside
      className={cn(
        "h-screen truncate bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col",
        "fixed inset-y-0 left-0 z-40 w-[84vw] max-w-64 transition-transform duration-300 lg:sticky lg:top-0 lg:w-64 lg:max-w-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 group" onClick={onClose}>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <ChevronLeft size={18} />
            </div>
            <span className="truncate text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-primary-600 transition-colors">
              Exit Workspace
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1 flex-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === `${baseUrl}${item.href === '/overview' ? '' : item.href}`;
            return (
              <Link
                key={item.label}
                href={`${baseUrl}${item.href === '/overview' ? '' : item.href}`}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white dark:bg-slate-800 text-primary-600 shadow-sm border border-slate-200/60 dark:border-slate-700" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-primary-600" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all">
          <Settings size={18} className="text-slate-400" />
          Settings
        </button>
      </div>
    </aside>
  );
}
