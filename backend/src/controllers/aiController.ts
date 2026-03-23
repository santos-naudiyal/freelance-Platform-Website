import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import OpenAI from 'openai';
import { db } from '../config/firebase';

let openai: OpenAI | null = null;

const getOpenAI = () => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      throw new Error('OPENAI_API_KEY is not defined or is still the placeholder in environment variables');
    }
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
};

export const generatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome } = req.body;
    if (!outcome) {
      return res.status(400).json({ error: 'Project outcome is required' });
    }

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert AI project manager. Generate a structured milestone plan and project analysis in JSON format."
        },
        {
          role: "user",
          content: `Given the project outcome: "${outcome}", generate a structured milestone plan.
          Return ONLY a valid JSON object with two keys: "plan" (array of milestones) and "analysis" (object with timeline, investment, and skills).
          
          Milestone structure:
          {
            "id": "m1",
            "title": "Milestone Title",
            "description": "Brief description of the milestone",
            "tasks": [
              { "id": "t1", "title": "Task Title", "duration": "e.g., 2 days", "role": "e.g., Backend Engineer" }
            ]
          }
          
          Analysis structure:
          {
            "timeline": "e.g., 4-6 Weeks",
            "investment": "e.g., $2000-$3500",
            "skills": ["Skill 1", "Skill 2", "Skill 3"]
          }

          Generate 3-5 milestones. Ensure output is STRICTLY parseable JSON format. Do not use markdown backticks.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content || '{}';
    const result = JSON.parse(responseText);

    res.json({ plan: result.plan, analysis: result.analysis });
  } catch (error: any) {
    console.error('AI Plan Error:', error);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
};

export const analyzeRisk = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget, skillsRequired } = req.body;
    
    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a project risk analyst. Analyze the provided project details and return a risk assessment in JSON format."
        },
        {
          role: "user",
          content: `Analyze this freelance project:
          Title: ${title}
          Description: ${description}
          Budget: ${budget?.amount || 'Flexible'}
          Skills: ${skillsRequired?.join(', ') || 'Various'}

          Return ONLY a valid JSON object matching this structure:
          {
            "risks": [
              { "title": "Timeline Confidence", "score": 85, "status": "Healthy", "color": "text-emerald-500" },
              { "title": "Budget Allocation", "score": 70, "status": "Moderate", "color": "text-amber-500" },
              { "title": "Expert Availability", "score": 90, "status": "Optimized", "color": "text-primary-500" }
            ],
            "bottleneck": {
              "title": "Potential Bottleneck Detected",
              "message": "Specific warning based on the project description."
            },
            "costOptimization": {
              "title": "Save up to 15%",
              "message": "Suggestion to save cost."
            },
            "speedBoost": {
              "title": "Accelerate by X Days",
              "message": "Suggestion to speed up delivery."
            }
          }
          Do not use markdown backticks. Return valid JSON only.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    res.json(analysis);
  } catch (error: any) {
    console.error('AI Risk Error (Full):', error);
    res.status(500).json({ error: error.message || 'Failed to analyze risk' });
  }
};

export const matchExperts = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome } = req.body;

    // Fetch up to 10 freelancers from production DB to evaluate
    const snapshot = await db.collection('Experts').limit(10).get(); 
    // If empty experts collections, fallback to users where role=freelancer
    let freelancers: any[] = [];
    if (!snapshot.empty) {
        freelancers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        const usersSnap = await db.collection('Users').where('role', '==', 'freelancer').limit(10).get();
        freelancers = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    if (freelancers.length === 0) {
      return res.json({ experts: [] });
    }

    const freelancerContext = freelancers.map(f => 
      `ID: ${f.id}, Name: ${f.name}, Skills: ${f.profile?.skills?.join(', ')}, Title: ${f.profile?.title}`
    ).join('\n');

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an elite talent matcher. Select the best matching freelancers for the given project outcome."
        },
        {
          role: "user",
          content: `Given the project outcome: "${outcome}", 
          select the top 3 best matching freelancers from this list:
          ${freelancerContext}

          Return ONLY a valid JSON array of the top matches, wrap it in a JSON object with key "experts":
          {
            "experts": [
              {
                "id": "freelancer_id",
                "name": "freelancer_name",
                "role": "Suggested role / Title",
                "match": 95.5,
                "reason": "Why this person is a perfect fit",
                "rate": "$85/hr",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=name"
              }
            ]
          }
          Do not use markdown block backticks.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"experts":[]}');
    res.json({ experts: result.experts });
  } catch (error: any) {
    console.error('AI Match Error:', error);
    res.status(500).json({ error: 'Failed to match experts' });
  }
};

export const chatCopilot = async (req: AuthRequest, res: Response) => {
  try {
    const { message, context } = req.body;

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Freelance Platform AI Co-pilot helping manage a workspace. 
          Workspace Context: ${context || 'General conversation'}
          Provide a helpful, precise, and professional response. Keep it under 3 sentences.`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({ reply: completion.choices[0].message.content?.trim() || '' });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate chat reply' });
  }
};
