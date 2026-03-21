"use client";

import React from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings as SettingsIcon,
  CheckCircle2,
  Bell,
  Lock,
  User
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const sidebarItems = [
  { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
  { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
  { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
  { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
  { name: 'Settings', href: '/freelancer/settings', icon: SettingsIcon },
];

export default function FreelancerSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['freelancer']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Account Settings">
        <div className="max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                    <User size={20} className="text-white" />
                 </div>
                 <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your public profile and preferences</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Display Name" placeholder="e.g. John Doe" />
                <Input label="Work Email" placeholder="john@example.com" />
              </div>
              <div className="flex justify-end">
                 <Button className="rounded-xl px-8 font-bold">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Lock size={20} className="text-white" />
                 </div>
                 <div>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your password and secure your account</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button variant="outline" className="rounded-xl font-bold">Reset Password</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
