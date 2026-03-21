"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { 
  User, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Star, 
  ShieldCheck,
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

export default function FreelancerProfilePage() {
  const params = useParams();
  const username = params.username as string;

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={`Profile: @${username}`}>
      <div className="space-y-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-indigo-600"></div>
          <CardContent className="relative pt-0 pb-8 px-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
              <div className="h-24 w-24 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="h-full w-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <User size={48} className="text-slate-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{username}</h2>
                  <ShieldCheck size={20} className="text-primary-500" />
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin size={16} />
                    Location Hidden
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    New Freelancer (0 reviews)
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Message</Button>
                <Button>Hire Me</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Hi, I'm {username}! I'm a professional freelancer ready to help you with your next big project. 
                  My portfolio and skills are currently being updated, but feel free to reach out and message me 
                  if you're interested in working together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="p-12 text-center text-slate-500">
                No portfolio items uploaded yet.
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Generalist
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Hourly Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-white">$30/hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Member Since</span>
                  <span className="font-semibold text-slate-900 dark:text-white">March 2024</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
