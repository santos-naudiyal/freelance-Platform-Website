"use client";

import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Users,
  LayoutDashboard,
  Briefcase,
  FileText,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  Settings
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function DiscoverFreelancersPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Discover">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Discover Talent
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Explore top-rated freelancers and rising stars in the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardHeader>
              <Sparkles className="text-blue-600 dark:text-blue-400 mb-2" size={24} />
              <CardTitle className="text-lg">Rising Stars</CardTitle>
              <CardDescription>New freelancers with great potential</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardHeader>
              <TrendingUp className="text-purple-600 dark:text-purple-400 mb-2" size={24} />
              <CardTitle className="text-lg">Top Rated</CardTitle>
              <CardDescription>Experienced freelancers with 5-star ratings</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <CardHeader>
              <Users className="text-emerald-600 dark:text-emerald-400 mb-2" size={24} />
              <CardTitle className="text-lg">Specialists</CardTitle>
              <CardDescription>Experts in niche technologies and fields</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <Compass size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Start Exploring</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Browse through different categories and find the perfect match for your project needs.
            </p>
            <div className="mt-6 flex justify-center gap-4">
               <Button>Browse Categories</Button>
               <Button variant="outline">View All Freelancers</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
