import { ProjectRepository, Project } from '../repositories/ProjectRepository';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  // ... (keeping createProject the same)
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
        budget: {
          min: data.budget?.min ?? 0,
          max: data.budget?.max ?? 0,
          type: data.budget?.type ?? 'fixed',
        },
        skillsRequired: data.skillsRequired || [],
        status: data.status || 'open',
        createdAt: Date.now(),
        progress: data.progress || 0,
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
      const project = await this.projectRepository.getById(id);
      if (project && project.clientId) {
        const clientDoc = await db.collection('Users').doc(project.clientId).get();
        if (clientDoc.exists) {
          const clientData = clientDoc.data();
          project.clientDetails = {
            name: clientData?.name || 'Unknown',
            companyName: clientData?.companyName,
            industry: clientData?.industry,
            website: clientData?.website,
            address: clientData?.address,
            avatar: clientData?.avatar
          };
        }
      }
      return project;
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
      const projects = await this.projectRepository.getActiveProjects();
      // Optionally attach client details to all active projects (might be expensive if many)
      // For now, let's just do it for individual project view to save on reads.
      return projects;
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