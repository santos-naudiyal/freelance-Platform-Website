"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Settings,
  Send,
  X
} from 'lucide-react';
import { auth } from '../../../lib/firebase';
import { Badge } from '../../../components/ui/Badge';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/client/post-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function PostProjectPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState<number>(500);
  const [budgetMax, setBudgetMax] = useState<number>(1000);
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skillsRequired.includes(skillInput.trim())) {
        setSkillsRequired([...skillsRequired, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsRequired(skillsRequired.filter(s => s !== skillToRemove));
  };

  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Not authenticated');
      
      const token = await firebaseUser.getIdToken();
      
      const resp = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          budget: {
            min: budgetMin,
            max: budgetMax,
            type: budgetType
          },
          skillsRequired,
          deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days default
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to post project');

      router.push('/client/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Post a New Project">
        <div className="max-w-4xl mx-auto py-4">
          <Card className="border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Explain what you need done and clearly define the scope</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostProject} className="space-y-8">
                <div className="space-y-6">
                  <Input
                    label="Project Title"
                    placeholder="e.g. Build a modern landing page for a SaaS startup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Project Description
                    </label>
                    <textarea
                      className="flex min-h-[200px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Be specific about requirements, goals, and deliverables..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Budget Range ($)</label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(parseInt(e.target.value))}
                          required
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(parseInt(e.target.value))}
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setBudgetType('fixed')}
                          className={cn("flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all", budgetType === 'fixed' ? "border-primary-600 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-500")}
                        >
                          Fixed Price
                        </button>
                        <button
                          type="button"
                          onClick={() => setBudgetType('hourly')}
                          className={cn("flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all", budgetType === 'hourly' ? "border-primary-600 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-500")}
                        >
                          Hourly Rate
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Required Skills (Press Enter)"
                        placeholder="e.g. TypeScript, UI Design"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                      />
                      <div className="flex flex-wrap gap-2">
                        {skillsRequired.map((skill) => (
                          <Badge key={skill} className="gap-1 px-3 py-1 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)}>
                              <X size={12} className="hover:text-primary-900" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                <div className="flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <Button variant="ghost" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isLoading} className="gap-2 px-8">
                    <Send size={18} />
                    Post Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
