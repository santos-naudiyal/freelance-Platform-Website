import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../config/firebase';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export const generatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome } = req.body;
    if (!outcome) {
      return res.status(400).json({ error: 'Project outcome is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an expert AI project manager. Given the project outcome: "${outcome}", generate a structured milestone plan.
    Return ONLY a valid JSON array of milestones. Each milestone must have this structure:
    {
      "id": "m1",
      "title": "Milestone Title",
      "description": "Brief description of the milestone",
      "tasks": [
        { "id": "t1", "title": "Task Title", "duration": "e.g., 2 days", "role": "e.g., Backend Engineer" }
      ]
    }
    Generate 3-5 milestones. Ensure output is STRICTLY parseable JSON format. Do not use markdown backticks in the response.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from Gemini response
    const cleanJson = responseText.replace(/```json\n?|```\n?/g, '').trim();
    const plan = JSON.parse(cleanJson);

    // Also generate timeline and cost estimates
    const analysisPrompt = `Given the project outcome: "${outcome}", provide a JSON object with:
    {
      "timeline": "e.g., 4-6 Weeks",
      "investment": "e.g., $2000-$3500",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
    Return ONLY valid JSON.`;
    
    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text().replace(/```json\n?|```\n?/g, '').trim();
    const analysis = JSON.parse(analysisText);

    res.json({ plan, analysis });
  } catch (error: any) {
    console.error('AI Plan Error:', error);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
};

export const analyzeRisk = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget, skillsRequired } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a project risk analyst. Analyze this freelance project:
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
    Do not use markdown backticks. Return valid JSON only.`;

    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```json\n?|```\n?/g, '').trim();
    const analysis = JSON.parse(cleanJson);

    res.json(analysis);
  } catch (error: any) {
    console.error('AI Risk Error:', error);
    res.status(500).json({ error: 'Failed to analyze risk' });
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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an elite talent matcher. Given the project outcome: "${outcome}", 
    select the top 3 best matching freelancers from this list:
    ${freelancerContext}

    Return ONLY a valid JSON array of the top matches, with this structure:
    [
      {
        "id": "freelancer_id",
        "name": "freelancer_name",
        "role": "Suggested role / Title",
        "match": 95.5, // Match percentage
        "reason": "Why this person is a perfect fit",
        "rate": "$85/hr",
        "avatar": "freelancer_avatar_url or generate one like https://api.dicebear.com/7.x/avataaars/svg?seed=name"
      }
    ]
    Do not use markdown block backticks.`;

    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```json\n?|```\n?/g, '').trim();
    const matches = JSON.parse(cleanJson);

    res.json({ experts: matches });
  } catch (error: any) {
    console.error('AI Match Error:', error);
    res.status(500).json({ error: 'Failed to match experts' });
  }
};

export const chatCopilot = async (req: AuthRequest, res: Response) => {
  try {
    const { message, context } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a Freelance Platform AI Co-pilot helping manage a workspace.
    Workspace Context: ${context || 'General conversation'}
    User Message: ${message}
    
    Provide a helpful, precise, and professional response. Keep it under 3 sentences.`;

    const result = await model.generateContent(prompt);
    
    res.json({ reply: result.response.text().trim() });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate chat reply' });
  }
};
