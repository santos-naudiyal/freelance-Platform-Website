import React from 'react';
import { cn } from '../ui/Button';
import { Search, MoreVertical } from 'lucide-react';

interface ChatSidebarProps {
  conversations: any[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ChatSidebar({ conversations, activeId, onSelect }: ChatSidebarProps) {
  return (
    <div className="w-full md:w-96 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col h-full overflow-hidden">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white">Messages</h2>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
        {conversations.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto opacity-50">
                <Search size={24} className="text-slate-400" />
             </div>
             <p className="text-sm font-medium text-slate-500 leading-relaxed">No active conversations found.<br/>Start a project to begin chatting.</p>
          </div>
        ) : (
          conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={cn(
                "w-full p-4 rounded-2xl flex gap-4 text-left transition-all duration-300 group relative overflow-hidden",
                activeId === chat.id 
                  ? "bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/50 dark:ring-slate-700/50" 
                  : "hover:bg-white/80 dark:hover:bg-slate-800/40"
              )}
            >
              {activeId === chat.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-600 rounded-r-full" />
              )}
              
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0 shadow-inner flex items-center justify-center font-black text-slate-400">
                  {chat.otherUser?.name?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800 shadow-sm" />
              </div>

              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-black text-slate-950 dark:text-white truncate text-base tracking-tight">{chat.otherUser?.name || 'User'}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">2m ago</span>
                </div>
                <p className={cn(
                  "text-xs truncate font-medium",
                  activeId === chat.id ? "text-slate-600 dark:text-slate-300" : "text-slate-500"
                )}>
                  {chat.lastMessage || 'Start a conversation'}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
