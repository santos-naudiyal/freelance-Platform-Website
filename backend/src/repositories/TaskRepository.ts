import { BaseRepository } from './BaseRepository';
import { DocumentData } from 'firebase-admin/firestore';

export interface Task extends DocumentData {
  id?: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  assignedTo?: string;
  deadline?: number;
  createdAt: number;
}

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('Tasks');
  }

  async getByProjectId(projectId: string): Promise<Task[]> {
    return this.list(ref => ref.where('projectId', '==', projectId));
  }
}
