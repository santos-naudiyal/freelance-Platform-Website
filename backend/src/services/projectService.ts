
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

  // Removing redundant AI Pricing Generator to ensure budget consistency


  // 🔥 UPDATED createProject
  async createProject(data: Partial<Project>): Promise<Project> {
    try {
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
          min: Number(data.budget?.min) || 0,
          max: Number(data.budget?.max) || 0,
          type: data.budget?.type || 'fixed',
        },
        skillsRequired: data.skillsRequired || [],
        status: 'open', // Always start as open for bidding
        createdAt: Date.now(),
        progress: 0,
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
      const projects = await this.projectRepository.getByClientId(clientId);

      // Enrich with freelancer name from accepted proposals
      const enriched = await Promise.all(projects.map(async (p) => {
        const pSnapshot = await db.collection('Proposals')
          .where('projectId', '==', p.id)
          .where('status', '==', 'accepted')
          .limit(1)
          .get();

        if (!pSnapshot.empty) {
          const fId = pSnapshot.docs[0].data().freelancerId;
          const uDoc = await db.collection('Users').doc(fId).get();
          if (uDoc.exists) {
            p.otherPersonName = uDoc.data()?.name || 'Assigned Freelancer';
          }
        }
        return p;
      }));

      return enriched;
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

      // 3. Fetch each project by ID and enrich with Client info
      const projects = await Promise.all(
        projectIds.map(async (id) => {
          const p = await this.projectRepository.getById(id as string);
          if (p && p.clientId) {
            const uDoc = await db.collection('Users').doc(p.clientId).get();
            if (uDoc.exists) {
              const uData = uDoc.data();
              p.otherPersonName = uData?.name || 'Project Client';
              p.otherPersonCompany = uData?.companyName;
            }
          }
          return p;
        })
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