import React from 'react';
import { cn } from '../ui/Button';

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
  timestamp: number;
}

export function MessageBubble({ text, isMe, timestamp }: MessageBubbleProps) {
  return (
    <div className={cn("flex flex-col mb-4", isMe ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm",
          isMe
            ? "bg-primary-600 text-white rounded-tr-none"
            : "bg-white text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 rounded-tl-none"
        )}
      >
        {text}
      </div>
      <span className="text-[10px] text-slate-400 mt-1 px-1">
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
