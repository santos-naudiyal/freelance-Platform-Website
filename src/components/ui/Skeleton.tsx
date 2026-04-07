import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string; 
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "skeleton-shimmer border border-slate-100/50 dark:border-slate-800/50",
        variant === 'circular' && "rounded-full",
        variant === 'text' && "h-4 rounded-md w-3/4",
        variant === 'rectangular' && "rounded-[1.5rem]",
        className
      )}
    />
  );
}
