import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { callBackend } from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  projectId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  projectId: string;
  onSuccess: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Fund Escrow
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Securely fund the project. Your payment is held in escrow and released only upon completion.
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            projectId={projectId}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}

function CheckoutForm({
  amount,
  projectId,
  onSuccess,
}: {
  amount: number;
  projectId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const res = await callBackend('payments/create-intent', 'POST', {
        amount,
        projectId,
        milestoneId: 'initial',
      });

      const clientSecret = res.clientSecret;

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'requires_capture') {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#64748b',
                '::placeholder': { color: '#94a3b8' },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium border border-rose-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold tracking-widest uppercase text-xs hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 flexItems-center justify-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} /> Processing...
          </span>
        ) : (
          `Pay $${amount.toLocaleString()}`
        )}
      </button>
    </form>
  );
}
