import dotenv from 'dotenv';
dotenv.config();

import { AIService } from './src/services/aiService';

async function test() {
  try {
    const ai = new AIService();
    const result = await ai.generateProjectPlan("Test outcome");
    console.log("SUCCESS:", result);
  } catch (error) {
    console.error("FAILED:", error);
  }
}
test();
