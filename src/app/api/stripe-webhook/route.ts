import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { LAUNCH_SLOT_ID, bookSlot } from '@/lib/pricing-slot';

export const runtime = 'nodejs';

// Stripe webhook — the reliable path for marking the one-slot 72h launch
// product booked. The success-redirect verify covers the normal flow, but if
// a buyer pays and closes the tab before returning, only this webhook keeps
// the slot from silently re-opening after the reservation expires.
// Register in the Stripe dashboard: checkout.session.completed →
// https://www.graphiq.art/api/stripe-webhook (uses STRIPE_WEBHOOK_SECRET).
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 501 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const payload = await req.text(); // raw body — required for verification
    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as {
        id: string;
        payment_status?: string;
        metadata?: Record<string, string> | null;
      };
      const paid =
        session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
      if (paid && session.metadata?.plan === 'launch-72h') {
        await bookSlot(session.id, LAUNCH_SLOT_ID);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('stripe webhook:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
}
