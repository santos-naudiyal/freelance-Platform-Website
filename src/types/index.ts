export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  country?: string;
  address?: string;
  companyName?: string;
  industry?: string;
  website?: string;
  createdAt: number;
}

export interface FreelancerProfile {
  userId: string;
  profile: {
    title: string;
    bio: string;
    department?: string;
    skills: string[];
    hourlyRate: number;
    githubUrl?: string;
    portfolioLinks?: string[];
    avatar?: string;
  };
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  successRate?: number;
  velocity?: number;
  satisfaction?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    type: 'fixed' | 'hourly';
  };
  deadline?: number;
  skillsRequired: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: number;
  lastMessageAt?: number;
  otherPersonName?: string;
  otherPersonCompany?: string;

  workspaceId?: string;

  clientDetails?: {
    name: string;
    companyName?: string;
    industry?: string;
    website?: string;
    address?: string;
    avatar?: string;
  };
}

export interface Workspace {
  id: string;
  projectId: string;
  title: string;
  description: string;
  clientId: string;
  freelancerIds: string[];
  status: 'active' | 'on_hold' | 'completed' | 'disputed';
  progress: number; // 0-100
  daysLeft?: number;
  completedTasks?: number;
  totalTasks?: number;
  members?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: number;
  createdAt: number;
}

export interface Message {
  id: string;
  workspaceId: string;
  senderId: string;
  senderName: string;
  text: string;
  type: 'user' | 'ai' | 'system';
  createdAt: number;
}

export interface Milestone {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  dueDate: number;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  order: number;
}

export interface PaymentMilestone extends Milestone {
  paidAt?: number;
  transactionId?: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  rate: number;
  estimatedDuration: string;
  deliveryTime?: string;
  bidAmount?: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}
