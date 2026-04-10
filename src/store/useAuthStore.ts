import { create } from 'zustand';
import { User, FreelancerProfile } from '../types';
import { clearTokenCache } from '../lib/api';

interface AuthState {
  user: User | null;
  freelancerDetails: FreelancerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setFreelancerDetails: (details: FreelancerProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (init: boolean) => void;
  clearUser: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  freelancerDetails: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isInitialized: true }),
  setFreelancerDetails: (details) => set({ freelancerDetails: details }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clearUser: () => {
    clearTokenCache();
    set({ user: null, freelancerDetails: null, isAuthenticated: false, isLoading: false, isInitialized: true });
  },
  logout: () => {
    clearTokenCache();
    set({ user: null, freelancerDetails: null, isAuthenticated: false, isLoading: false, isInitialized: true });
  },
}));
