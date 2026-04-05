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

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('Projects');
  }

  async getByClientId(clientId: string): Promise<Project[]> {
    return this.list(ref => ref.where('clientId', '==', clientId));
  }

  async getActiveProjects(): Promise<Project[]> {
    console.log("Fetching active projects (status: open)...");
    const allProjects = await this.list();
    console.log(`Total projects in DB: ${allProjects.length}`);
    const activeProjects = allProjects.filter(p => (p.status || 'open') === 'open');
    console.log(`Open projects fetched: ${activeProjects.length}`);
    return activeProjects;
  }
}
