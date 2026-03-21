"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Briefcase, ChevronRight } from 'lucide-react';
import { Button, cn } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  
  // Steps: 1 = Role Selection, 2 = Details
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'client' | 'freelancer' | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const resp = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await resp.json();
      
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to register');
      }
      
      // Success. The user is also created in Firebase.
      // Next step would be login or automatic sign-in
      router.push('/auth/login');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Freelance Hub
          </Link>
        </div>
        
        <Card className="shadow-lg border-0 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {step === 1 ? 'Join as a client or freelancer' : 'Sign up to find work you love'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 ? 'Please select how you want to use the platform' : 'Enter your details to create your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole('client')}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all hover:border-primary-500 bg-white dark:bg-slate-900",
                      role === 'client' 
                        ? "border-primary-600 ring-4 ring-primary-50/50 dark:ring-primary-900/20" 
                        : "border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <Briefcase className={cn("h-8 w-8 mb-4", role === 'client' ? "text-primary-600" : "text-slate-400")} />
                    <span className="font-semibold text-slate-900 dark:text-white">I'm a client, hiring for a project</span>
                  </button>
                  <button
                    onClick={() => setRole('freelancer')}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all hover:border-primary-500 bg-white dark:bg-slate-900",
                      role === 'freelancer' 
                        ? "border-primary-600 ring-4 ring-primary-50/50 dark:ring-primary-900/20" 
                        : "border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <User className={cn("h-8 w-8 mb-4", role === 'freelancer' ? "text-primary-600" : "text-slate-400")} />
                    <span className="font-semibold text-slate-900 dark:text-white">I'm a freelancer, looking for work</span>
                  </button>
                </div>
                <Button 
                  className="w-full" 
                  disabled={!role} 
                  onClick={() => setStep(2)}
                >
                  {role === 'client' ? 'Join as a Client' : role === 'freelancer' ? 'Apply as a Freelancer' : 'Create Account'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User size={18} />}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} />}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />}
                  required
                  helperText="Must be at least 6 characters."
                />
                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
                
                <div className="flex gap-4 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    Back
                  </Button>
                  <Button type="submit" className="w-2/3" isLoading={loading}>
                    Create Account
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center pt-0">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Log In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
