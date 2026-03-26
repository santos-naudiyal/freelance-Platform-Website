import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { InvitationRepository } from '../repositories/InvitationRepository';
import { db } from '../config/firebase';

const invitationRepository = new InvitationRepository();

export const sendInvite = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, freelancerId, role } = req.body;
    const senderId = req.user?.uid;

    if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

    const inviteId = `invite-${Date.now()}`;
    const invite = {
      id: inviteId,
      projectId,
      freelancerId,
      senderId,
      status: 'pending',
      role: role || 'contributor',
      createdAt: Date.now()
    };

    await invitationRepository.create(inviteId, invite as any);
    res.status(201).json(invite);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to send invite' });
  }
};

export const respondToInvite = async (req: AuthRequest, res: Response) => {
  try {
    const { inviteId, status } = req.body;
    const freelancerId = req.user?.uid;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const invite = await invitationRepository.getById(inviteId);
    if (!invite || invite.freelancerId !== freelancerId) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    await invitationRepository.update(inviteId, { status } as any);

    if (status === 'accepted') {
      // Add freelancer to workspace/project
      await db.collection('Projects').doc(invite.projectId).update({
        freelancerId: invite.freelancerId
      });
    }

    res.json({ message: `Invite ${status}` });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to respond to invite' });
  }
};
