import { BaseRepository } from './BaseRepository';
import { DocumentData } from 'firebase-admin/firestore';

export interface Freelancer extends DocumentData {
  id: string;
  name: string;
  email: string;
  profile: {
    title: string;
    skills: string[];
    bio: string;
    hourlyRate: number;
    avatar?: string;
  };
  scores?: {
    skillScore: number;
    completionRate: number;
    responseTime: number;
  };
  availability: 'available' | 'busy' | 'offline';
  createdAt: number;
}

export class FreelancerRepository extends BaseRepository<Freelancer> {
  constructor() {
    super('Freelancers');
  }

  async getAllAvailable(): Promise<Freelancer[]> {
    return this.list(ref => ref.where('availability', '==', 'available'));
  }

  async updateScores(id: string, scores: Freelancer['scores']): Promise<void> {
    await this.update(id, { scores });
  }
}
