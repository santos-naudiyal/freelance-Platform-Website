import { BaseRepository } from './BaseRepository';
import { DocumentData } from 'firebase-admin/firestore';

export interface Milestone extends DocumentData {
  id?: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'completed' | 'released' | 'refunded';
  releaseDate?: number;
  createdAt: number;
}

export class MilestoneRepository extends BaseRepository<Milestone> {
  constructor() {
    super('Milestones');
  }

  async getByProjectId(projectId: string): Promise<Milestone[]> {
    return this.list(ref => ref.where('projectId', '==', projectId));
  }

  async release(id: string): Promise<void> {
    await this.update(id, { 
      status: 'released', 
      releaseDate: Date.now() 
    } as any);
  }
}
