"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Info, MoreHorizontal, User, Paperclip, Smile, MessageSquare } from 'lucide-react';
import { Button, cn } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageBubble } from './MessageBubble';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  otherUser?: any;
}

export function ChatWindow({ chatId, currentUserId, otherUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'Messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      await addDoc(collection(db, 'Messages'), {
        chatId,
        senderId: currentUserId,
        text: newMessage,
        createdAt: Date.now(), // serverTimestamp() is better but this works for now
      });
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
         <div className="h-24 w-24 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <MessageSquare size={40} className="text-slate-300 dark:text-slate-700" />
         </div>
         <h3 className="text-2xl font-display font-black text-slate-950 dark:text-white mb-2">Select a Conversation</h3>
         <p className="text-sm font-medium text-slate-500">Choose a chat from the sidebar to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black">
                {otherUser?.name?.[0] || 'U'}
             </div>
             <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-950 dark:text-white leading-tight">{otherUser?.name || 'Messaging'}</h3>
            <div className="flex items-center gap-1.5">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-11 w-11 p-0 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Phone size={20} className="text-slate-400" />
          </Button>
          <Button variant="ghost" size="sm" className="h-11 w-11 p-0 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Video size={20} className="text-slate-400" />
          </Button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
          <Button variant="ghost" size="sm" className="h-11 w-11 p-0 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <MoreHorizontal size={20} className="text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.length === 0 ? (
           <div className="py-20 text-center space-y-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Beginning of conversation</p>
           </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              isMe={msg.senderId === currentUserId}
              timestamp={msg.createdAt}
            />
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <div className="p-8 bg-white dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 relative z-10">
        <form onSubmit={handleSend} className="flex items-end gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-1.5">
             <Button variant="ghost" size="md" className="h-12 w-12 p-0 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <Paperclip size={20} className="text-slate-400" />
             </Button>
             <Button variant="ghost" size="md" className="h-12 w-12 p-0 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <Smile size={20} className="text-slate-400" />
             </Button>
          </div>
          <div className="flex-1 relative group">
            <textarea
               rows={1}
               placeholder="Write your message..."
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSend(e as any);
                 }
               }}
               className="w-full min-h-[56px] py-4 px-8 rounded-[2.5rem] bg-slate-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-bold resize-none overflow-hidden placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!newMessage.trim()}
            className={cn(
               "h-14 w-14 rounded-2xl flex-shrink-0 shadow-xl transition-all active:scale-95",
               newMessage.trim() ? "bg-primary-600 shadow-primary-500/30" : "bg-slate-100 dark:bg-white/5 cursor-not-allowed text-slate-300 dark:text-slate-700 shadow-none border-0"
            )}
          >
            <Send size={22} className={cn(newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : "")} />
          </Button>
        </form>
      </div>
    </div>
  );
}
