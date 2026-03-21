import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './Button';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Loader({ size = 'md', className }: LoaderProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div className={cn("flex justify-center items-center text-primary-500", className)}>
      <Loader2 className={cn("animate-spin", sizes[size])} />
    </div>
  );
}
