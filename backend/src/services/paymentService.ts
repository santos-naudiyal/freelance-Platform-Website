import Stripe from 'stripe';
import { db } from '../config/firebase';
import { MilestoneRepository } from '../repositories/MilestoneRepository';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export class PaymentService {
  private milestoneRepository: MilestoneRepository;

  constructor() {
    this.milestoneRepository = new MilestoneRepository();
  }

  async createEscrowPayment(clientId: string, projectId: string, milestoneId: string, amount: number) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        projectId,
        milestoneId,
        clientId,
      },
      capture_method: 'manual', // Hold the funds
    });

    return paymentIntent.client_secret;
  }

  async releaseMilestone(milestoneId: string): Promise<void> {
    const milestone = await this.milestoneRepository.getById(milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    // In a real app, you would call stripe.paymentIntents.capture(paymentIntentId)
    // For this demo, we update the status in Firestore
    await this.milestoneRepository.update(milestoneId, {
      status: 'released',
      releaseDate: Date.now()
    });

    console.log(`Payment released for milestone: ${milestoneId}`);
  }
}
