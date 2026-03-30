"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  MessageSquare, 
  User as UserIcon,
  X, 
  Sparkles, 
  DollarSign, 
  PenTool, 
  Github, 
  Layout, 
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Lock,
  Globe
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/useAuthStore';
import { auth } from '../../../lib/firebase';
import { Badge } from '../../../components/ui/Badge';
import { callBackend } from '../../../lib/api';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: UserIcon },
];

export default function FreelancerSettingsPage() {
  const router = useRouter();
  const { user, freelancerDetails, setFreelancerDetails } = useAuthStore();
  
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(20);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
    
    if (freelancerDetails) {
      const profile = freelancerDetails.profile || freelancerDetails;
      const links = profile.portfolioLinks || (freelancerDetails as any).portfolioLinks || [];
      
      setTitle(profile.title || '');
      setBio(profile.bio || '');
      setHourlyRate(profile.hourlyRate || 20);
      setSkills(profile.skills || []);
      setGithubUrl(profile.githubUrl || '');
      setPortfolioLink(links[0] || '');
      setAvatar(profile.avatar || user?.avatar || '');
    }
  }, [freelancerDetails, user]);

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setAvatar(localUrl);

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const data = await callBackend('users/avatar', 'POST', formData);

      setAvatar(data.url);
      setSuccess('Profile picture uploaded!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        title,
        bio,
        skills,
        hourlyRate,
        availability: 'available',
        githubUrl,
        portfolioLinks: portfolioLink ? [portfolioLink] : [],
        avatar
      };
      
      const profileData = await callBackend('freelancers/profile', 'PUT', payload);

      // 2. Update User Base Info (Name)
      if (name !== user?.name) {
        await callBackend('users/profile', 'PUT', { name, avatar });
      }

      setFreelancerDetails(profileData.data);
      setSuccess('All changes saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Account Settings">
        <div className="max-w-4xl space-y-8 pb-20">
          
          {/* Main Profile & Identity */}
          <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none dark:ring-1 dark:ring-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="pt-10 px-8">
              <div className="flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <UserIcon size={24} className="text-white" />
                 </div>
                 <div>
                    <CardTitle className="text-2xl font-black italic tracking-tight leading-none mb-1">Professional Identity</CardTitle>
                    <CardDescription className="text-sm font-medium">Manage your public presence and professional proofs</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <form onSubmit={handleSaveProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Display Name" 
                    placeholder="Your Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<UserIcon size={18} />}
                    className="rounded-2xl"
                    required
                  />
                  <Input 
                    label="Professional Title" 
                    placeholder="e.g. Senior Full Stack Developer" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    icon={<Sparkles size={18} />}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <Input 
                    label="Hourly Rate ($)" 
                    type="number"
                    min="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    icon={<DollarSign size={18} />}
                    className="rounded-2xl"
                    required
                  />
                  <Input 
                    label="GitHub Profile URL" 
                    placeholder="github.com/user" 
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    icon={<Github size={18} />}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 py-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="h-24 w-24 rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-xl transition-transform group-hover:scale-105 duration-500">
                      {avatar ? (
                        <img src={avatar} alt="Avatar Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <UserIcon size={32} />
                        </div>
                      )}
                      
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ImageIcon size={20} className="text-white" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  
                  <div className="space-y-2 text-center md:text-left flex-1">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Profile Photograph</h4>
                    <p className="text-xs text-slate-500 font-medium max-w-xs">Upload a professional photo to build trust with clients. Supports JPG, PNG (Max 5MB).</p>
                    <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
                      >
                        Choose New File
                      </Button>
                      {avatar && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setAvatar('')}
                          className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-2">
                  <Input 
                    label="Portfolio / Website URL" 
                    placeholder="https://mywork.com" 
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    icon={<Globe size={18} />}
                    className="rounded-2xl"
                  />
                </div>

                <div className="space-y-4 pt-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Specialist Skills (Press Enter)</label>
                   <div className="relative group">
                    <Input
                      placeholder="e.g. React, Node.js, Next.js"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 pl-12 font-medium"
                    />
                    <PenTool size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} className="gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-primary-500/50 transition-all duration-300">
                        <span className="font-bold text-xs">{skill}</span>
                        <button type="button" onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <X size={14} strokeWidth={3} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Biography</label>
                  <textarea
                    className="flex min-h-[160px] w-full rounded-[1.5rem] border border-slate-200/60 bg-white px-6 py-4 text-sm text-slate-950 shadow-sm transition-all duration-500 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-100 font-medium leading-relaxed"
                    placeholder="Describe your expertise..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 rounded-xl bg-green-50 text-green-600 text-xs font-bold border border-green-100 animate-in fade-in slide-in-from-top-1">
                    {success}
                  </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 font-bold max-w-[300px]">Update your professional details to attract elite clients.</p>
                  <Button type="submit" isLoading={isLoading} className="h-14 px-12 rounded-[1.25rem] font-black shadow-xl shadow-primary-500/20">
                    Save All Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Section (Placeholder) */}
          <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none dark:ring-1 dark:ring-slate-800 rounded-[2rem] overflow-hidden opacity-80">
            <CardHeader className="pt-10 px-8">
              <div className="flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
                    <Lock size={24} className="text-white" />
                 </div>
                 <div>
                    <CardTitle className="text-2xl font-black italic tracking-tight leading-none mb-1">Security & Access</CardTitle>
                    <CardDescription className="text-sm font-medium">Manage your password and account security</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-10">
               <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">Account Password</p>
                    <p className="text-xs text-slate-500 mt-1">Last changed: Never</p>
                  </div>
                  <Button variant="outline" className="rounded-xl px-6 h-11 font-bold border-slate-200">Reset Password</Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
