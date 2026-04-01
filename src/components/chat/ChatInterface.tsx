"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  User,
  Check,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { callBackend } from '@/lib/api';
import { cn } from '@/lib/utils';
import { io, Socket } from 'socket.io-client';

interface Message {
  id?: string;
  projectId: string;
  senderId: string;
  senderName: string;
  text: string;
  type: 'user' | 'ai';
  createdAt: number;
}

interface ChatInterfaceProps {
  projectId: string;
  recipientName: string;
  className?: string;
}

export function ChatInterface({ projectId, recipientName, className }: ChatInterfaceProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.io
  useEffect(() => {
    if (!projectId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;

    socket.emit('join-project-chat', projectId);

    socket.on('new-message', (message: Message) => {
      setMessages(prev => {
        // Prevent duplicates
        if (prev.find(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await callBackend(`chat/${projectId}`);
        setMessages(data || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [projectId]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user || isSending) return;

    setIsSending(true);
    try {
      const newMessage = await callBackend('chat/send', 'POST', {
          projectId,
          text: inputText,
          type: 'user'
      });

      // Optimistically add to UI immediately instead of waiting solely for Socket roundtrip
      if (newMessage && newMessage.id) {
        setMessages(prev => {
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }

      setInputText('');
    } catch (err) {
      console.error("Send Error:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-400">
        <Loader2 className="animate-spin" size={32} />
        <p className="text-sm font-medium">Securing connection...</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl", className)}>
      
      {/* CHAT HEADER */}
      <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 border border-primary-100 dark:border-primary-800">
            <User size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">{recipientName}</h4>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0">
          <MoreVertical size={20} />
        </Button>
      </div>

      {/* MESSAGES AREA */}
      <div 
        ref={scrollRef}
        className="flex-grow p-8 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isMe = msg.senderId === user?.id;
            
            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex group",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[75%] space-y-1",
                  isMe ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-5 py-3.5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm",
                    isMe 
                      ? "bg-primary-600 text-white rounded-tr-none" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-2 px-1",
                    isMe ? "justify-end" : "justify-start"
                  )}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <CheckCheck size={12} className="text-primary-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 bg-white dark:bg-slate-950 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg"
        >
          <Button type="button" variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-primary-500 transition-colors">
            <Paperclip size={20} />
          </Button>
          
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
          />

          <Button 
            type="submit" 
            disabled={!inputText.trim() || isSending}
            className={cn(
              "h-10 w-10 rounded-xl bg-primary-600 text-white shadow-lg transition-all",
              inputText.trim() ? "translate-x-0 opacity-100" : "translate-x-2 opacity-50 grayscale"
            )}
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
