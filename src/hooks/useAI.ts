"use client";

import { useState } from 'react';
import { callBackendAI } from '@/lib/gemini';
import { useAuthStore } from '@/store/useAuthStore';

export function useAI() {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAction = async <T,>(action: () => Promise<T>): Promise<T | null> => {
    if (!isAuthenticated) {
      setError("Please sign in to use AI features.");
      return null;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await action();
      return result;
    } catch (err: any) {
      console.error("AI Hook Error:", err);
      setError(err.message || 'An unexpected error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async (outcome: string) => {
    return executeAction(() => callBackendAI('plan', { outcome }));
  };

  const analyzeRisk = async (projectDetails: any) => {
    return executeAction(() => callBackendAI('risk', projectDetails));
  };

  const matchExperts = async (outcome: string) => {
    return executeAction(() => callBackendAI('match', { outcome }));
  };

  const askCopilot = async (message: string, context?: string) => {
    return executeAction(() => callBackendAI('chat', { message, context }));
  };

  return {
    generatePlan,
    analyzeRisk,
    matchExperts,
    askCopilot,
    loading,
    error
  };
}
