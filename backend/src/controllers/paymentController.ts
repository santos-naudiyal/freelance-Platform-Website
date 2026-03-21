import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../config/firebase';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, projectId, milestoneId } = req.body;
    const userId = (req as any).user.uid;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        projectId,
        milestoneId,
        clientId: userId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Record payment in Firestore
      await db.collection('Payments').add({
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        projectId: paymentIntent.metadata.projectId,
        clientId: paymentIntent.metadata.clientId,
        status: 'escrowed',
        createdAt: Date.now(),
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const role = (req as any).user.role;

    let snapshot;
    if (role === 'client') {
      snapshot = await db.collection('Payments').where('clientId', '==', userId).orderBy('createdAt', 'desc').get();
    } else {
      snapshot = await db.collection('Payments').where('freelancerId', '==', userId).orderBy('createdAt', 'desc').get();
    }

    const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
