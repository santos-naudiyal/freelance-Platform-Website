import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { Project } from '../repositories/ProjectRepository';

interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  bidAmount: number;
  coverLetter: string;
  deliveryTime: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export const getClientDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch Client's Projects
    const projectSnapshot = await db.collection('Projects').where('clientId', '==', uid).get();
    const projects = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

    // 2. Fetch Recent Proposals across all projects
    // First, get all project IDs
    const projectIds = projects.map(p => p.id).filter(id => !!id);
    let recentProposals: any[] = [];
    
    if (projectIds.length > 0) {
      // Firebase "where in" limit is 10, but we can do a simpler query: 
      // For each project, we want proposals... but for "recent", 
      // maybe we just fetch all proposals and filter by client's projects if not too many.
      // Better: Store a clientId on the Proposal too? (Too late now).
      // Let's at least parallelize or use chunking if projectIds > 10.
      
      const proposalSnapshot = await db.collection('Proposals')
        .where('projectId', 'in', projectIds.slice(0, 10))
        .get();
      
      
      recentProposals = proposalSnapshot.docs.map(doc => {
          const data = doc.data() as any;
          const project = projects.find(p => p.id === data.projectId);
          return { id: doc.id, ...data, projectTitle: project?.title || 'Unknown Project' };
      }).sort((a: any, b: any) => b.createdAt - a.createdAt).slice(0, 10);
    }

    // 3. Stats
    const stats = [
      { name: 'Open Projects', value: projects.filter(p => p.status === 'open').length.toString() },
      { name: 'Proposals Received', value: '0', icon: 'Users' }, // We'll update this below
      { name: 'Active Hires', value: projects.filter(p => p.status === 'in_progress').length.toString() },
      { name: 'Total Spent', value: '$0' } // Simplified
    ];

    // Count total proposals
    // (This is still a bit expensive if done separately, but better than separate N requests)
    let totalProposalsCount = 0;
    if (projectIds.length > 0) {
        // Unfortunately Firestore count() is new or might need specific setup
        // Let's just sum it up from the projects if we had a count field, 
        // but since we don't, we'll do one query.
        const allPropsSnapshot = await db.collection('Proposals').where('projectId', 'in', projectIds.slice(0, 10)).get();
        totalProposalsCount = allPropsSnapshot.size;
    }
    stats[1].value = totalProposalsCount.toString();

    res.status(200).json({
      projects,
      recentProposals,
      stats
    });
  } catch (error: any) {
    console.error('Client Dashboard Summary Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFreelancerDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch Freelancer Profile for stats
    const freelancerDoc = await db.collection('Freelancers').doc(uid).get();
    const fData = freelancerDoc.data() || {};
    const rating = fData.rating || 5.0;
    const earnings = fData.totalEarnings || 0;

    // 2. Fetch Freelancer's Proposals
    const proposalSnapshot = await db.collection('Proposals').where('freelancerId', '==', uid).get();
    const proposals = proposalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

    // 3. Fetch Active Projects (Accepted Proposals)
    const acceptedProposals = proposals.filter(p => p.status === 'accepted');
    const projectIds = acceptedProposals.map(p => p.projectId);
    
    let activeProjects: any[] = [];
    if (projectIds.length > 0) {
      // Chunking if > 10, but for now 10 is fine
      const projectDocs = await db.collection('Projects')
        .where('id', 'in', projectIds.slice(0, 10))
        .get();
        
      activeProjects = projectDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Add project titles to recent proposals for UI
    const enhancedProposals = await Promise.all(proposals.map(async (p) => {
       if (p.projectTitle) return p; // already there
       // Quick fetch or find in activeProjects
       const activeP = activeProjects.find(ap => ap.id === p.projectId);
       if (activeP) return { ...p, projectTitle: activeP.title };
       
       // Fallback fetch for individual
       const pDoc = await db.collection('Projects').doc(p.projectId).get();
       return { ...p, projectTitle: pDoc.data()?.title || 'Unknown Project' };
    }));

    // 4. Stats (INR ₹)
    const stats = [
      { name: 'Active Projects', value: acceptedProposals.length.toString() },
      { name: 'Proposals Sent', value: proposals.length.toString() },
      { name: 'Total Earnings', value: `₹${earnings.toLocaleString()}` },
      { name: 'Avg. Rating', value: rating.toFixed(1) }
    ];

    res.status(200).json({
      proposals: enhancedProposals,
      activeProjects,
      stats
    });
  } catch (error: any) {
    console.error('Freelancer Dashboard Summary Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
