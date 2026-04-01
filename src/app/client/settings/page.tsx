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
  Image as ImageIcon
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

      // Update local store
      setUser({ ...user!, ...data.data });
      setSuccess('Profile updated successfully!');
      
      // Auto hide success message
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Account Settings">
        <div className="max-w-4xl space-y-8 pb-20">
          <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none dark:ring-1 dark:ring-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="pt-10 px-8">
              <div className="flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <User size={24} className="text-white" />
                 </div>
                 <div>
                    <CardTitle className="text-2xl font-black italic tracking-tight">Business Profile</CardTitle>
                    <CardDescription className="text-sm font-medium">Update your company and personal details to build trust</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-10">
              <div className="flex flex-col md:flex-row items-center gap-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="h-24 w-24 rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-xl transition-transform group-hover:scale-105 duration-500">
                    {avatar ? (
                      <img src={avatar} alt="Avatar Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <User size={32} />
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
                
                <div className="space-y-1 text-center md:text-left flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Company Identity Logo</h4>
                  <p className="text-xs text-slate-500 font-medium max-w-xs">Upload a high-quality logo or photo. Supports JPG, PNG (Max 5MB).</p>
                  <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
                    >
                      Choose Image
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Full Name" 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User size={18} />}
                  className="rounded-2xl"
                />
                <Input 
                  label="Contact Email" 
                  value={user?.email || ''} 
                  disabled 
                  icon={<Mail size={18} />}
                  className="rounded-2xl opacity-60"
                  helperText="Email cannot be changed."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Input 
                  label="Company Name" 
                  placeholder="e.g. Acme Tech" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  icon={<Building2 size={18} />}
                  className="rounded-2xl"
                />
                <Input 
                  label="Industry" 
                  placeholder="e.g. SaaS, Fintech" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  icon={<Sparkles size={18} />}
                  className="rounded-2xl"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 pt-4">
                 <Input 
                  label="Business Address" 
                  placeholder="123 Business St, City, Country" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  icon={<MapPin size={18} />}
                  className="rounded-2xl"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 pt-4">
                <Input 
                  label="Website URL" 
                  placeholder="https://acme.com" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  icon={<Globe size={18} />}
                  className="rounded-2xl"
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

              <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                 <Button 
                  onClick={handleSave} 
                  isLoading={isLoading} 
                  className="rounded-[1.25rem] px-12 h-14 font-black shadow-xl shadow-primary-500/20"
                >
                  Save Business Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none dark:ring-1 dark:ring-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="pt-10 px-8">
              <div className="flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Bell size={24} className="text-white" />
                 </div>
                 <div>
                    <CardTitle className="text-2xl font-black italic tracking-tight">Notification Settings</CardTitle>
                    <CardDescription className="text-sm font-medium">Configure how you receive project and payment updates</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-8 pb-10">
               <p className="text-sm text-slate-500 font-medium italic">Advanced notification preferences coming soon with email & push integration.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
