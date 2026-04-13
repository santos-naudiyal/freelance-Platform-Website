import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2 shrink-0';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 border-b-2 border-primary-700 active:border-b-0 active:translate-y-[2px]',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border-b-2 border-slate-200 dark:border-slate-700 active:border-b-0 active:translate-y-[2px]',
      outline: 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 active:translate-y-[2px]',
      ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25 border-b-2 border-red-700 active:border-b-0 active:translate-y-[2px]',
    };
    
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-5 text-sm',
      lg: 'h-13 px-7 text-base rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = 'Button';
