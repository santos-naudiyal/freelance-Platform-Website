import { apiClient } from "./client";
import { Project, Proposal } from "../../types";

export const ProjectAPI = {
  /**
   * Fetch a single project by ID
   */
  getProjectById: async (id: string): Promise<Project> => {
    return apiClient.get(`/projects/${id}`);
  },

  /**
   * Fetch all open projects (for Freelancers)
   */
  getOpenProjects: async (): Promise<Project[]> => {
    return apiClient.get(`/projects/browse`);
  },

  /**
   * Fetch my projects (for Clients)
   */
  getMyProjects: async (): Promise<Project[]> => {
    return apiClient.get(`/projects/my`);
  },

  /**
   * Create a new project (Client only)
   */
  createProject: async (data: Partial<Project>): Promise<{ message: string; projectId: string }> => {
    return apiClient.post(`/projects`, data);
  },

  /**
   * Submit a proposal to a project (Freelancer only)
   */
  submitProposal: async (projectId: string, data: Partial<Proposal>): Promise<{ message: string; data: Proposal }> => {
    return apiClient.post(`/proposals`, { projectId, ...data });
  },

  /**
   * Get all proposals for a specific project (Client only)
   */
  getProjectProposals: async (projectId: string): Promise<Proposal[]> => {
    return apiClient.get(`/proposals/project/${projectId}`);
  },

  /**
   * Get my submitted proposals (Freelancer only)
   */
  getMyProposals: async (): Promise<Proposal[]> => {
    return apiClient.get(`/proposals/my`);
  },

  /**
   * Accept or reject a proposal
   */
  updateProposalStatus: async (proposalId: string, status: 'accepted' | 'rejected'): Promise<{ message: string }> => {
    return apiClient.patch(`/proposals/${proposalId}/status`, { status });
  }
};
