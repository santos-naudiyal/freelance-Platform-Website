import { TaskRepository, Task } from '../repositories/TaskRepository';
import { emitTaskUpdate, emitToWorkspace } from './socketService';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    try {
      console.log("📋 Fetching tasks for project:", projectId);
      return await this.taskRepository.getByProjectId(projectId);
    } catch (err) {
      console.error("❌ getTasksByProject failed:", err);
      return [];
    }
  }

  async updateTaskStatus(
    taskId: string,
    status: Task['status'],
    projectId: string
  ): Promise<void> {
    try {
      await this.taskRepository.update(taskId, { status });

      console.log(`✅ Task ${taskId} updated → ${status}`);

      emitTaskUpdate(projectId, { id: taskId, status });

    } catch (err) {
      console.error("❌ updateTaskStatus failed:", err);
    }
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      // ✅ Validate required fields
      if (!taskData.projectId || !taskData.title) {
        throw new Error("Missing required task fields");
      }

      const taskId = `task-${Date.now()}`;

      const newTask: Task = {
        id: taskId,
        projectId: taskData.projectId,
        milestoneId: taskData.milestoneId || '',
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'todo',
        createdAt: Date.now()
      };

      await this.taskRepository.create(taskId, newTask);

      console.log("✅ Task created:", taskId);

      // ✅ Emit event
      emitToWorkspace(taskData.projectId, 'task-created', newTask);

      return newTask;

    } catch (err) {
      console.error("❌ createTask failed:", err);

      // fallback object (prevents crash)
      return {
        id: 'failed-task',
        projectId: taskData.projectId || '',
        milestoneId: '',
        title: 'Task creation failed',
        description: '',
        status: 'todo',
        createdAt: Date.now()
      };
    }
  }
}