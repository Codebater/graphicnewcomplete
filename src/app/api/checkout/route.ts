import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

type PlanConfig = {
  name: string;
  description: string;
  amountCents: number;
  mode: 'payment' | 'subscription';
  interval?: 'month' | 'year';
};

// Server-side source of truth for prices. Amounts are USD cents and already
// include the +10% over the reference figures.
const PLANS: Record<string, PlanConfig> = {
  hosting: {
    name: 'Hosting & Domain Caring',
    description: 'Managed hosting, domains, SSL, backups, uptime monitoring & 24/7 support.',
    amountCents: 15_000, // $150 / month
    mode: 'subscription',
    interval: 'month',
  },
  seo: {
    name: 'SEO Growth Retainer',
    description: 'Ongoing SEO: strategy, on-page, technical fixes, content & monthly reporting.',
    amountCents: 35_000, // $350 / month
    mode: 'subscription',
    interval: 'month',
  },
  'lead-engine': {
    name: 'Lead Engine + Automation',
    description: 'High-converting landing pages with full automation systems.',
    amountCents: 110_000, // $1,100 one-time
    mode: 'payment',
  },
  shopify: {
    name: 'Shopify / E-Commerce Store',
    description: 'Complete store setup with up to 50 products.',
    amountCents: 165_000, // $1,650 one-time
    mode: 'payment',
  },
};

const CURRENCY = 'usd';

const bodySchema = z.object({
  plan: z.enum(['hosting', 'seo', 'lead-engine', 'shopify']),
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
      return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
    }

    const plan = PLANS[parsed.data.plan];
    const stripe = getStripe();
    const origin = appUrl();

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: plan.amountCents,
            ...(plan.mode === 'subscription'
              ? { recurring: { interval: plan.interval ?? 'month' } }
              : {}),
            product_data: {
              name: `${plan.name} — GRAPHIQ STUDIO LLC`,
              description: plan.description,
            },
          },
        },
      ],
      metadata: { plan: parsed.data.plan },
      success_url: `${origin}/pricing?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?purchase=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e);
    console.error('checkout failed:', raw);

    let message = 'Something went wrong starting checkout. Please try again.';
    if (raw.includes('STRIPE_SECRET_KEY') || raw.includes('api_key')) {
      message = 'Payments are not configured yet (set STRIPE_SECRET_KEY and redeploy).';
    } else if (raw.length < 180) {
      message = raw;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
