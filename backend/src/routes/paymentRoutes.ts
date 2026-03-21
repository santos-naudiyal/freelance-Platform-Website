import { Router } from 'express';
import { createPaymentIntent, handleWebhook, getUserPayments } from '../controllers/paymentController';
import { requireAuth } from '../middleware/auth';
import express from 'express';

const router = Router();

// Endpoint for the client to initiate payment
router.post('/create-intent', requireAuth, createPaymentIntent);

// Get user payment history
router.get('/my', requireAuth, getUserPayments);

// Webhook endpoint (must be raw body for Stripe signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
