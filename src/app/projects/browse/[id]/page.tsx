"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../../../components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Send,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { auth } from '../../../../lib/firebase';
import { Project } from '../../../../types';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Proposal Form State
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [deliveryTime, setDeliveryTime] = useState('1 week');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const resp = await fetch(`http://localhost:5000/api/projects/${id}`);
        if (resp.ok) {
          const data = await resp.json();
          setProject(data);
          setBidAmount(data.budget.min);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Not authenticated');
      const token = await firebaseUser.getIdToken();

      const resp = await fetch('http://localhost:5000/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: id,
          bidAmount,
          coverLetter,
          deliveryTime
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to submit proposal');

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><p>Loading project details...</p></div>;
  if (!project) return <div className="h-screen flex items-center justify-center"><p>Project not found.</p></div>;

  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Project Details">
        <div className="max-w-5xl mx-auto py-4 space-y-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">
            <ArrowLeft size={16} />
            Back to Marketplace
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Project Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="success" className="px-3 py-1">OPEN</Badge>
                  <span className="text-sm text-slate-500 flex items-center gap-1.5"><Clock size={14} /> Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                  {project.title}
                </h1>
                <div className="flex gap-6 pt-2">
                   <div>
                      <p className="text-sm text-slate-500 font-medium">Budget</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">${project.budget.min} - ${project.budget.max}</p>
                   </div>
                   <div>
                      <p className="text-sm text-slate-500 font-medium">Type</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white capitalize">{project.budget.type}</p>
                   </div>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold">About the Project</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold">Skills and Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skillsRequired.map(skill => (
                    <Badge key={skill} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Proposal Form */}
            <div className="space-y-6">
              {isSubmitted ? (
                 <Card className="border-0 shadow-lg ring-1 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/10">
                   <CardContent className="p-8 text-center space-y-4">
                      <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} className="text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Proposal Submitted!</h3>
                      <p className="text-sm text-emerald-700 dark:text-emerald-500">Your application has been sent to the client. You&apos;ll be notified if they move forward.</p>
                      <Link href="/freelancer/proposals" className="block">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 border-0">View My Proposals</Button>
                      </Link>
                   </CardContent>
                 </Card>
              ) : (
                <Card className="border-0 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-xl">Apply for this project</CardTitle>
                    <CardDescription>Tell the client why you&apos;re a good fit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitProposal} className="space-y-6">
                      <Input
                        label="Your Bid Amount ($)"
                        type="number"
                        min={10}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(parseInt(e.target.value))}
                        required
                      />
                      <Input
                        label="Estimated Delivery"
                        placeholder="e.g. 5 days, 2 weeks"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        required
                      />
                      <div className="space-y-1.5">
                         <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cover Letter</label>
                         <textarea
                           className="flex min-h-[150px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                           placeholder="Describe your relevant experience and how you would approach this project..."
                           value={coverLetter}
                           onChange={(e) => setCoverLetter(e.target.value)}
                           required
                         />
                      </div>

                      {submitError && (
                        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                          <AlertCircle size={16} />
                          {submitError}
                        </div>
                      )}

                      <Button type="submit" className="w-full gap-2 py-6 text-lg" isLoading={isSubmitting}>
                        <Send size={18} />
                        Submit Proposal
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="pt-0 justify-center">
                    <p className="text-xs text-slate-500">Service Fee: 10% will be deducted from your earnings.</p>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
