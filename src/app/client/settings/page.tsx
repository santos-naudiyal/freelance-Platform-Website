"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings as SettingsIcon,
  Search,
  Bell,
  User,
  Building2,
  MapPin,
  Sparkles,
  Globe,
  Mail,
  CheckCircle2,
  Image as ImageIcon,
  Lock
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/useAuthStore';
import { auth } from '../../../lib/firebase';
import { callBackend } from '../../../lib/api';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Proposals', href: '/client/proposals', icon: Users },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: SettingsIcon },
];

export default function ClientSettingsPage() {
  const { user, setUser } = useAuthStore();
  
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCompanyName(user.companyName || '');
      setAddress(user.address || '');
      setIndustry(user.industry || '');
      setWebsite(user.website || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

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

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await callBackend('users/profile', 'PUT', {
        name,
        companyName,
        address,
        industry,
        website,
        avatar
      });

      setUser({ ...user!, ...data.data });
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Settings">
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-2 uppercase italic">
                Account <span className="text-primary-600">Settings</span>
              </h1>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                Manage your professional identity and workspace preferences.
              </p>
            </div>
            <Button 
              onClick={handleSave} 
              isLoading={isLoading} 
              className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-indigo-600 text-white border-none transform hover:scale-[1.02] active:scale-95 transition-all"
            >
              Save All Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal & Avatar */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl overflow-hidden rounded-[2.5rem] ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardContent className="pt-12 px-8 pb-10 flex flex-col items-center">
                  <div className="relative group mb-8">
                    <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-2xl transition-all duration-500 group-hover:scale-105">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <User size={48} />
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
                    <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-white uppercase">{name || 'Your Profile'}</h3>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">{user?.email}</p>
                    <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardHeader className="pt-8 px-8 border-b border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-200/20">
                      <Lock size={18} />
                    </div>
                    <CardTitle className="text-sm font-black tracking-widest uppercase">Security & Login</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password Status</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold tracking-tight">••••••••••••</span>
                      <Button variant="ghost" size="sm" className="h-8 text-primary-600 font-bold text-xs uppercase tracking-tight hover:bg-primary-50">Change</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Details Forms */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardHeader className="pt-10 px-8 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-sm border border-indigo-200/20">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tight uppercase italic">Business Identity</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Company details visible in your workspaces</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pb-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <Input 
                        label="Account Delegate Name" 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<User size={18} />}
                        className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                      />
                      <Input 
                        label="Registered Business Name" 
                        placeholder="e.g. Acme Innovations" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        icon={<Building2 size={18} />}
                        className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-6">
                      <Input 
                        label="Specialization / Industry" 
                        placeholder="e.g. Artificial Intelligence" 
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        icon={<Sparkles size={18} />}
                        className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                      />
                      <Input 
                        label="Official Website URL" 
                        placeholder="https://company.io" 
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        icon={<Globe size={18} />}
                        className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      label="HQ physical Address" 
                      placeholder="Street, City, Country" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      icon={<MapPin size={18} />}
                      className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-800/60 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold"
                    />
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global verified profile status: <span className="text-emerald-500">Active</span></p>
                    
                    <div className="flex gap-4">
                      {error && <p className="text-xs font-bold text-rose-500 animate-pulse">{error}</p>}
                      {success && <p className="text-xs font-bold text-emerald-500">{success}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <CardHeader className="pt-10 px-8 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-600 shadow-sm border border-primary-200/20">
                      <Bell size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tight uppercase italic">Smart Alerts</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Control your collaboration signal flow</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'Project Intel', desc: 'Real-time expert message updates' },
                      { title: 'Vault Sync', desc: 'Alerts on milestone approvals' },
                      { title: 'Board Updates', desc: 'Track task transitions' },
                      { title: 'Network wide', desc: 'System alerts and releases' }
                    ].map((item, i) => (
                      <div key={i} className="group p-5 rounded-[2rem] bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between hover:border-primary-500/30 transition-all cursor-pointer">
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 leading-tight pr-4">{item.desc}</p>
                        </div>
                        <div className="h-7 w-12 bg-primary-600 rounded-full relative shadow-lg shadow-primary-500/20 transition-all">
                          <div className="absolute right-1 top-1 h-5 w-5 bg-white rounded-full shadow-md" />
                        </div>
                      </div>
                    ))}
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
