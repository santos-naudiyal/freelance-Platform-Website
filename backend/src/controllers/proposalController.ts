import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const submitProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid || req.user?.role !== 'freelancer') {
      res.status(403).json({ error: 'Only freelancers can submit proposals' });
      return;
    }

    const { projectId, bidAmount, coverLetter, deliveryTime } = req.body;

    // Check if project exists and is open
    const projectDoc = await db.collection('Projects').doc(projectId).get();
    if (!projectDoc.exists) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    
    if (projectDoc.data()?.status !== 'open') {
      res.status(400).json({ error: 'Project is no longer open for bidding' });
      return;
    }

    // Check if freelancer already submitted a proposal
    const existingProposals = await db.collection('Proposals')
      .where('projectId', '==', projectId)
      .where('freelancerId', '==', uid)
      .get();

    if (!existingProposals.empty) {
      res.status(400).json({ error: 'You have already submitted a proposal for this project' });
      return;
    }

    const proposalId = uuidv4();
    const proposalData = {
      id: proposalId,
      projectId,
      freelancerId: uid,
      bidAmount,
      coverLetter,
      deliveryTime,
      status: 'pending',
      createdAt: Date.now(),
    };

    await db.collection('Proposals').doc(proposalId).set(proposalData);

    res.status(201).json({ message: 'Proposal submitted successfully', data: proposalData });
  } catch (error: any) {
    console.error('Submit Proposal Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectProposals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const projectId = req.params.projectId as string;

    const projectDoc = await db.collection('Projects').doc(projectId).get();
    if (!projectDoc.exists) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Only project owner (client) can see all proposals
    if (projectDoc.data()?.clientId !== uid) {
      res.status(403).json({ error: 'You are not authorized to view these proposals' });
      return;
    }

    const snapshot = await db.collection('Proposals').where('projectId', '==', projectId).get();
    const proposals = snapshot.docs.map((doc: any) => doc.data());

    res.status(200).json(proposals);
  } catch (error: any) {
    console.error('Get Proposals Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProposalStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const proposalId = req.params.id as string;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!uid || req.user?.role !== 'client') {
      res.status(403).json({ error: 'Only clients can accept/reject proposals' });
      return;
    }

    const proposalRef = db.collection('Proposals').doc(proposalId);
    const proposalDoc = await proposalRef.get();

    if (!proposalDoc.exists) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    const projectId = proposalDoc.data()?.projectId;
    const projectDoc = await db.collection('Projects').doc(projectId).get();

    if (projectDoc.data()?.clientId !== uid) {
      res.status(403).json({ error: 'You are not the owner of this project' });
      return;
    }

    await proposalRef.update({ status });

    // ✨ If proposal is accepted, transition project status to 'in_progress'
    if (status === 'accepted') {
        const projectRef = db.collection('Projects').doc(projectId);
        await projectRef.update({ status: 'in_progress' });
        console.log(`🚀 Project ${projectId} transitioned to 'in_progress' as proposal ${proposalId} was accepted.`);
    }

    res.status(200).json({ message: `Proposal ${status}`, status });
  } catch (error: any) {
    console.error('Update Proposal Status Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProposals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const snapshot = await db.collection('Proposals').where('freelancerId', '==', uid).get();
    const proposals = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    const projectIds = Array.from(new Set(proposals.map(p => p.projectId)));
    if (projectIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Fetch titles for these projects in chunks of 10 (Firebase limitation for 'in' query)
    let projects: any[] = [];
    for (let i = 0; i < projectIds.length; i += 10) {
      const chunk = projectIds.slice(i, i + 10);
      const projectSnapshot = await db.collection('Projects').where('id', 'in', chunk).get();
      projects = [...projects, ...projectSnapshot.docs.map(doc => doc.data())];
    }

    const richProposals = proposals.map(p => {
      const project = projects.find(proj => proj.id === p.projectId);
      return {
        ...p,
        projectTitle: project?.title || 'Unknown Project'
      };
    });

    res.status(200).json(richProposals);
  } catch (error: any) {
    console.error('Get User Proposals Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClientProposals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid || req.user?.role !== 'client') {
      res.status(403).json({ error: 'Only clients can view all incoming proposals' });
      return;
    }

    // 1. Fetch Client's Projects to get their IDs
    const projectSnapshot = await db.collection('Projects').where('clientId', '==', uid).get();
    const projects = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
    const projectIds = projects.map(p => p.id);

    if (projectIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    // 2. Query proposals matching the client's projects
    // We break into chunks of 10 if necessary, but Firebase accepts 'in' up to 10.
    // To handle an arbitrary number of projects, we iterate chunks of 10.
    let allProposals: any[] = [];
    const chunkSize = 10;
    
    for (let i = 0; i < projectIds.length; i += chunkSize) {
      const chunk = projectIds.slice(i, i + chunkSize);
      const proposalSnapshot = await db.collection('Proposals')
        .where('projectId', 'in', chunk)
        .get();
        
      const batch = proposalSnapshot.docs.map(doc => {
        const data = doc.data();
        const project = projects.find(p => p.id === data.projectId);
        return { 
          id: doc.id, 
          ...data, 
          projectTitle: project?.title || 'Unknown Project' 
        };
      });
      allProposals = [...allProposals, ...batch];
    }

    // Sort the final combined array
    allProposals.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(allProposals);
  } catch (error: any) {
    console.error('Get Client Proposals Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProposalById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const { id } = req.params as { id: string };

    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const proposalDoc = await db.collection('Proposals').doc(id).get();
    if (!proposalDoc.exists) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    const proposal = proposalDoc.data()!;
    proposal.id = proposalDoc.id;

    // Fetch related project
    const projectDoc = await db.collection('Projects').doc(proposal.projectId).get();
    let projectData = null;
    if (projectDoc.exists) {
      projectData = projectDoc.data();
      proposal.projectTitle = projectData?.title;
    }

    // Authorization check: User must be either the freelancer or the client who owns the project
    if (proposal.freelancerId !== uid && projectData?.clientId !== uid) {
      res.status(403).json({ error: 'You are not authorized to view this proposal' });
      return;
    }

    res.status(200).json(proposal);
  } catch (error: any) {
    console.error('Get Proposal By ID Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

