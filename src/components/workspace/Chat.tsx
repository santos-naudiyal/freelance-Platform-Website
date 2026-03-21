"use client";

import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  Smile, 
  Sparkles,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { useAI } from '@/hooks/useAI';

interface ChatProps {
  workspaceId: string;
}

export function Chat({ workspaceId }: ChatProps) {
  const { user } = useAuthStore();
  const { messages, loading, sendMessage } = useChat(workspaceId);
  const { askCopilot, loading: aiLoading } = useAI();
  const [inputValue, setInputValue] = useState('');

  const handleSend = async () => {
    if (!inputValue.trim() || !user) return;
    
    const messageText = inputValue;
    setInputValue('');
    
    try {
      // Always send the user's message first
      await sendMessage(messageText, user.id, user.name, 'user');

      // If it starts with @ai, trigger the co-pilot
      if (messageText.trim().toLowerCase().startsWith('@ai')) {
        const prompt = messageText.replace(/^@ai\s*/i, '').trim() || 'Hello';
        
        // Pass the recent messages as context
        const contextMessages = messages.slice(-5).map(m => ({
           role: m.type === 'ai' ? 'model' : 'user',
           content: m.text
        }));

        const aiResponse = await askCopilot(
          prompt,
          JSON.stringify(contextMessages)
        );

        if (aiResponse) {
           await sendMessage(aiResponse, 'ai_copilot_service', 'Freelace AI Co-Pilot', 'ai');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const formatMessageTime = (createdAt: any) => {
    if (!createdAt) return 'Just now';
    if (typeof createdAt === 'number') return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (createdAt && 'seconds' in createdAt) return new Date(createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return 'Just now';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-100" />
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-100" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Workspace Group</div>
            <div className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sarah, Marcus are online
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-primary-600 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <Phone size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-primary-600 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <Video size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-primary-600 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 font-medium animate-pulse">
            Establishing Secure Sync...
          </div>
        ) : (
          <>
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col",
              msg.senderId === user?.id ? "items-end" : "items-start"
            )}>
              {msg.type === 'ai' ? (
                <div className="max-w-[80%] w-full bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-950/20 dark:to-indigo-950/20 border border-primary-100 dark:border-primary-900 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-primary-600 text-white">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-primary-600">Freelace AI Co-Pilot</span>
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic whitespace-pre-wrap">{msg.text}</div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    {msg.senderId !== user?.id && <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{msg.senderName}</span>}
                    <span className="text-[9px] font-medium text-slate-400">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                  <div className={cn(
                    "max-w-[75%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all hover:shadow-md whitespace-pre-wrap",
                    msg.senderId === user?.id
                      ? "bg-primary-600 text-white rounded-tr-none" 
                      : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </>
              )}
            </div>
          ))}
          {aiLoading && (
            <div className="flex flex-col items-start">
              <div className="max-w-[80%] w-fit bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-950/20 dark:to-indigo-950/20 border border-primary-100 dark:border-primary-900 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-primary-600 text-white">
                      <Sparkles size={14} className="animate-spin" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-primary-600">Freelace AI Co-Pilot is thinking...</span>
                  </div>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-0">
        <div className="premium-glass p-2 rounded-[1.8rem] flex items-center shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1 px-2">
            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-colors">
              <Paperclip size={20} />
            </button>
            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-colors">
              <ImageIcon size={20} />
            </button>
          </div>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message or start with @ai to ask co-pilot..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium px-4"
            disabled={aiLoading}
          />

          <div className="flex items-center gap-1 px-2">
            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-colors">
              <Mic size={20} />
            </button>
            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-colors">
              <Smile size={20} />
            </button>
            <button 
              onClick={handleSend}
              disabled={aiLoading || !inputValue.trim()}
              className="h-11 w-11 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
