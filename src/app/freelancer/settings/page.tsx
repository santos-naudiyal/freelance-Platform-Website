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

    const localUrl = URL.createObjectURL(file);
    setAvatar(localUrl);
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const data = await callBackend('users/avatar', 'POST', formData);
      setAvatar(data.url);
      setSuccess('Profile picture updated');
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
      if (name !== user?.name) {
        await callBackend('users/profile', 'PUT', { name, avatar });
      }

      setFreelancerDetails(profileData.data);
      setSuccess('All changes saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Settings">
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-2 uppercase italic">
                Expert <span className="text-primary-600">Profile</span>
              </h1>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                Customize your professional presence on FreelanceHub.
              </p>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              isLoading={isLoading} 
              className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-indigo-600 text-white border-none transform hover:scale-[1.02] active:scale-95 transition-all"
            >
              Save All Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal & Pricing */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl overflow-hidden rounded-[2.5rem] ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardContent className="pt-12 px-8 pb-10 flex flex-col items-center">
                  <div className="relative group mb-8">
                    <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-2xl transition-all duration-500 group-hover:scale-105">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <UserIcon size={48} />
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                          <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-white hover:bg-white/20 rounded-xl"
                        >
                          <ImageIcon size={20} />
                        </Button>
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-white uppercase">{name || 'Your Full Name'}</h3>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">{user?.email}</p>
                    <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-950/30 text-primary-600 rounded-full border border-primary-200/50">
                      <Sparkles size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{title || 'Specialist'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardHeader className="pt-8 px-8 border-b border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-200/20">
                        <DollarSign size={18} />
                      </div>
                      <CardTitle className="text-sm font-black tracking-widest uppercase">Pricing</CardTitle>
                    </div>
                    <span className="text-xl font-black text-slate-950 dark:text-white">₹{hourlyRate}<span className="text-xs text-slate-400 font-bold">/hr</span></span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjust Hourly Rate</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="5" 
                        max="200" 
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                        className="flex-1 accent-primary-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Earning Potential</p>
                    <p className="text-xs font-medium text-slate-500">Your rate is within the top 20% for your specialization.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                 <CardHeader className="pt-8 px-8 border-b border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-200/20">
                      <Lock size={18} />
                    </div>
                    <CardTitle className="text-sm font-black tracking-widest uppercase">Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <Button variant="outline" className="w-full rounded-xl h-12 font-black text-[10px] uppercase tracking-widest border-slate-200/60 dark:border-slate-700">
                    Reset Account Password
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Professional Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardHeader className="pt-10 px-8 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-600 shadow-sm border border-primary-200/20">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tight uppercase italic">Professional Identity</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Manage your skills and public biography</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pb-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="Public Display Name" 
                      placeholder="e.g. Sarah Jenkins" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={<UserIcon size={18} />}
                      className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                    />
                    <Input 
                      label="Professional Headline" 
                      placeholder="e.g. Senior Full Stack Engineer" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      icon={<Sparkles size={18} />}
                      className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialist Skills (Type & Enter)</label>
                    <div className="relative group">
                       <Input
                        placeholder="Add skill..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                        className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 pl-12 font-bold text-sm"
                      />
                      <PenTool size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                       {skills.map((skill) => (
                        <Badge key={skill} className="gap-2 px-4 py-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary-500/50 transition-all duration-300">
                          <span className="font-black text-[10px] uppercase tracking-widest">{skill}</span>
                          <button type="button" onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={14} strokeWidth={3} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">About Your Expertise</label>
                    <textarea
                      className="flex min-h-[160px] w-full rounded-[2rem] border border-slate-200/60 bg-white/50 backdrop-blur-sm px-6 py-4 text-sm text-slate-950 shadow-sm transition-all duration-500 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-100 font-bold leading-relaxed"
                      placeholder="Describe your expertise and impact..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardHeader className="pt-10 px-8 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-sm border border-indigo-200/20">
                      <Globe size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tight uppercase italic">Professional Proofs</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Links to your work and contributions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pb-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="GitHub Repository Link" 
                      placeholder="github.com/username" 
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      icon={<Github size={18} />}
                      className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                    />
                    <Input 
                      label="Portfolio / Site URL" 
                      placeholder="https://mywork.com" 
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      icon={<Layout size={18} />}
                      className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global expert ranking: <span className="text-primary-600">Level 4 Elite</span></p>
                    
                    <div className="flex gap-4">
                      {error && <p className="text-xs font-bold text-rose-500 animate-pulse">{error}</p>}
                      {success && <p className="text-xs font-bold text-emerald-500">{success}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
