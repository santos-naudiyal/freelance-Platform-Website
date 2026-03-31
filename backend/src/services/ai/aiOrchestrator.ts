import { AIProvider } from "./aiProviders";
import { Prompts } from "./promptBuilder";
import { db } from "../../config/firebase";

export interface AIProjectPlan {
  plan: {
    id: string;
    title: string;
    description: string;
    tasks: {
      id: string;
      title: string;
      duration: string;
      role: string;
    }[];
  }[];
  analysis: {
    timeline: string;
    investment: string;
    skills: string[];
    description: string;
  };
}

export class AIOrchestrator {
  private provider: AIProvider;
  private cache: Map<string, any>;

  constructor() {
    this.provider = new AIProvider();
    this.cache = new Map<string, any>();
  }

  // ================= CREDIT & CACHE =================
  async checkAndDeductCredits(userId: string, amount: number = 1): Promise<boolean> {
    const userRef = db.collection('Users').doc(userId);
    const userDoc = await userRef.get();
    let credits = userDoc.exists ? (userDoc.data()?.aiCredits ?? 10) : 0;

    if (userDoc.exists && userDoc.data()?.aiCredits === undefined) {
      await userRef.update({ aiCredits: 10 });
    }

    if (credits < amount) return false;

    await userRef.update({ aiCredits: credits - amount });
    return true;
  }

  // ================= ORCHESTRATED FEATURES =================
  async generateProjectPlan(outcome: string): Promise<AIProjectPlan> {
    const cacheKey = `plan:${outcome.trim().toLowerCase()}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const { system, buildUserPrompt } = Prompts.PROJECT_PLANNER;
    const prompt = buildUserPrompt(outcome);
    
    // Call LLM Provider
    const result = await this.provider.generateJSON<AIProjectPlan>("gpt-4o", system, prompt);
    
    this.cache.set(cacheKey, result);
    return result;
  }

  async analyzeRisk(projectDetails: any): Promise<any> {
    const { system, buildUserPrompt } = Prompts.RISK_ANALYZER;
    const prompt = buildUserPrompt(projectDetails);
    
    return this.provider.generateJSON<any>("gpt-4o-mini", system, prompt);
  }

  async matchExperts(outcome: string, freelancers: any[] = []): Promise<any[]> {
    const { system, buildUserPrompt } = Prompts.EXPERT_MATCHER;
    const prompt = buildUserPrompt(outcome, freelancers);
    
    const result = await this.provider.generateJSON<{experts: any[]}>("gpt-4o-mini", system, prompt);
    return result.experts || [];
  }

  async getAIProjectManagerInsights(projectContext: any): Promise<any> {
    const { system, buildUserPrompt } = Prompts.WORKSPACE_INSIGHTS;
    const prompt = buildUserPrompt(projectContext);
    
    return this.provider.generateJSON<any>("gpt-4o", system, prompt);
  }

  async chatCopilot(message: string, context?: string): Promise<string> {
    const system = Prompts.COPILOT_CHAT.buildSystem(context || '');
    const prompt = Prompts.COPILOT_CHAT.buildUserPrompt(message);
    
    return this.provider.generateText("gpt-4o-mini", system, prompt);
  }

  async draftProposal(projectContext: any, freelancerProfile: any): Promise<{ coverLetter: string, suggestedRate: number, estimatedDuration: string, reasoning: string }> {
    const cacheKey = `proposal:${projectContext.id}:${freelancerProfile.userId}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const { system, buildUserPrompt } = Prompts.PROPOSAL_DRAFTER;
    const prompt = buildUserPrompt(projectContext, freelancerProfile);
    
    // Call LLM Provider
    const result = await this.provider.generateJSON<any>("gpt-4o", system, prompt);
    
    this.cache.set(cacheKey, result);
    return result;
  }

  async estimatePricing(projectScope: string): Promise<{ minRate: number, maxRate: number, marketConfidence: string, recommendation: string, complexityScore: number }> {
    const cacheKey = `pricing:${projectScope.trim().toLowerCase()}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const { system, buildUserPrompt } = Prompts.PRICING_ESTIMATOR;
    const prompt = buildUserPrompt(projectScope);
    
    // Call LLM Provider (gpt-4o-mini is fine for this fast task)
    const result = await this.provider.generateJSON<any>("gpt-4o-mini", system, prompt);
    
    this.cache.set(cacheKey, result);
    return result;
  }

  async generateProjectQuotation(outcome: string): Promise<any> {
    const cacheKey = `quotation:${outcome.trim().toLowerCase()}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const { system, buildUserPrompt } = Prompts.PROJECT_QUOTATION;
    const prompt = buildUserPrompt(outcome);
    
    const result = await this.provider.generateJSON<any>("gpt-4o", system, prompt);
    
    this.cache.set(cacheKey, result);
    return result;
  }
}


