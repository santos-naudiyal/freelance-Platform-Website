import { ProjectRepository, Project } from '../repositories/ProjectRepository';
import { v4 as uuidv4 } from 'uuid';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    try {
      // ✅ Validate required fields
      if (!data.clientId || !data.title || !data.description) {
        throw new Error("Missing required project fields");
      }

      const projectId = uuidv4();

      const project: Project = {
        id: projectId,
        clientId: data.clientId,
        title: data.title,
        description: data.description,
        budget: data.budget || { min: 0, max: 0, type: 'fixed' },
        skillsRequired: data.skillsRequired || [],
        status: data.status || 'open',
        createdAt: Date.now(),
        progress: data.progress || 0,
        ...data
      };

      await this.projectRepository.create(projectId, project);

      console.log("✅ Project created:", projectId);

      return project;

    } catch (err) {
      console.error("❌ Project creation failed:", err);
      throw err;
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await this.projectRepository.getById(id);
    } catch (err) {
      console.error("❌ getProjectById failed:", err);
      return null;
    }
  }

  async getUserProjects(clientId: string): Promise<Project[]> {
    try {
      return await this.projectRepository.getByClientId(clientId);
    } catch (err) {
      console.error("❌ getUserProjects failed:", err);
      return [];
    }
  }

  async getAllActiveProjects(): Promise<Project[]> {
    try {
      return await this.projectRepository.getActiveProjects();
    } catch (err) {
      console.error("❌ getAllActiveProjects failed:", err);
      return [];
    }
  }

  async updateStatus(id: string, status: Project['status']): Promise<void> {
    try {
      await this.projectRepository.update(id, { status });
      console.log(`✅ Project ${id} status updated to ${status}`);
    } catch (err) {
      console.error("❌ updateStatus failed:", err);
      throw err;
    }
  }
}