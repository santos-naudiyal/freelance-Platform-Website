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
  Activity
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

export function WorkspaceSidebar({ projectSlug }: { projectSlug: string }) {
  const pathname = usePathname();
  const baseUrl = `/workspace/${projectSlug}`;

  return (
    <aside className="w-64 h-screen truncate sticky top-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-10">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/10 group-hover:scale-110 transition-transform">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-primary-600 transition-colors">
            Exit Workspace
          </span>
        </Link>

        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === `${baseUrl}${item.href === '/overview' ? '' : item.href}`;
            return (
              <Link
                key={item.label}
                href={`${baseUrl}${item.href === '/overview' ? '' : item.href}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                  isActive 
                    ? "bg-white dark:bg-slate-800 text-primary-600 shadow-sm border border-slate-100 dark:border-slate-700" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
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
