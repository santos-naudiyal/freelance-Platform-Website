"use client";

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { 
  Briefcase, 
  Search, 
  Filter, 
  LayoutDashboard, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  DollarSign, 
  Settings 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: Settings },
];

export default function FreelancersPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Freelancers">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              All Freelancers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Find and connect with top talent for your projects.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2">
                <Filter size={18} />
                Filter
             </Button>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search freelancers..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
             </div>
          </div>
        </div>

        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <Briefcase size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Coming Soon</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              The freelancer directory is currently being populated. Check back soon to see our talented community!
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
