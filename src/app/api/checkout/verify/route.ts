import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { LAUNCH_SLOT_ID, bookSlot } from '@/lib/pricing-slot';

export const runtime = 'nodejs';

// Called from the pricing page after the Stripe success redirect.
// Verifies the checkout session SERVER-SIDE with Stripe (the query param
// alone proves nothing) and, for the one-slot 72h launch product, marks the
// slot permanently booked. Idempotent — safe to call on refresh.
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('session_id');
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
    if (!paid) {
      return NextResponse.json({ ok: false, error: 'Payment not completed' }, { status: 400 });
    }

    const plan = session.metadata?.plan ?? null;
    if (plan === 'launch-72h') {
      await bookSlot(session.id, LAUNCH_SLOT_ID);
    }

    return NextResponse.json({ ok: true, plan });
  } catch (e) {
    console.error('checkout verify:', e);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
