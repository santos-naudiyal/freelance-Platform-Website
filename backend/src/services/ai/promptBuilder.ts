export const Prompts = {
  PROJECT_PLANNER: {
    system: "You are an elite technical architect. Return ONLY valid JSON.",
    buildUserPrompt: (outcome: string) => `
Deconstruct this vision into a structured execution roadmap:

"${outcome}"

Return JSON in this EXACT format:

{
  "plan": [
    {
      "id": "1",
      "title": "Phase name",
      "description": "What happens",
      "tasks": [
        {
          "id": "t1",
          "title": "Task name",
          "duration": "2 days",
          "role": "Developer"
        }
      ]
    }
  ],
  "analysis": {
    "timeline": "X weeks",
    "investment": "range",
    "skills": ["Flutter", "Backend"],
    "description": "Overall brief"
  }
}

STRICT RULES:
- Do NOT change field names
- Do NOT return step/details format
- Do NOT add extra text
- ONLY return JSON
`
  },

  RISK_ANALYZER: {
    system: "Return ONLY valid JSON risk analysis.",
    buildUserPrompt: (projectDetails: any) => JSON.stringify(projectDetails)
  },

  EXPERT_MATCHER: {
    system: "Return ONLY JSON with experts array like: {\"experts\": [\"id1\", \"id2\"]}",
    buildUserPrompt: (outcome: string, freelancers: any[]) => {
      const freelancerContext = freelancers.map(f =>
        `ID:${f.id}, Skills:${f.profile?.skills?.join(', ')}`
      ).join('\n');
      return `${outcome}\n${freelancerContext}`;
    }
  },

  WORKSPACE_INSIGHTS: {
    system: "Return ONLY JSON insights with velocityScore (number), summary (string), alerts (array of {severity, message}), suggestions (array of {action, reason}), and nextBigMove (string).",
    buildUserPrompt: (projectContext: any) => JSON.stringify(projectContext)
  },

  COPILOT_CHAT: {
    buildSystem: (context: string) => `Context: ${context || 'General Professional Assistant'}`,
    buildUserPrompt: (message: string) => message
  },

  PROPOSAL_DRAFTER: {
    system: "You are an expert freelance copywriter aiming to win high-ticket projects. Return ONLY valid JSON.",
    buildUserPrompt: (projectContext: any, freelancerProfile: any) => `
Analyze the following project and the freelancer's profile to generate a highly personalized, compelling proposal draft.

Project Context:
${JSON.stringify(projectContext)}

Freelancer Profile:
${JSON.stringify(freelancerProfile)}

Draft a winning proposal. Do not just summarize skills. Focus on the client's problem, suggest a brief approach, and justify the rate.

Return EXACTLY this JSON structure:
{
  "coverLetter": "The detailed cover letter text...",
  "suggestedRate": 1500,
  "estimatedDuration": "3 weeks",
  "reasoning": "Why this rate and duration makes sense based on the scope and market standard."
}
`
  },

  PRICING_ESTIMATOR: {
    system: "You are a freelance market trend analyst. Return ONLY valid JSON.",
    buildUserPrompt: (projectScope: string) => `
Analyze the following project scope and estimate a fair market budget range for hiring top-tier freelancers.
Consider factors like complexity, duration, and high-demand skills.

Scope:
"${projectScope}"

Return EXACTLY this JSON format:
{
  "minRate": 500,
  "maxRate": 3000,
  "marketConfidence": "High",
  "recommendation": "Brief sentence advising the client on how to budget this.",
  "complexityScore": 8
}
`
  },

  PROJECT_QUOTATION: {
    system: "You are an Elite Solution Architect and Market Analyst. You must generate highly detailed, professional project quotations. Return ONLY valid JSON.",
    buildUserPrompt: (outcome: string) => `
Analyze the following project and generate a complete, structurally deep professional quotation.

CRITICAL INSTRUCTIONS:
1. Identify the domain (e.g., Tech, Finance, Marketing, Legal).
2. For the "architectureFlow", generate a domain-specific structural breakdown. If Tech: Detail the Frontend, Backend, Admin Panel, Database schemas, and functional flows. If Finance: Detail the Ledger mapping, Compliance, Audit Trails, and Payment Flows. DO NOT use generic terms like "Planning". Be extremely deep and technical.
3. For pricing, you MUST provide mathematically sound estimates for BOTH the "indianMarket" (in INR ₹) and "globalMarket" (in USD $).
4. Do not summarize with basic text. Write like a million-dollar consultancy firm.

Project details:
"${outcome}"

Return JSON in this EXACT format:
{
  "projectTitle": "Clear, premium professional name",
  "summary": { 
    "text": "A highly professional executive summary.", 
    "complexity": "Low/Medium/High/Enterprise", 
    "confidenceScore": 95 
  },
  "architectureFlow": [
    {
      "phase": "e.g., Core Systems Architecture",
      "details": "Technical explanation of the database schema, compliance rules, or system logic.",
      "technologies": ["Next.js", "PostgreSQL", "Stripe API"]
    }
  ],
  "pricing": {
    "indianMarket": {
      "currency": "INR",
      "min": 50000,
      "max": 150000,
      "recommended": 120000
    },
    "globalMarket": {
      "currency": "USD",
      "min": 1500,
      "max": 5000,
      "recommended": 3500
    }
  },
  "timeline": { "minDays": 15, "maxDays": 45, "recommended": "30 days" },
  "tasks": [ 
    { "name": "...", "description": "...", "hours": 10, "costINR": 5000, "costUSD": 150 } 
  ],
  "skills": ["Enterprise Architecture", "React", "Audit Compliance"],
  "risks": [ { "risk": "...", "mitigation": "..." } ],
  "marketInsights": { 
    "demand": "High", 
    "competition": "Medium",
    "analysis": "Professional explanation of market trends for this specific domain."
  },
  "pricingOptions": {
    "basic": { "priceINR": 50000, "priceUSD": 1500, "features": ["Core MVP"] },
    "standard": { "priceINR": 100000, "priceUSD": 3000, "features": ["Full Stack Integration"] },
    "premium": { "priceINR": 150000, "priceUSD": 5000, "features": ["Enterprise Security", "Post-Launch Support"] }
  }
}
`
  }
};
