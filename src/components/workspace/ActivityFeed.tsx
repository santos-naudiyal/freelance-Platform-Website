"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  CreditCard,
  Image as ImageIcon,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';

const iconMap: Record<string, React.ReactNode> = {
  upload: <ImageIcon className="text-blue-500" size={16} />,
  task: <CheckCircle2 className="text-emerald-500" size={16} />,
  message: <MessageSquare className="text-amber-500" size={16} />,
  milestone: <Clock className="text-purple-500" size={16} />,
  payment: <CreditCard className="text-primary-500" size={16} />,
  system: <RefreshCw className="text-slate-500" size={16} />
};

export function ActivityFeed({ workspaceId }: { workspaceId: string }) {
  const { activities, loading } = useActivityFeed(workspaceId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Activity Feed</h3>
        <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
             <div className="space-y-4 animate-pulse">
                <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
             </div>
        ) : activities.length === 0 ? (
             <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-sm">
                No recent activity. Actions in the workspace will appear here.
             </div>
        ) : (
          activities.map((activity, idx) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex gap-4 relative"
            >
              {idx !== activities.length - 1 && (
                <div className="absolute left-[1.125rem] top-10 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-500/20 transition-colors" />
              )}
              
              <div className="relative shrink-0">
                <img 
                  src={activity.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user?.name || 'User'}`} 
                  alt={activity.user?.name || 'User'} 
                  className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 object-cover border-2 border-white dark:border-slate-950 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm">
                  {iconMap[activity.type] || iconMap.system}
                </div>
              </div>

              <div className="flex-1 pb-6 w-full overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">{activity.user?.name || 'System'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                      {activity.createdAt ? formatDistanceToNow(activity.createdAt, { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 break-words">
                    {activity.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {activities.length > 5 && (
        <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-600 hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-950/10 transition-all">
          View Full History
        </button>
      )}
    </div>
  );
}
