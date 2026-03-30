"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuthStore } from '../../../store/useAuthStore';

import { 
  LayoutDashboard, 
  PlusSquare, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Settings,
  MoreVertical,
  Users,

import { Project } from '../../../types';
import { callBackend } from '../../../lib/api';

const sidebarItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
  { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
  { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ManageProjectsPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        const data = await callBackend('projects/my');
        // The backend /my endpoint already returns the user's projects
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);


              </Button>
            </Link>
          </div>


            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


