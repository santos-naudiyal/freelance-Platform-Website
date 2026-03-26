import { FreelancerRepository } from '../repositories/FreelancerRepository';
import { AIService } from './aiService';

export class MatchingService {
  private freelancerRepository: FreelancerRepository;
  private aiService: AIService;

  constructor() {
    this.freelancerRepository = new FreelancerRepository();
    this.aiService = new AIService();
  }

  async matchFreelancers(outcome: string): Promise<any[]> {
    try {
      console.log("🚀 Matching freelancers for:", outcome);

      // 1. Fetch freelancers
      const freelancers = await this.freelancerRepository.getAllAvailable();

      if (!freelancers.length) {
        console.warn("⚠️ No freelancers available");
        return [];
      }

      let matches: any[] = [];

      // 2. Try AI matching
      try {
        matches = await this.aiService.matchExperts(outcome, freelancers);
      } catch (err) {
        console.error("❌ AI matching failed:", err);
        matches = [];
      }

      // ✅ Fallback if AI fails
      if (!Array.isArray(matches) || matches.length === 0) {
        console.warn("⚠️ Using fallback matching");

        matches = freelancers.map(f => ({
          id: f.id,
          match: 70,
          reason: "Default matching (AI unavailable)"
        }));
      }

      const availableIds = new Set(freelancers.map(f => f.id));

      // 3. Update scores in parallel (FAST)
      await Promise.all(
        matches.map(async (match) => {
          if (match.id && availableIds.has(match.id)) {
            try {
              await this.freelancerRepository.updateScores(match.id, {
                skillScore: match.match || 0,
                completionRate: 95,
                responseTime: 1.5
              });
            } catch (err) {
              console.error(`Score update failed for ${match.id}`, err);
            }
          }
        })
      );

      // 4. Hydrate results
      const hydratedMatches = matches
        .filter((m: any) => availableIds.has(m.id))
        .map((m: any) => {
          const realFreelancer = freelancers.find(f => f.id === m.id);

          return {
            id: m.id,
            name: realFreelancer?.name || 'Unknown Freelancer',
            role: realFreelancer?.profile?.title || 'Freelancer',
            match: m.match || 0,
            reason: m.reason || "No reason provided",
            rate: `$${realFreelancer?.profile?.hourlyRate || 0}/hr`,
            avatar:
              realFreelancer?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${realFreelancer?.name || 'Fallback'}`
          };
        });

      console.log("✅ Matching complete:", hydratedMatches.length);

      return hydratedMatches;

    } catch (err) {
      console.error("❌ matchFreelancers failed:", err);
      return [];
    }
  }
}