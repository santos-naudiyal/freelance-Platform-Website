"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg">
        <Link href="/auth/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <Card className="p-12 shadow-premium relative overflow-hidden border-0 ring-1 ring-slate-200/50 dark:ring-slate-800/50">
          {!isSubmitted ? (
            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="text-4xl font-display font-black tracking-tight text-slate-950 dark:text-white">Forgot Password?</h1>
                <p className="text-slate-500 font-medium leading-relaxed">No worries, we'll send you reset instructions. Enter the email associated with your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl"
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl font-black text-base shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
                  isLoading={isLoading}
                >
                  Reset Password
                </Button>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="h-20 w-20 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={40} />
               </div>
               <div className="space-y-3">
                  <h2 className="text-3xl font-display font-black text-slate-950 dark:text-white">Check your email</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">Instructions to reset your password have been sent to <span className="text-slate-950 dark:text-white font-bold">{email}</span>.</p>
               </div>
               <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl font-black text-base border-slate-200/50 dark:border-slate-800/50"
                  onClick={() => setIsSubmitted(false)}
               >
                  Try another email
               </Button>
            </div>
          )}
        </Card>
        
        <p className="text-center mt-12 text-sm font-medium text-slate-500">
          Suddenly remembered? <Link href="/auth/login" className="text-primary-600 font-black hover:underline underline-offset-4">Login here</Link>
        </p>
      </div>
    </div>
  );
}
