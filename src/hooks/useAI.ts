import { useState } from 'react';
import { callBackend } from '@/lib/api';
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
    return executeAction(() => callBackend('ai/generate-plan', 'POST', { outcome }));
  };

  const analyzeRisk = async (projectDetails: any) => {
    return executeAction(() => callBackend('ai/analyze-risk', 'POST', projectDetails));
  };

  const matchExperts = async (outcome: string) => {
    return executeAction(() => callBackend('ai/match-experts', 'POST', { outcome }));
  };

  const askCopilot = async (message: string, context?: string) => {
    return executeAction(() => callBackend('ai/chat-copilot', 'POST', { message, context }));
  };

  const getInsights = async (projectId: string) => {
    return executeAction(() => callBackend('ai/insights', 'POST', { projectId }));
  };

  const generateQuotation = async (outcome: string, targetBudget?: { amount: string; currency: string }) => {
    return executeAction(() => callBackend('ai/generate-quotation', 'POST', { outcome, targetBudget }));
  };

  return {
    generatePlan,
    analyzeRisk,
    matchExperts,
    askCopilot,
    getInsights,
    generateQuotation,
    loading,
    error
  };
}

