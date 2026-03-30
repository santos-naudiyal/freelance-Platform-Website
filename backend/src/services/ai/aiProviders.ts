import OpenAI from 'openai';
import { logger } from '../../utils/logger';

export class AIProvider {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.error('OPENAI_API_KEY is missing');
      throw new Error('Missing OpenAI API Key');
    }
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Cleans Markdown formatting from JSON output.
   */
  public cleanJSON(content: string): string {
    return content.replace(/```json/g, '').replace(/```/g, '').trim();
  }

  /**
   * Generic text generation request.
   */
  public async generateText(model: string, systemPrompt: string, userContent: string, requireJson = false): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        response_format: requireJson ? { type: "json_object" } : undefined
      });

      return completion.choices[0].message.content || '';
    } catch (error: any) {
      logger.error(error, `Provider Failed to generate text for model ${model}`);
      throw error;
    }
  }

  /**
   * Generate constrained JSON structural data
   */
  public async generateJSON<T>(model: string, systemPrompt: string, userContent: string): Promise<T> {
    const content = await this.generateText(model, systemPrompt, userContent, false); // Keep false for legacy models without response_format strict guarantee
    try {
      const cleaned = this.cleanJSON(content);
      return JSON.parse(cleaned) as T;
    } catch (err: any) {
      logger.error({ content, error: err.message }, 'Failed to parse AI JSON response');
      throw new Error('Invalid JSON from AI');
    }
  }
}
