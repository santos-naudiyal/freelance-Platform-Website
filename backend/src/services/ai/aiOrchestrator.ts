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

interface QuotationResponse {
  projectTitle?: string;
  summary?: { text?: string; complexity?: string; confidenceScore?: number };
  architectureFlow?: { phase: string; details: string; technologies: string[] }[];
  pricing?: {
    indianMarket?: { currency?: string; min?: number; max?: number; recommended?: number };
    globalMarket?: { currency?: string; min?: number; max?: number; recommended?: number };
  };
  timeline?: { minDays: number; maxDays: number; recommended: string };
  tasks?: { name: string; description: string; hours: number; costINR: number; costUSD: number }[];
  skills?: string[];
  risks?: { risk: string; mitigation: string }[];
  marketInsights?: { demand: string; competition: string; analysis: string };
  pricingOptions?: {
    basic: { priceINR: number; priceUSD: number; features: string[] };
    standard: { priceINR: number; priceUSD: number; features: string[] };
    premium: { priceINR: number; priceUSD: number; features: string[] };
  };
}

export class AIOrchestrator {
  private provider: AIProvider;
  private cache: Map<string, any>;
  private readonly usdInrRate = 83;

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

  async generateProjectQuotation(outcome: string, targetBudget?: { amount: string; currency: string }): Promise<any> {
    const budgetStr = targetBudget ? `:${targetBudget.amount}${targetBudget.currency}` : '';
    const cacheKey = `quotation:${outcome.trim().toLowerCase()}${budgetStr}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const { system, buildUserPrompt } = Prompts.PROJECT_QUOTATION;
    const prompt = buildUserPrompt(outcome, targetBudget);
    
    const result = await this.provider.generateJSON<QuotationResponse>("gpt-4o", system, prompt);
    const normalized = this.normalizeQuotation(result, outcome, targetBudget);
    
    this.cache.set(cacheKey, normalized);
    return normalized;
  }

  private normalizeQuotation(quotation: QuotationResponse, outcome: string, targetBudget?: { amount: string; currency: string }): QuotationResponse {
    const budgetAmount = Number(String(targetBudget?.amount || '').replace(/[^0-9.]/g, ''));
    const budgetCurrency = String(targetBudget?.currency || 'INR').toUpperCase();
    const hasBudget = Number.isFinite(budgetAmount) && budgetAmount > 0;

    if (!quotation || typeof quotation !== 'object') quotation = {};

    quotation.projectTitle = quotation.projectTitle || this.buildProjectTitle(outcome);
    quotation.summary = {
      text: quotation.summary?.text || 'This quotation is prepared from the submitted project scope with a practical delivery plan, line-item costing, and milestone-ready execution.',
      complexity: quotation.summary?.complexity || 'Medium',
      confidenceScore: Number(quotation.summary?.confidenceScore) || 92
    };
    quotation.timeline = quotation.timeline || { minDays: 14, maxDays: 35, recommended: '21-30 days' };
    quotation.skills = Array.isArray(quotation.skills) && quotation.skills.length ? quotation.skills : ['UI/UX', 'Frontend Development', 'Backend API', 'Database', 'QA'];
    quotation.risks = Array.isArray(quotation.risks) && quotation.risks.length ? quotation.risks : [
      { risk: 'Scope changes', mitigation: 'Confirm screens, roles, and integrations before development starts.' },
      { risk: 'Third-party delays', mitigation: 'Keep API keys, hosting, payment gateway, and content access ready before implementation.' }
    ];
    quotation.marketInsights = quotation.marketInsights || {
      demand: 'Moderate',
      competition: 'Healthy',
      analysis: 'The estimate uses practical freelance delivery rates and keeps the scope aligned with the client budget.'
    };
    quotation.architectureFlow = this.normalizeArchitecture(quotation.architectureFlow, outcome);

    const indianBudget = hasBudget
      ? budgetCurrency === 'USD' ? budgetAmount * this.usdInrRate : budgetAmount
      : Number(quotation.pricing?.indianMarket?.recommended || 50000);
    const globalBudget = hasBudget
      ? budgetCurrency === 'USD' ? budgetAmount : budgetAmount / this.usdInrRate
      : Number(quotation.pricing?.globalMarket?.recommended || 600);

    const indianRecommended = this.roundMoney(hasBudget ? indianBudget * 0.9 : Number(quotation.pricing?.indianMarket?.recommended || indianBudget), 'INR');
    const globalRecommended = this.roundMoney(hasBudget ? globalBudget * 0.9 : Number(quotation.pricing?.globalMarket?.recommended || globalBudget), 'USD');

    const indianMarket = this.buildMarketPricing('INR', indianRecommended, hasBudget ? indianBudget : undefined);
    const globalMarket = this.buildMarketPricing('USD', globalRecommended, hasBudget ? globalBudget : undefined);
    quotation.pricing = { indianMarket, globalMarket };

    quotation.tasks = this.buildCostBreakdown(outcome, indianMarket.recommended, globalMarket.recommended);
    quotation.pricingOptions = this.buildPricingOptions(indianMarket.recommended, globalMarket.recommended);
    quotation.summary.text = hasBudget
      ? `This quotation is scoped to stay within the client's ${budgetCurrency} ${budgetAmount.toLocaleString()} budget. It includes the core delivery items needed to launch: design, development, backend, admin controls where required, testing, deployment, and handover.`
      : quotation.summary.text;

    return quotation;
  }

  private buildMarketPricing(currency: 'INR' | 'USD', recommended: number, budgetCap?: number) {
    const cap = budgetCap ? this.roundMoney(budgetCap, currency) : undefined;
    const cappedRecommended = cap ? Math.min(recommended, cap) : recommended;
    return {
      currency,
      min: this.roundMoney(cappedRecommended * 0.75, currency),
      max: cap || this.roundMoney(cappedRecommended * 1.18, currency),
      recommended: cappedRecommended
    };
  }

  private buildCostBreakdown(outcome: string, totalINR: number, totalUSD: number) {
    const scope = outcome.toLowerCase();
    const items = [
      { name: 'Requirement Mapping', description: 'Finalize user roles, feature list, screens, acceptance criteria, and delivery milestones.', weight: 0.08, hours: 8 },
      { name: 'UI/UX Design', description: 'Wireframes, visual design, responsive layouts, key user journeys, and developer-ready handoff.', weight: 0.16, hours: 24 },
      { name: scope.includes('app') || scope.includes('flutter') || scope.includes('mobile') ? 'Mobile App Development' : 'Frontend Development', description: 'Build the client-facing interface, forms, validations, navigation, and responsive user experience.', weight: 0.26, hours: 44 },
      { name: 'Backend API and Database', description: 'Create APIs, data models, authentication logic, business rules, and secure database structure.', weight: 0.2, hours: 34 },
      { name: 'Admin Panel', description: 'Admin dashboard for managing users, content, projects, orders, bookings, reports, and platform settings as needed.', weight: 0.14, hours: 26 },
      { name: 'Integrations and Notifications', description: 'Connect payment gateway, email/SMS/WhatsApp, file upload, maps, analytics, or other required services.', weight: 0.07, hours: 14 },
      { name: 'QA, Deployment and Handover', description: 'Functional testing, bug fixing, production deployment, documentation, and final handover.', weight: 0.09, hours: 18 }
    ];

    let runningINR = 0;
    let runningUSD = 0;

    return items.map((item, index) => {
      const isLast = index === items.length - 1;
      const costINR = isLast ? totalINR - runningINR : this.roundMoney(totalINR * item.weight, 'INR');
      const costUSD = isLast ? totalUSD - runningUSD : this.roundMoney(totalUSD * item.weight, 'USD');
      runningINR += costINR;
      runningUSD += costUSD;
      return { name: item.name, description: item.description, hours: item.hours, costINR, costUSD };
    });
  }

  private buildPricingOptions(priceINR: number, priceUSD: number) {
    return {
      basic: {
        priceINR: this.roundMoney(priceINR * 0.78, 'INR'),
        priceUSD: this.roundMoney(priceUSD * 0.78, 'USD'),
        features: ['Essential screens and core workflow', 'Basic admin controls', 'Standard QA and deployment']
      },
      standard: {
        priceINR,
        priceUSD,
        features: ['Complete agreed scope', 'UI/UX, frontend/app, backend, admin panel', 'Testing, deployment, and handover']
      },
      premium: {
        priceINR: this.roundMoney(priceINR * 1.12, 'INR'),
        priceUSD: this.roundMoney(priceUSD * 1.12, 'USD'),
        features: ['Extended polish and automation', 'Priority fixes after launch', 'Additional reporting or integration support']
      }
    };
  }

  private normalizeArchitecture(flow: QuotationResponse['architectureFlow'], outcome: string) {
    if (Array.isArray(flow) && flow.length >= 3) return flow.slice(0, 5);
    const isApp = /app|flutter|mobile|ios|android/i.test(outcome);
    return [
      { phase: 'UI/UX and Product Flow', details: 'Screens, navigation, user journeys, forms, and responsive states are finalized before development.', technologies: ['Figma', 'Design System', 'Responsive UI'] },
      { phase: isApp ? 'Mobile App Build' : 'Frontend Build', details: 'Client-facing interface is implemented with validations, reusable components, and production-ready user flows.', technologies: isApp ? ['Flutter', 'Dart', 'State Management'] : ['Next.js', 'React', 'Tailwind CSS'] },
      { phase: 'Backend, Database and Admin', details: 'APIs, database models, authentication, admin controls, and business rules are built around the approved workflow.', technologies: ['Node.js', 'Firebase/PostgreSQL', 'REST APIs'] },
      { phase: 'Testing and Launch', details: 'QA, bug fixes, deployment, handover notes, and launch support are completed before closure.', technologies: ['QA Checklist', 'Cloud Hosting', 'Documentation'] }
    ];
  }

  private buildProjectTitle(outcome: string): string {
    return outcome.replace(/[^\w\s-]/g, '').trim().split(/\s+/).slice(0, 8).join(' ') || 'Project Quotation';
  }

  private roundMoney(value: number, currency: 'INR' | 'USD'): number {
    const unit = currency === 'INR' ? 100 : 10;
    return Math.max(unit, Math.round(value / unit) * unit);
  }
}
