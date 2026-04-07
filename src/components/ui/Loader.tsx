import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
}

export function Loader({ size = 'md', className, withText = false }: LoaderProps) {
  const sizes = {
    sm: 'h-6 w-6 p-1',
    md: 'h-10 w-10 p-2',
    lg: 'h-16 w-16 p-3',
    xl: 'h-24 w-24 p-4',
  };

  return (
    <div className={cn("flex flex-col justify-center items-center gap-4", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 shadow-xl shadow-primary-500/20 logo-spinner",
        sizes[size]
      )}>
        <LayoutDashboard className="text-white h-full w-full" />
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse" />
      </div>
      {withText && (
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 animate-pulse">
          Architecting Workspace...
        </p>
      )}
    </div>
  );
}
