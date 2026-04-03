import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    });
  }
  return stripe;
}

export const CONSULTATION_UNIT_AMOUNT_CENTS = 30_000;
export const CONSULTATION_CURRENCY = 'usd';
