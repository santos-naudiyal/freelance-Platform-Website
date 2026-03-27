import { BaseRepository } from './BaseRepository';
import { DocumentData } from 'firebase-admin/firestore';

export interface Invitation extends DocumentData {
  id: string;
  projectId: string;
  freelancerId: string;
  senderId: string;
  status: 'pending' | 'accepted' | 'declined';
  role: string;
  createdAt: number;
}

export class InvitationRepository extends BaseRepository<Invitation> {
  constructor() {
    super('Invitations');
  }

  async getByFreelancer(freelancerId: string): Promise<Invitation[]> {
    return this.list(ref => ref.where('freelancerId', '==', freelancerId));
  }
}
