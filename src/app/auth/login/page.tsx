"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { useAuthStore } from '../../../store/useAuthStore';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { clearTokenCache } = await import('../../../lib/api');
      clearTokenCache();

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      try {
        const resp = await fetch('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (resp.ok) {
          const profile = await resp.json();
          if (profile.role === 'client') {
            router.push('/client/dashboard');
            return;
          } else if (profile.role === 'freelancer') {
            router.push('/freelancer/dashboard');
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile for routing", err);
      }
      
      router.push('/freelancers/discover');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:py-12 dark:bg-slate-950 relative overflow-hidden transition-colors">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/20 blur-[120px] dark:bg-primary-600/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] dark:bg-indigo-600/10" />
      </div>

      <div className="w-full max-w-md relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white">
              Freelace<span className="text-primary-600">.</span>
            </span>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-2 sm:p-4 ring-1 ring-slate-200/50 dark:ring-slate-800/50">
            <CardHeader className="space-y-2 pt-8 text-center">
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Welcome back</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
                Enter your credentials to access your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} />}
                  required
                  className="h-12 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-2xl"
                />
                <div className="space-y-1">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock size={18} />}
                    required
                    className="h-12 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-2xl"
                  />
                    <Link href="/auth/forgot-password" className="text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
                      Forgot password?
                    </Link>
                </div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50"
                  >
                    {error}
                  </motion.div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl font-black text-lg bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-all" 
                  isLoading={loading}
                >
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight size={20} />
                  </span>
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 pb-10 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 mx-6 px-0">
              <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                Don&apos;t have an account yet?{' '}
                <Link href="/auth/register" className="font-black text-primary-600 hover:text-primary-500 transition-colors underline decoration-primary-200 underline-offset-4">
                  Join the platform
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
