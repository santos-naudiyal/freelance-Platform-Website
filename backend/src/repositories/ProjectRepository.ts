import { BaseRepository } from './BaseRepository';
import { DocumentData } from 'firebase-admin/firestore';

export interface Project extends DocumentData {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    type: 'fixed' | 'hourly';
  };
  skillsRequired: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: number;
  progress: number;
  clientDetails?: {
    name: string;
    companyName?: string;
    industry?: string;
    website?: string;
    address?: string;
    avatar?: string;
  };
}

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('Projects');
  }

  async getByClientId(clientId: string): Promise<Project[]> {
    return this.list(ref => ref.where('clientId', '==', clientId));
  }

  async getActiveProjects(): Promise<Project[]> {
    return this.list(ref => ref.where('status', '==', 'open'));
  }
}
