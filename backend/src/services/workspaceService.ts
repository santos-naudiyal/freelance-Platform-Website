import { v4 as uuidv4 } from 'uuid';
import { ProjectService } from './projectService';
import { TaskRepository } from '../repositories/TaskRepository';
import { MilestoneRepository } from '../repositories/MilestoneRepository';
import { AIProjectPlan } from './aiService';
import { db } from '../config/firebase';

export class WorkspaceService {
  private projectService: ProjectService;
  private taskRepository: TaskRepository;
  private milestoneRepository: MilestoneRepository;

  constructor() {
    this.projectService = new ProjectService();
    this.taskRepository = new TaskRepository();
    this.milestoneRepository = new MilestoneRepository();
  }

  async createWorkspaceFromAI(
    clientId: string,
    outcome: string,
    aiData: AIProjectPlan
  ): Promise<string> {
    try {
      console.log("🚀 Creating workspace from AI");

      // ✅ SAFE ANALYSIS
      const analysis = aiData?.analysis || {};
      const investmentStr = analysis.investment || '0-5000';

      const project = await this.projectService.createProject({
        clientId,
        title: outcome,
        description:
          analysis.description || `AI planned project for: ${outcome}`,
        budget: {
          min: parseInt(investmentStr.split('-')[0]?.replace(/[^0-9]/g, '')) || 0,
          max: parseInt(investmentStr.split('-')[1]?.replace(/[^0-9]/g, '')) || 5000,
          type: 'fixed'
        },
        skillsRequired: analysis.skills || [],
        status: 'in_progress'
      });

      console.log("✅ Project created:", project.id);

      // 🔥🔥 CRITICAL FIX: LINK WORKSPACE (PROJECT = WORKSPACE)
      await db.collection('Projects').doc(project.id).update({
        workspaceId: project.id // 👈 THIS FIXES YOUR ISSUE
      });

      // ✅ HANDLE EMPTY AI PLAN
      let plan = aiData?.plan;

      if (!plan || plan.length === 0) {
        console.warn("⚠️ AI returned empty plan → using fallback");

        plan = [
          {
            id: 'fallback-phase',
            title: 'Project Setup',
            description: 'Initial project setup',
            tasks: [
              {
                id: 'task-1',
                title: 'Requirement Analysis',
                duration: '2 days',
                role: 'Analyst'
              },
              {
                id: 'task-2',
                title: 'Development Setup',
                duration: '3 days',
                role: 'Developer'
              }
            ]
          }
        ];
      }

      // ✅ CREATE MILESTONES + TASKS
      await Promise.all(
        plan.map(async (milestonePlan: any) => {
          const milestoneId = `milestone-${uuidv4()}`;

          await this.milestoneRepository.create(milestoneId, {
            id: milestoneId,
            projectId: project.id,
            title: milestonePlan.title || 'Project Phase',
            description: milestonePlan.description || '',
            amount: 0,
            status: 'pending',
            createdAt: Date.now()
          });

          const tasks = milestonePlan.tasks || [];

          await Promise.all(
            tasks.map(async (taskPlan: any) => {
              const taskId = `task-${uuidv4()}`;

              await this.taskRepository.create(taskId, {
                id: taskId,
                projectId: project.id,
                milestoneId,
                title: taskPlan.title || 'Task',
                description: taskPlan.role || '',
                status: 'todo',
                createdAt: Date.now()
              });
            })
          );
        })
      );

      // ✅ LOG ACTIVITY
      await db.collection('ActivityLogs').add({
        projectId: project.id,
        userId: clientId,
        action: 'WORKSPACE_CREATED_FROM_AI',
        details: { outcome },
        timestamp: Date.now()
      });

      console.log("🎉 Workspace fully created");

      return project.id; // 👈 projectId = workspaceId

    } catch (err) {
      console.error("❌ Workspace creation failed:", err);
      throw err;
    }
  }
}