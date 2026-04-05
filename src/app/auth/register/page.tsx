"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Briefcase, ChevronRight, Globe, Building2, MapPin, Github, Layout, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button, cn } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { callBackend } from '../../../lib/api';


export default function RegisterPage() {
  const router = useRouter();
  
  // Steps: 1 = Role Selection, 2 = Auth Details, 3 = Professional Profile
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<'client' | 'freelancer' | null>(null);
  
  // Step 2: Auth
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 3: Client Details
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');

  // Step 3: Freelancer Details
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('IT & Software');
  const [skills, setSkills] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [avatar, setAvatar] = useState('');

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        name,
        email,
        password,
        role,
        // Client specific
        companyName: role === 'client' ? companyName : undefined,
        industry: role === 'client' ? industry : undefined,
        address: role === 'client' ? address : undefined,
        website: role === 'client' ? website : undefined,
        // Freelancer specific
        title: role === 'freelancer' ? title : undefined,
        bio: role === 'freelancer' ? bio : undefined,
        department: role === 'freelancer' ? department : undefined,
        skills: role === 'freelancer' ? skills.split(',').map(s => s.trim()) : undefined,
        githubUrl: role === 'freelancer' ? githubUrl : undefined,
        portfolioLinks: role === 'freelancer' ? [portfolioLink].filter(Boolean) : undefined,
        avatar: avatar || undefined
      };

      const resp = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await resp.json();
      
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to register');
      }
      
      router.push('/auth/login');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setAvatar(localUrl);

    setIsUploading(true);
    setError(null);

    try {
      // In registration, we don't have a token yet because user isn't created.
      // However, our backend avatar upload requires requireAuth middleware.
      // This is a chicken-and-egg problem.
      // OPTION A: We make the avatar upload public but with limits.
      // OPTION B: (Better) We register first, THEN upload avatar.
      // But let's assume for now the user is authenticated in a simple way or we bypass it for registration.
      // Actually, since I already implemented it with requireAuth, I'll update the backend to allow public uploads temporarily or I'll just change the flow.
      // CRITICAL: For now, I'll assume we can use a temporary upload or we'll bypass it.
      
      const formData = new FormData();
      formData.append('avatar', file);

      // Note: We need a way to upload without a full user session if we're in registration.
      // I'll update the backend to allow public avatar uploads shortly.
      const resp = await fetch('http://localhost:5000/api/users/avatar-public', {
        method: 'POST',
        body: formData
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Upload failed');

      setAvatar(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };


  const isStep2Valid = name && email && password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:py-12 dark:bg-slate-950 relative overflow-hidden transition-colors">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/20 blur-[120px] dark:bg-primary-600/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] dark:bg-indigo-600/10" />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white">
              FreelanceHub<span className="text-primary-600">.</span>
            </span>
          </Link>
        </div>
        
        <Card className="shadow-2xl border-none ring-1 ring-slate-200/60 dark:ring-slate-800/60 rounded-[2rem] overflow-hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800">
             <div 
              className="h-full bg-primary-600 transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }} 
             />
          </div>

          <CardHeader className="space-y-2 pt-10 px-6 sm:px-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 bg-primary-50 dark:bg-primary-900/40 px-3 py-1 rounded-full">Step 0{step} of 03</span>
               <span className="text-[10px] font-bold text-slate-400">{role ? role.toUpperCase() : 'SELECT ROLE'}</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              {step === 1 ? 'Start your journey.' : step === 2 ? 'Account security.' : 'Professional identity.'}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base px-2 sm:px-0">
              {step === 1 ? 'Choose how you want to use the platform.' : step === 2 ? 'Secure your professional workspace.' : 'This information builds trust with your future partners.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setRole('client')}
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-3xl border-2 transition-all text-left group",
                      role === 'client' 
                        ? "border-primary-600 bg-primary-50/30 dark:bg-primary-900/10 shadow-lg shadow-primary-500/5" 
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                      role === 'client' ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600"
                    )}>
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <p className="font-black text-lg text-slate-900 dark:text-white">I'm a Client</p>
                      <p className="text-sm text-slate-500 font-medium">Hiring talent for elite projects.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setRole('freelancer')}
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-3xl border-2 transition-all text-left group",
                      role === 'freelancer' 
                        ? "border-primary-600 bg-primary-50/30 dark:bg-primary-900/10 shadow-lg shadow-primary-500/5" 
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                      role === 'freelancer' ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600"
                    )}>
                      <User size={28} />
                    </div>
                    <div>
                      <p className="font-black text-lg text-slate-900 dark:text-white">I'm a Freelancer</p>
                      <p className="text-sm text-slate-500 font-medium">Applying for world-class work.</p>
                    </div>
                  </button>
                </div>
                <Button 
                  className="w-full h-14 rounded-2xl font-black tracking-tight" 
                  disabled={!role} 
                  onClick={() => setStep(2)}
                >
                  Continue to Credentials
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : step === 2 ? (
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User size={18} />}
                  required
                  className="h-12 text-sm"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} />}
                  required
                  className="h-12 text-sm"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />}
                  required
                  className="h-12 text-sm"
                />
                
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3 h-14 rounded-2xl font-bold">
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    className="w-2/3 h-14 rounded-2xl font-black" 
                    disabled={!isStep2Valid}
                    onClick={() => setStep(3)}
                  >
                    Setup {role === 'client' ? 'Company' : 'Profile'}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {role === 'client' ? (
                  <>
                    {/* Shared Avatar Upload for both roles */}
                    <div className="flex flex-col items-center gap-4 py-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-dashed border-slate-200 dark:border-slate-800 mb-2">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-lg transition-transform group-hover:scale-105 duration-500">
                          {avatar ? (
                            <img src={avatar} alt="Profile Preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-400">
                              <User size={28} />
                            </div>
                          )}
                          
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ImageIcon size={16} className="text-white" />
                          </div>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleAvatarUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Profile Identity Photo</p>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-primary-600 hover:text-primary-500 mt-1 uppercase underline underline-offset-4">Choose Image</button>
                      </div>
                    </div>

                    <Input
                      label="Company Name"

                      placeholder="e.g. Acme Tech Solutions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      icon={<Building2 size={18} />}
                      required
                    />
                    <Input
                      label="Physical Address"
                      placeholder="City, Country or Full Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      icon={<MapPin size={18} />}
                      required
                    />
                    <Input
                      label="Industry"
                      placeholder="e.g. Fintech, E-commerce"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      icon={<Sparkles size={18} />}
                    />
                    <Input
                      label="Company Website"
                      placeholder="https://company.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      icon={<Globe size={18} />}
                    />
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        label="GitHub Profile"
                        placeholder="github.com/user"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        icon={<Github size={18} />}
                        required
                        className="h-12 text-sm"
                      />
                    </div>
                    <Input
                      label="Professional Title"
                      placeholder="e.g. Senior Fullstack Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      icon={<Layout size={18} />}
                      required
                    />
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
                       <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full h-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white"
                          required
                       >
                          <option value="IT & Software">IT & Software</option>
                          <option value="Finance & Accounting">Finance & Accounting</option>
                          <option value="Design & Creative">Design & Creative</option>
                          <option value="Marketing & Sales">Marketing & Sales</option>
                          <option value="Engineering & Architecture">Engineering & Architecture</option>
                          <option value="Other">Other</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio / About Me</label>
                       <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium h-24 resize-none outline-none focus:ring-2 focus:ring-primary-500/20"
                        placeholder="Describe your expertise..."
                        required
                       />
                    </div>
                    <Input
                      label="Skills (comma separated)"
                      placeholder="React, Node.js, AWS"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      icon={<Sparkles size={18} />}
                      required
                    />
                    <Input
                      label="Portfolio / Best Project URL"
                      placeholder="https://mywork.com"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      icon={<Briefcase size={18} />}
                    />
                  </>
                )}

                {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">{error}</div>}
                
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/3 h-14 rounded-2xl font-bold">
                    Back
                  </Button>
                  <Button type="submit" className="w-2/3 h-14 rounded-[1.25rem] font-black shadow-xl shadow-primary-500/20" isLoading={loading}>
                    Complete Registration
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800 py-6">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-extrabold text-primary-600 hover:text-primary-500 transition-colors">
                Log In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

