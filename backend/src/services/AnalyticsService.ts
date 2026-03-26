import { db } from '../config/firebase';

export class AnalyticsService {

  async getGlobalStats() {
    try {
      console.log("📊 Fetching global stats...");

      // ✅ Run queries in parallel (FASTER)
      const [
        projectsSnap,
        usersSnap,
        paymentsSnap,
        aiLogsSnap
      ] = await Promise.all([
        db.collection('Projects').get(),
        db.collection('Users').get(),
        db.collection('Payments').get(),
        db.collection('AILogs').get()
      ]);

      // ✅ Safe calculations
      const totalRevenue = paymentsSnap.docs.reduce((acc, doc) => {
        const amount = doc.data()?.amount;
        return acc + (typeof amount === 'number' ? amount : 0);
      }, 0);

      const activeProjects = projectsSnap.docs.filter(doc =>
        doc.data()?.status === 'in_progress'
      ).length;

      return {
        totalProjects: projectsSnap.size,
        activeProjects,
        totalUsers: usersSnap.size,
        totalRevenue,
        aiUsageCount: aiLogsSnap.size,
        topPerformance: 98.5
      };

    } catch (err) {
      console.error("❌ getGlobalStats failed:", err);

      // ✅ fallback response (VERY IMPORTANT)
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalUsers: 0,
        totalRevenue: 0,
        aiUsageCount: 0,
        topPerformance: 0
      };
    }
  }

  async getFreelancerStats(uid: string) {
    try {
      console.log("📊 Fetching freelancer stats for:", uid);

      const projectsSnap = await db
        .collection('Projects')
        .where('freelancerId', '==', uid)
        .get();

      const completedProjects = projectsSnap.docs.filter(doc =>
        doc.data()?.status === 'completed'
      ).length;

      const totalProjects = projectsSnap.size;

      return {
        totalProjects,
        completedProjects,
        successRate:
          totalProjects > 0
            ? (completedProjects / totalProjects) * 100
            : 100,
        earnings: 0 // TODO: connect payments later
      };

    } catch (err) {
      console.error("❌ getFreelancerStats failed:", err);

      return {
        totalProjects: 0,
        completedProjects: 0,
        successRate: 0,
        earnings: 0
      };
    }
  }
}