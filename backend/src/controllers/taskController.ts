import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TaskService } from '../services/taskService';

const taskService = new TaskService();

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const tasks = await taskService.getTasksByProject(projectId);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    const { status, projectId } = req.body;
    
    if (!status || !projectId) {
      return res.status(400).json({ error: 'Status and Project ID are required' });
    }

    await taskService.updateTaskStatus(taskId, status, projectId);
    res.json({ message: 'Task updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};
