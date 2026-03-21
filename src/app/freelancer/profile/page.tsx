"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { useAuthStore } from '../../../store/useAuthStore';
import { auth } from '../../../lib/firebase';
import { Badge } from '../../../components/ui/Badge';
import { X, Sparkles, User as UserIcon, DollarSign, PenTool } from 'lucide-react';

export default function FreelancerProfilePage() {
  const router = useRouter();
  const { user, freelancerDetails, setFreelancerDetails } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(20);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (freelancerDetails) {
      setTitle(freelancerDetails.title || '');
      setBio(freelancerDetails.bio || '');
      setHourlyRate(freelancerDetails.hourlyRate || 20);
      setSkills(freelancerDetails.skills || []);
    }
  }, [freelancerDetails]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Not authenticated');
      
      const token = await firebaseUser.getIdToken();
      
      const resp = await fetch('http://localhost:5000/api/freelancers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          bio,
          skills,
          hourlyRate,
          availability: 'available'
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to update profile');

      setFreelancerDetails(data.data);
      router.push('/freelancer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6 sm:px-10 lg:px-12 selection:bg-primary-100 dark:selection:bg-primary-900/40">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800/50">
               <Sparkles size={14} />
               Onboarding
             </div>
             <h1 className="text-5xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
               Complete Your <span className="text-primary-600">Professional Profile</span>
             </h1>
             <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
               Showcase your expertise and stand out to top-tier clients worldwide. Your journey to elite work starts here.
             </p>
          </div>
          
          <Card className="p-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-lg shadow-slate-900/10">
                   <UserIcon size={24} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Professional Details</CardTitle>
                  <CardDescription className="text-base font-medium">This information will be visible to potential clients</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <Input
                        label="Professional Title"
                        placeholder="e.g. Senior Full Stack Developer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-14 rounded-2xl border-slate-200/50 dark:border-slate-800/50"
                        required
                      />
                      
                      <Input
                        label="Hourly Rate ($)"
                        type="number"
                        min="5"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                        className="h-14 rounded-2xl border-slate-200/50 dark:border-slate-800/50"
                        icon={<DollarSign size={18} className="text-slate-400" />}
                        required
                      />
                   </div>

                   <div className="space-y-3 pt-1.5">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                        Skills (Press Enter)
                      </label>
                      <div className="relative group">
                        <Input
                          placeholder="e.g. React, Node.js, Next.js"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={addSkill}
                          className="h-14 rounded-2xl border-slate-200/50 dark:border-slate-800/50 pl-12"
                        />
                        <PenTool size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {skills.length === 0 && <p className="text-xs text-slate-400 italic">No skills added yet...</p>}
                        {skills.map((skill) => (
                          <Badge key={skill} className="gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:border-primary-500/50 transition-all duration-300">
                            <span className="font-bold">{skill}</span>
                            <button type="button" onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <X size={14} strokeWidth={3} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                   </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                    Bio / Overview
                  </label>
                  <textarea
                    className="flex min-h-[220px] w-full rounded-3xl border border-slate-200/50 bg-white px-6 py-5 text-base text-slate-950 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 dark:border-slate-800/50 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Describe your experience, skills, and what makes you a great freelancer. Focus on the value you provide to your clients."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                  <p className="text-xs text-slate-400 font-medium">Tip: Be descriptive and mention specific technologies you master.</p>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold border border-red-100 dark:border-red-800/50 animate-bounce">
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-6">
                  <Button type="submit" isLoading={isLoading} className="h-16 px-16 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all">
                    Launch Your Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
