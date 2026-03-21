"use client";

import React from 'react';
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
  Lock,
  User
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/client/post-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: SettingsIcon },
];

export default function ClientSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <DashboardLayout sidebarItems={sidebarItems} title="Account Settings">
        <div className="max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                    <User size={20} className="text-white" />
                 </div>
                 <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your company and personal details</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Company Name" placeholder="e.g. Acme Corp" />
                <Input label="Contact Email" placeholder="m@example.com" />
              </div>
              <div className="flex justify-end">
                 <Button className="rounded-xl px-8 font-bold">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center">
                    <Bell size={20} className="text-white" />
                 </div>
                 <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive project updates</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-slate-500 font-medium italic">Notification preferences coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
