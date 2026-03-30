import { apiClient } from "./client";

export const AuthAPI = {
  /**
   * Register User with the backend after Firebase authentication
   */
  registerUser: async (data: { email: string; name: string; role: 'client' | 'freelancer' }): Promise<{ message: string; uid: string }> => {
    return apiClient.post(`/users/register`, data);
  },

  /**
   * Retrieve the current user's profile
   */
  getUserProfile: async (): Promise<any> => {
    return apiClient.get(`/users/profile`);
  },

  /**
   * Get the current user's AI credits
   */
  getCredits: async (): Promise<{ credits: number }> => {
    return apiClient.get(`/users/credits`);
  }
};
