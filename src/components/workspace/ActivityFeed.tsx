"use client";

import React, { useState } from 'react';
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
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/ui/Skeleton';

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
  const { user } = useAuthStore();
  const [updateText, setUpdateText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim() || !user) return;
    
    setIsPosting(true);
    try {
      await addDoc(collection(db, 'ActivityLogs'), {
        projectId: workspaceId,
        type: 'message',
        content: `Daily Update: ${updateText}`,
        user: {
          id: user.id,
          name: user.name || 'User',
          avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
        },
        timestamp: Date.now(),
        createdAt: Date.now()
      });
      setUpdateText('');
    } catch (err) {
      console.error('Failed to post update', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Activity Feed</h3>
        <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {user?.role === 'freelancer' && (
        <form onSubmit={handlePostUpdate} className="flex gap-3 mb-6">
          <input 
            type="text" 
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Share your daily project update..." 
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
            disabled={isPosting}
          />
          <button 
            type="submit" 
            disabled={isPosting || !updateText.trim()}
            className="px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
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
