import React from 'react';
import { cn } from './Button';

interface SkeletonProps {
  className?: string; 
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "skeleton-shimmer",
        variant === 'circular' && "rounded-full",
        variant === 'text' && "h-4 rounded-md w-3/4",
        className
      )}
    />
  );
}
