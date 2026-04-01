
import { ProjectRepository, Project } from '../repositories/ProjectRepository';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';
import { AIService } from './aiService';

export class ProjectService {
  private projectRepository: ProjectRepository;
  private aiService: AIService;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.aiService = new AIService();
  }

  // 🔥 AI Pricing Generator (uses chatCopilot)
  private async generatePricing(data: Partial<Project>) {
    try {
      const prompt = `
You are a freelance pricing expert (India market).

Analyze this project and return STRICT JSON:

{
  "hours": number,
  "rate": number,
  "complexity": number,
  "buffer": number,
  "total": number,
  "equation": "string",
  "breakdown": {
    "development": number,
    "complexity": number,
    "buffer": number
  }
}

Project:
Title: ${data.title}
Description: ${data.description}
Skills: ${data.skillsRequired?.join(", ") || "Not specified"}

Rules:
- Only JSON
- No explanation
`;

      // ✅ Use your existing AI method
      const aiResponse = await this.aiService.chatCopilot(prompt);

      // ✅ Clean response (VERY IMPORTANT)
      const cleaned = aiResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      if (!parsed.total || !parsed.breakdown) {
        throw new Error("Invalid AI response");
      }

      return parsed;

    } catch (err) {
      console.error("❌ AI Pricing Failed:", err);

      // ✅ Fallback (never break project creation)
      return {
        hours: 20,
        rate: 500,
        complexity: 2000,
        buffer: 1000,
        total: 13000,
        equation: "(20 × 500) + 2000 + 1000",
        breakdown: {
          development: 10000,
          complexity: 2000,
          buffer: 1000
        }
      };
    }
  }

  // 🔥 UPDATED createProject
  async createProject(data: Partial<Project>): Promise<Project> {
    try {
      if (!data.clientId || !data.title || !data.description) {
        throw new Error("Missing required project fields");
      }

      const projectId = uuidv4();

      // 🔥 AI PRICING
      const pricing = await this.generatePricing(data);

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
        pricing // ✅ added
      };

      await this.projectRepository.create(projectId, project);

      console.log("✅ Project created with pricing:", projectId);

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

  async getProjectsByFreelancerId(freelancerId: string): Promise<Project[]> {
    try {
      // 1. Fetch all accepted proposals for this freelancer
      const snapshot = await db.collection('Proposals')
        .where('freelancerId', '==', freelancerId)
        .where('status', '==', 'accepted')
        .get();

      if (snapshot.empty) return [];

      // 2. Extract unique project IDs
      const projectIds = Array.from(new Set(snapshot.docs.map(doc => doc.data().projectId)));

      if (projectIds.length === 0) return [];

      // 3. Fetch each project by ID
      // (Using simple Promise.all since exact 'in' query limitations exist in firestore)
      const projects = await Promise.all(
        projectIds.map(id => this.projectRepository.getById(id as string))
      );

      // Filter out nulls
      return projects.filter((p): p is Project => p !== null);

    } catch (err) {
      console.error("❌ getProjectsByFreelancerId failed:", err);
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