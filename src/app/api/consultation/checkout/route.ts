import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import ConsultationBooking from '@/models/ConsultationBooking';
import { getStripe, CONSULTATION_UNIT_AMOUNT_CENTS, CONSULTATION_CURRENCY } from '@/lib/stripe';

export const runtime = 'nodejs';

const bodySchema = z.object({
  service: z.enum(['consultation', 'web-design', 'branding', 'ui-ux']),
  date: z.string().min(1).max(32),
  time: z.string().min(1).max(16),
  name: z.string().min(1).max(200),
  company: z.string().max(200).optional().default(''),
  email: z.string().email().max(320),
  phone: z.string().max(80).optional().default(''),
  message: z.string().min(1).max(8000),
  budget: z.string().max(120).optional().default(''),
});

function appUrl() {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (u) return u;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    await connectDB();

    const booking = await ConsultationBooking.create({
      service: data.service,
      date: data.date,
      time: data.time,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      message: data.message,
      budget: data.budget,
      status: 'pending_payment',
    });

    const stripe = getStripe();
    const origin = appUrl();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: data.email,
      client_reference_id: booking.id.toString(),
      metadata: {
        consultationId: booking.id.toString(),
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CONSULTATION_CURRENCY,
            unit_amount: CONSULTATION_UNIT_AMOUNT_CENTS,
            product_data: {
              name: 'Consultation — GRAPHIQ STUDIO LLC',
              description: 'Paid consultation booking (scheduling request)',
            },
          },
        },
      ],
      success_url: `${origin}/contact?consultation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/contact?consultation=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('consultation checkout:', e);
    const raw = e instanceof Error ? e.message : String(e);
    const lower = raw.toLowerCase();
    const isMongoAuth =
      lower.includes('bad auth') ||
      lower.includes('authentication failed') ||
      (lower.includes('mongo') && lower.includes('auth'));
    let clientMessage = 'Something went wrong starting checkout. Please try again.';
    if (isMongoAuth) {
      clientMessage =
        'Checkout is temporarily unavailable. Please try again later or email hello@graphiq.art.';
    } else if (raw.includes('STRIPE_SECRET_KEY') || raw.includes('Missing STRIPE')) {
      clientMessage = 'Checkout is temporarily unavailable. Please try again later.';
    } else if (raw.length < 100 && !lower.includes('mongodb')) {
      clientMessage = raw;
    }
    return NextResponse.json({ error: clientMessage }, { status: 500 });
  }
}
