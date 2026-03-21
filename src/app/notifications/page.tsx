"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  CreditCard, 
  Users,
  Settings,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type NotificationType = 'workspace' | 'message' | 'payment' | 'task' | 'system';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  avatar?: string;
};

const iconMap: Record<NotificationType, React.ReactNode> = {
  workspace: <Users size={18} className="text-blue-500" />,
  message: <MessageSquare size={18} className="text-violet-500" />,
  payment: <CreditCard size={18} className="text-emerald-500" />,
  task: <CheckCircle2 size={18} className="text-amber-500" />,
  system: <Bell size={18} className="text-slate-400" />,
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'workspace',
    title: 'Sarah Chen joined your workspace',
    body: '"Build a Flutter e-commerce app" — Sarah has been added as Flutter Expert.',
    time: '2 min ago',
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: '2',
    type: 'task',
    title: 'Task completed',
    body: '"Homepage Layout" was moved to Review by Marcus Volkov.',
    time: '1 hour ago',
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment released',
    body: 'Milestone 1: UI/UX Final Prototype — $1,200 released from escrow.',
    time: '3 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'message',
    title: 'New message from Alex Rivera',
    body: '"Hey, I just pushed the updated Figma file. Let me know if you want any —"',
    time: '5 hours ago',
    read: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: '5',
    type: 'workspace',
    title: 'Client approved Milestone 2',
    body: 'Core API Integration milestone has been verified and approved by your client.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Weekly workspace summary',
    body: 'Your team completed 7 tasks and delivered 2 milestones this week.',
    time: '2 days ago',
    read: true,
  },
];

const bgMap: Record<NotificationType, string> = {
  workspace: 'bg-blue-50 dark:bg-blue-950/20',
  message: 'bg-violet-50 dark:bg-violet-950/20',
  payment: 'bg-emerald-50 dark:bg-emerald-950/20',
  task: 'bg-amber-50 dark:bg-amber-950/20',
  system: 'bg-slate-50 dark:bg-slate-900',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-10">
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm font-bold text-primary-600">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all flex items-center gap-2"
            >
              <Check size={14} />
              Mark All Read
            </button>
            <button className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === tab
                  ? "bg-slate-950 text-white shadow-xl"
                  : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-slate-200"
              )}
            >
              {tab} {tab === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="h-20 w-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Bell size={36} className="text-slate-300 dark:text-slate-600" />
                </div>
                <div className="text-sm font-bold text-slate-400">All caught up!</div>
              </motion.div>
            ) : (
              filtered.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    "flex gap-5 p-6 rounded-[1.75rem] border cursor-pointer transition-all hover:shadow-md",
                    !notif.read
                      ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-50 dark:border-slate-900 opacity-70"
                  )}
                >
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0", bgMap[notif.type])}>
                    {notif.avatar ? (
                      <img src={notif.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                    ) : (
                      iconMap[notif.type]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{notif.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.read && (
                          <div className="h-2 w-2 rounded-full bg-primary-500 shadow-sm shadow-primary-500" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{notif.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.body}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}
