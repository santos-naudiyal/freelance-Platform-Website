"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { useAuthStore } from '../../../store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setUser = useAuthStore(state => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Firebase auth listener in layout usually handles global state, but we can optimistically set some state
      
      // Fetch the user profile from our Node backend to get the role
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
      
      // Fallback
      router.push('/freelancers/discover');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Freelance Hub
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />
              {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
              
              <Button type="submit" className="w-full" isLoading={loading}>
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Sign up
              </Link>
            </div>
            <div className="text-center text-sm text-slate-500">
              <Link href="/auth/forgot-password" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
                Forgot password?
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
