"use client";

import React from 'react';
import { ShieldCheck, Lock, UserCheck, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeType = 'verified' | 'identity' | 'escrow' | 'elite' | 'titanium';

interface TrustBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const badgeConfigs: Record<BadgeType, { icon: any, text: string, color: string, bg: string }> = {
  verified: { 
    icon: ShieldCheck, 
    text: 'Verified Expert', 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' 
  },
  identity: { 
    icon: UserCheck, 
    text: 'ID Verified', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' 
  },
  escrow: { 
    icon: Lock, 
    text: 'Escrow Protected', 
    color: 'text-amber-500', 
    bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' 
  },
  elite: { 
    icon: Star, 
    text: 'Elite 1%', 
    color: 'text-primary-500', 
    bg: 'bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30' 
  },
  titanium: { 
    icon: Zap, 
    text: 'Titanium Architect', 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30' 
  },
};

export function TrustBadge({ type, size = 'md', className, showText = true }: TrustBadgeProps) {
  const config = badgeConfigs[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[8px] gap-1',
    md: 'px-3 py-1 text-[9px] gap-1.5',
    lg: 'px-4 py-2 text-[10px] gap-2',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border font-black uppercase tracking-[0.1em] transition-all",
      config.bg,
      config.color,
      sizeClasses[size],
      className
    )}>
      <Icon size={iconSizes[size]} fill="currentColor" className="opacity-80" />
      {showText && <span>{config.text}</span>}
    </div>
  );
}
