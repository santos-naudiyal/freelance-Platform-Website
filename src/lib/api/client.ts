import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { auth } from "../firebase";

/**
 * Retrieves the current Firebase ID token for the authenticated user.
 * Direct access to currentUser is faster than setting up a listener.
 */
async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }

  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        const token = await user.getIdToken();
        resolve(token);
      } else {
        resolve(null);
      }
    });
  });
}

// Ensure proper base URL format
const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Firebase Bearer Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.debug("[API Client] Request proceeding without token");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract Data & Global Error Logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = error.config?.url || 'UNKNOWN';
    console.error(`[API Error] ${method} ${url}:`, error.message);
    
    if (error.response?.data?.error) {
       console.error(`[API Error Details]:`, error.response.data.error);
    }
    
    return Promise.reject(error.response?.data || error);
  }
);
