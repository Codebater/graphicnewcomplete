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

function isMongoAuthFailure(e: unknown, message: string): boolean {
  const lower = message.toLowerCase();
  if (lower.includes('bad auth')) return true;
  if (typeof e === 'object' && e !== null && 'name' in e) {
    const name = String((e as { name: unknown }).name);
    if (name === 'MongoServerError' && 'code' in e) {
      const code = (e as { code?: number }).code;
      if (code === 18) return true;
    }
  }
  if (
    lower.includes('authentication failed') &&
    (lower.includes('mongo') || lower.includes('srv') || lower.includes('atlas'))
  ) {
    return true;
  }
  return false;
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
    let failedAt: 'database' | 'stripe' = 'database';

    try {
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

      failedAt = 'stripe';
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
        return NextResponse.json(
          { error: 'Could not start checkout', failedAt: 'stripe' as const },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: session.url });
    } catch (e) {
      const mongoCode =
        e && typeof e === 'object' && e !== null && 'code' in e
          ? String((e as { code: unknown }).code)
          : '';
      console.error('consultation checkout failed', { failedAt, mongoCode: mongoCode || undefined }, e);

      const raw = e instanceof Error ? e.message : String(e);
      const mongoAuth = failedAt === 'database' && isMongoAuthFailure(e, raw);

      let clientMessage = 'Something went wrong starting checkout. Please try again.';
      if (mongoAuth) {
        clientMessage =
          'Database login failed for this site (MongoDB). The password or connection string in Vercel env MONGODB_URI is wrong, or the user was deleted. Fix MONGODB_URI and redeploy.';
      } else if (failedAt === 'stripe' && (raw.includes('STRIPE_SECRET_KEY') || raw.includes('api_key'))) {
        clientMessage =
          'Stripe is not configured correctly (check STRIPE_SECRET_KEY on Vercel and redeploy).';
      } else if (failedAt === 'stripe') {
        clientMessage = `Payment setup error: ${raw.length < 180 ? raw : 'Check Stripe dashboard and logs.'}`;
      } else if (failedAt === 'database' && raw.length < 180) {
        clientMessage = raw;
      }

      const debug =
        process.env.CONSULTATION_CHECKOUT_DEBUG === '1'
          ? { rawError: raw.slice(0, 400), mongoCode: mongoCode || undefined }
          : undefined;

      return NextResponse.json(
        { error: clientMessage, failedAt, ...(debug && { debug }) },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error('consultation checkout (outer):', e);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
