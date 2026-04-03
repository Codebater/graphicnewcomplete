import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { finalizeConsultationFromSessionId } from '@/lib/consultation-payment';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: import('stripe').Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('Stripe webhook signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session;
    const sessionId = session.id;
    try {
      await finalizeConsultationFromSessionId(sessionId);
    } catch (e) {
      console.error('Webhook consultation finalize:', e);
      return NextResponse.json({ received: true, error: 'Finalize failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
