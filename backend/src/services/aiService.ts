import OpenAI from 'openai';
import { db } from '../config/firebase';

const aiCache = new Map<string, any>();

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

export class AIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("❌ OPENAI KEY MISSING");
      throw new Error("Missing OpenAI API Key");
    }

    this.openai = new OpenAI({ apiKey });
  }

  // ================= COMMON CLEANER =================
  private cleanJSON(content: string) {
    return content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  }

  // ================= CREDIT =================
  async checkAndDeductCredits(userId: string, amount: number = 1): Promise<boolean> {
    const userRef = db.collection('Users').doc(userId);
    const userDoc = await userRef.get();

    let credits = userDoc.exists ? (userDoc.data()?.aiCredits ?? 10) : 0;

    if (userDoc.exists && userDoc.data()?.aiCredits === undefined) {
      await userRef.update({ aiCredits: 10 });
    }

    if (credits < amount) return false;

    await userRef.update({
      aiCredits: credits - amount
    });

    return true;
  }

  // ================= PROJECT PLAN =================
  async generateProjectPlan(outcome: string): Promise<AIProjectPlan> {
    const cacheKey = outcome.trim().toLowerCase();

    if (aiCache.has(cacheKey)) {
      return aiCache.get(cacheKey);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      console.log("🚀 AI generateProjectPlan called");

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "You are an elite technical architect. Return ONLY valid JSON."
          },
          {
            role: "user",
            content: `
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
    "skills": ["Flutter", "Backend"]
  }
}

STRICT RULES:
- Do NOT change field names
- Do NOT return step/details format
- Do NOT add extra text
- ONLY return JSON
`
          }
        ]
      }, {
        signal: controller.signal as any
      });

      const content = completion?.choices?.[0]?.message?.content;

      console.log("📥 RAW AI RESPONSE:", content);

      if (!content) throw new Error("Empty AI response");

      let result;

      try {
        const cleaned = this.cleanJSON(content);
        result = JSON.parse(cleaned);
      } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);
        throw new Error("Invalid JSON from AI");
      }

      aiCache.set(cacheKey, result);

      db.collection('AILogs').add({
        projectId: 'PENDING_INIT',
        userId: 'SYSTEM',
        input: outcome,
        output: result,
        timestamp: Date.now()
      }).catch(() => {});

      return result;

    } catch (err: any) {
      console.error("❌ AI FAILED:", err);

      if (err.name === "AbortError") {
        throw new Error("AI timeout");
      }

      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  // ================= RISK =================
  async analyzeRisk(projectDetails: any): Promise<any> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON risk analysis."
        },
        {
          role: "user",
          content: JSON.stringify(projectDetails)
        }
      ]
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(this.cleanJSON(content));
  }

  // ================= CHAT =================
  async chatCopilot(message: string, context?: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Context: ${context || 'General'}`
        },
        {
          role: "user",
          content: message
        }
      ]
    }
  
  
  );

    return completion.choices[0].message.content?.trim() || '';
  }

  // ================= SUMMARY =================
  async summarizeWorkspaceChat(messages: any[]): Promise<string> {
    const context = messages.map(m => `${m.senderName}: ${m.text}`).join('\n');

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize in bullets." },
        { role: "user", content: context }
      ]
    });

    return completion.choices[0].message.content?.trim() || '';
  }

  // ================= TASK EXTRACTION =================
  async extractTasksFromChat(messages: any[]): Promise<any[]> {
    const context = messages.map(m => `${m.senderName}: ${m.text}`).join('\n');

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Return ONLY JSON with tasks array."
        },
        {
          role: "user",
          content: context
        }
      ]
    });

    const content = completion.choices[0].message.content || '{"tasks": []}';
    const result = JSON.parse(this.cleanJSON(content));

    return result.tasks || [];
  }

  // ================= MATCHING =================
  async matchExperts(outcome: string, freelancers: any[]): Promise<any[]> {
    const freelancerContext = freelancers.map(f =>
      `ID:${f.id}, Skills:${f.profile?.skills?.join(', ')}`
    ).join('\n');

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Return ONLY JSON with experts array."
        },
        {
          role: "user",
          content: `${outcome}\n${freelancerContext}`
        }
      ]
    });

    const content = completion.choices[0].message.content || '{"experts":[]}';
    const result = JSON.parse(this.cleanJSON(content));

    return result.experts || [];
  }

  // ================= INSIGHTS =================
  async getAIProjectManagerInsights(projectContext: any): Promise<any> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Return ONLY JSON insights."
        },
        {
          role: "user",
          content: JSON.stringify(projectContext)
        }
      ]
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(this.cleanJSON(content));
  }
}