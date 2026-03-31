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
    system: "You are an expert freelance project estimator. Analyze the given project and generate a complete professional quotation. Return ONLY valid JSON.",
    buildUserPrompt: (outcome: string) => `
Analyze the following project and generate a complete professional quotation.

The quotation must be realistic, market-aligned, and applicable across different industries such as technology, finance, design, and marketing.

Provide the response strictly in structured JSON format and include the following:

1. A clear summary explaining the project and its complexity level (Low, Medium, High) along with a confidence score (0-100).
2. A pricing section with currency (INR), minimum price, maximum price, and recommended price based on real-world market rates.
3. A timeline estimate including minimum days, maximum days, and recommended duration.
4. A detailed task breakdown where each task includes name, short description, estimated hours, and cost.
5. A list of required skills relevant to the project.
6. A risk analysis section mentioning possible risks and their mitigation strategies.
7. Market insights including average market price, demand level, and competition level.
8. Three pricing options: Basic, Standard, and Premium (each with price and features).

Ensure:
- Prices are not underestimated and in INR.
- Output is clean JSON (no extra explanation).
- Works for any type of freelance project.
- Maintain professional and practical tone.

Project details:
"${outcome}"

Return JSON in this EXACT format:
{
  "summary": { "text": "...", "complexity": "Low/Medium/High", "confidenceScore": 85 },
  "pricing": { "currency": "INR", "min": 50000, "max": 150000, "recommended": 120000 },
  "timeline": { "minDays": 15, "maxDays": 45, "recommended": "30 days" },
  "tasks": [ { "name": "...", "description": "...", "hours": 10, "cost": 5000 } ],
  "skills": ["Skill 1", "Skill 2"],
  "risks": [ { "risk": "...", "mitigation": "..." } ],
  "marketInsights": { "avgPrice": "INR X to Y", "demand": "High", "competition": "Medium" },
  "pricingOptions": {
    "basic": { "price": 50000, "features": ["Feature 1"] },
    "standard": { "price": 100000, "features": ["Feature A"] },
    "premium": { "price": 150000, "features": ["Adv Feature"] }
  },
  "projectTitle": "Clear, professional name"
}
`
  }
};
