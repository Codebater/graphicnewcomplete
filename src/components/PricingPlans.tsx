'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './PricingPlans.module.css';

// Business Growth Studio positioning: every card sells an OUTCOME with a
// concrete metric on top; the technology (Shopify, AI, CRM, APIs…) is listed
// as the tools we use — not the product.

type BuyKey = 'hosting' | 'seo' | 'lead-engine' | 'shopify' | 'launch-72h' | 'automation';
type SlotStatus = 'available' | 'reserved' | 'booked';

type Retainer = {
  key: BuyKey;
  toggleLabel: string;
  icon: string;
  title: string;
  metric: string;
  description: string;
  features: string[];
  tools: string;
  price: string;
  period: string;
  buyLabel: string;
};

type Plan = {
  num: string;
  icon: string;
  title: string;
  metric: string;
  badge?: string;
  description: string;
  features: string[];
  tools: React.ReactNode;
  price: string;
  period: string;
  action:
    | { type: 'buy'; key: BuyKey; label: string }
    | { type: 'contact'; label: string };
};

// The flagship one-slot offer (card 01). 96 hours = 72h + a 24h polish day.
// (The internal plan/slot key stays 'launch-72h' — invisible to users.)
const LAUNCH = {
  num: '01',
  icon: 'ph-rocket-launch',
  title: '🚀 Launch My Business',
  metric: 'Go live in 96 hours.',
  description:
    'Idea on Monday, business online by Friday. We design, write and launch your complete business website — done for you.',
  features: [
    'Complete business website, live in 4 days',
    'Domain, hosting & business email set up',
    'Copy & design shaped in one workshop call',
    'Contact & booking so clients reach you day one',
    '96-hour delivery — guaranteed',
  ],
  tools: 'Next.js · Vercel · Figma',
  price: '$1,499',
  period: '/ one time',
};

// Ongoing-care card (toggle) — sold as outcomes, not infrastructure.
const RETAINERS: Retainer[] = [
  {
    key: 'hosting',
    toggleLabel: 'Running',
    icon: 'ph-shield-check',
    title: '🛡 Keep My Business Running',
    metric: 'Never think about hosting again.',
    description: 'We carry everything technical — you run your business.',
    features: [
      'Premium hosting, always fast',
      'Domains & SSL handled for you',
      'Daily backups & security watch',
      'Updates & uptime monitoring',
      '24/7 technical support',
    ],
    tools: 'Vercel · Cloudflare · Monitoring',
    price: '$150',
    period: '/ month',
    buyLabel: 'Subscribe',
  },
  {
    key: 'seo',
    toggleLabel: 'Found',
    icon: 'ph-magnifying-glass',
    title: '🔍 Get Found on Google',
    metric: 'Climb the rankings every single month.',
    description: 'Compounding SEO that turns searches into customers.',
    features: [
      'Keyword strategy for buyers, not traffic',
      'On-page & technical fixes',
      'Content & link building',
      'Local visibility where it matters',
      'Monthly ranking report you can read',
    ],
    tools: 'Search Console · Ahrefs · Content',
    price: '$350',
    period: '/ month',
    buyLabel: 'Subscribe',
  },
];

const PLANS: Plan[] = [
  {
    num: '02',
    icon: 'ph-shopping-bag',
    title: '🛒 Sell Products Online',
    metric: 'Start selling online in one week.',
    description: 'A complete store that takes payments from day one — up to 50 products loaded for you.',
    features: [
      'Complete store, ready to sell',
      'Up to 50 products loaded for you',
      'Payments & shipping configured',
      'Mobile-first storefront that converts',
      'Launch training — you run it yourself',
    ],
    tools: 'Shopify · Stripe · Klaviyo',
    price: '$1,650',
    period: '/ one time',
    action: { type: 'buy', key: 'shopify', label: 'Buy now' },
  },
  {
    num: '03',
    icon: 'ph-funnel',
    title: '📈 Get More Leads',
    metric: 'A lead engine working for you 24/7.',
    description: 'A landing page and funnel that captures, qualifies and follows up — while you sleep.',
    features: [
      'High-converting landing page',
      'Funnels that capture & qualify leads',
      'Email & SMS follow-up automation',
      'CRM set up — no lead gets lost',
      'Tracking so you see what converts',
    ],
    tools: 'Next.js · CRM · Make',
    price: '$1,100',
    period: '/ one time',
    action: { type: 'buy', key: 'lead-engine', label: 'Buy now' },
  },
  {
    num: '04',
    icon: 'ph-robot',
    title: '🤖 Automate My Business',
    metric: 'Save 10+ hours of manual work every week.',
    description: 'We map your repetitive work and make it run itself with AI and connected systems.',
    features: [
      'Workflow audit — we find the wasted hours',
      'AI assistants for support & admin',
      'Telegram / WhatsApp & email automations',
      'CRM, sheets & invoicing connected',
      'Documented so your team actually uses it',
    ],
    tools: (
      <>
        AI ·{' '}
        <i className={`ph-fill ph-telegram-logo ${styles.toolIcon} ${styles.toolTelegram}`} aria-hidden="true" />{' '}
        Telegram ·{' '}
        <i className={`ph-fill ph-whatsapp-logo ${styles.toolIcon} ${styles.toolWhatsApp}`} aria-hidden="true" />{' '}
        WhatsApp · Make · APIs
      </>
    ),
    price: '$1,850',
    period: '/ one time',
    action: { type: 'buy', key: 'automation', label: 'Buy now' },
  },
  {
    num: '05',
    icon: 'ph-cube',
    title: '💼 Build My SaaS',
    metric: 'Launch your MVP in 6–10 weeks.',
    badge: 'PLATFORM',
    description: 'From idea to a product people can subscribe to — auth, billing and admin included.',
    features: [
      'Custom SaaS built around your model',
      'User accounts & authentication',
      'Subscriptions & billing built in',
      'Admin dashboard to run it',
      'Architecture that scales with you',
    ],
    tools: 'Custom — ask us',
    price: '$5,500 – $11,000',
    period: '/ project',
    action: { type: 'contact', label: 'Get a quote' },
  },
  {
    num: '06',
    icon: 'ph-buildings',
    title: '🏢 Enterprise Software',
    metric: 'Built for 100+ users and complex workflows.',
    badge: 'PREMIUM',
    description: 'Custom web applications for serious operations — fast, secure and made to fit.',
    features: [
      'Custom application around your workflow',
      'API & system integrations',
      'Dashboards, roles & permissions',
      'Performance engineered at scale',
      'Long-term support & evolution',
    ],
    tools: 'Custom — ask us',
    price: '$11,000+',
    period: '/ project',
    action: { type: 'contact', label: 'Get a quote' },
  },
];

export default function PricingPlans() {
  const [retainer, setRetainer] = useState(0);
  const [loadingKey, setLoadingKey] = useState<BuyKey | null>(null);
  const [errorKey, setErrorKey] = useState<BuyKey | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [notice, setNotice] = useState<'success' | 'cancelled' | null>(null);
  const [slot, setSlot] = useState<SlotStatus | null>(null);

  const refreshSlot = useCallback(async () => {
    try {
      const res = await fetch('/api/pricing/slot', { cache: 'no-store' });
      const data = await res.json();
      if (data?.status) setSlot(data.status as SlotStatus);
    } catch {
      /* keep last known state */
    }
  }, []);

  // Post-checkout: verify the session server-side (marks the 72h slot booked
  // on a real payment), then show the banner and refresh availability.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchase = params.get('purchase');
    const sessionId = params.get('session_id');
    if (purchase === 'success') {
      setNotice('success');
      if (sessionId) {
        fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
          .catch(() => {})
          .finally(() => refreshSlot());
      }
    } else if (purchase === 'cancelled') {
      setNotice('cancelled');
    }
    refreshSlot();
  }, [refreshSlot]);

  async function buy(key: BuyKey) {
    setErrorKey(null);
    setErrorMsg('');
    setLoadingKey(key);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: key }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout. Please try again.');
      }
      window.location.href = data.url;
    } catch (e) {
      setErrorKey(key);
      setErrorMsg(e instanceof Error ? e.message : 'Could not start checkout.');
      setLoadingKey(null);
      if (key === 'launch-72h') refreshSlot();
    }
  }

  const active = RETAINERS[retainer];
  const launchOpen = slot === null || slot === 'available';

  return (
    <div className={`${styles.wrap} loading__fade`}>
      {notice && (
        <div
          className={`${styles.notice} ${notice === 'success' ? styles.noticeOk : styles.noticeWarn}`}
          role="status"
        >
          <i className={`ph-bold ${notice === 'success' ? 'ph-check-circle' : 'ph-info'}`} />
          <span>
            {notice === 'success'
              ? 'Payment successful — thank you! We’ll be in touch shortly.'
              : 'Checkout cancelled. No charge was made.'}
          </span>
          <button className={styles.noticeClose} onClick={() => setNotice(null)} aria-label="Dismiss">
            <i className="ph ph-x" />
          </button>
        </div>
      )}

      <div className={styles.grid}>
        {/* Card 01 — 🚀 Launch My Business: ONE slot, booked live */}
        <article className={`${styles.card} ${styles.cardHero} animate-card-3`}>
          <div className={`${styles.metric} anim-uni-in-up`}>
            <i className="ph-fill ph-lightning" aria-hidden="true" />
            {LAUNCH.metric}
          </div>

          <div className={styles.top}>
            <div className={styles.iconBox}>
              <i className={`ph ${LAUNCH.icon}`} />
            </div>
            <div className={styles.num}>
              <span className={styles.dot} aria-hidden="true" />
              {LAUNCH.num}
            </div>
          </div>

          <div className={styles.head}>
            <span className={`${styles.badge} ${slot === 'booked' ? styles.badgeBooked : ''}`}>
              {slot === 'booked' ? 'BOOKED' : '1 SLOT ONLY'}
            </span>
            <h4 className={`${styles.title} anim-uni-in-up`}>{LAUNCH.title}</h4>
          </div>
          <p className={`${styles.desc} anim-uni-in-up`}>{LAUNCH.description}</p>

          <ul className={`mxd-check-list ${styles.features}`}>
            {LAUNCH.features.map((f) => (
              <li key={f} className="anim-uni-in-up">
                <i className="ph ph-check" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className={`${styles.tools} anim-uni-in-up`}>Tools we use: {LAUNCH.tools}</p>

          <div className={styles.footer}>
            <div className={`${styles.priceRow} anim-uni-in-up`}>
              <span className={styles.price}>{LAUNCH.price}</span>
              <span className={styles.period}>{LAUNCH.period}</span>
            </div>

            {launchOpen ? (
              <>
                <button
                  type="button"
                  className="btn btn-anim btn-default btn-outline btn-fullwidth slide-right-up anim-uni-in-up"
                  onClick={() => buy('launch-72h')}
                  disabled={loadingKey === 'launch-72h'}
                >
                  <span className="btn-caption">
                    {loadingKey === 'launch-72h' ? 'Redirecting…' : 'Book the slot'}
                  </span>
                  <i className="ph-bold ph-arrow-up-right" />
                </button>
                <p className={styles.slotNote}>
                  <span className={styles.slotDot} aria-hidden="true" />
                  One business at a time — the slot books live, first come first served.
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-anim btn-default btn-outline btn-fullwidth anim-uni-in-up"
                  disabled
                >
                  <span className="btn-caption">
                    {slot === 'booked' ? 'Slot booked' : 'Someone’s in checkout…'}
                  </span>
                  <i className="ph-bold ph-lock-simple" />
                </button>
                <p className={styles.slotNote}>
                  {slot === 'booked' ? (
                    <>
                      This slot is taken.{' '}
                      <Link href="/contact" className={styles.slotLink}>
                        Get on the list for the next one →
                      </Link>
                    </>
                  ) : (
                    'The slot is being purchased right now — check back in a few minutes.'
                  )}
                </p>
              </>
            )}
            {errorKey === 'launch-72h' && <p className={styles.error}>{errorMsg}</p>}
          </div>
        </article>

        {/* Cards 02–06 — outcomes */}
        {PLANS.map((plan) => (
          <article key={plan.num} className={`${styles.card} animate-card-3`}>
            <div className={`${styles.metric} anim-uni-in-up`}>
              <i className="ph-fill ph-lightning" aria-hidden="true" />
              {plan.metric}
            </div>

            <div className={styles.top}>
              <div className={styles.iconBox}>
                <i className={`ph ${plan.icon}`} />
              </div>
              <div className={styles.num}>
                <span className={styles.dot} aria-hidden="true" />
                {plan.num}
              </div>
            </div>

            <div className={styles.head}>
              {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
              <h4 className={`${styles.title} anim-uni-in-up`}>{plan.title}</h4>
            </div>
            <p className={`${styles.desc} anim-uni-in-up`}>{plan.description}</p>

            <ul className={`mxd-check-list ${styles.features}`}>
              {plan.features.map((f) => (
                <li key={f} className="anim-uni-in-up">
                  <i className="ph ph-check" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className={`${styles.tools} anim-uni-in-up`}>Tools we use: {plan.tools}</p>

            <div className={styles.footer}>
              <div className={`${styles.priceRow} anim-uni-in-up`}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>

              {plan.action.type === 'buy' ? (
                <>
                  <button
                    type="button"
                    className="btn btn-anim btn-default btn-outline btn-fullwidth slide-right-up anim-uni-in-up"
                    onClick={() => buy((plan.action as { key: BuyKey }).key)}
                    disabled={loadingKey === plan.action.key}
                  >
                    <span className="btn-caption">
                      {loadingKey === plan.action.key ? 'Redirecting…' : plan.action.label}
                    </span>
                    <i className="ph-bold ph-arrow-up-right" />
                  </button>
                  {errorKey === plan.action.key && <p className={styles.error}>{errorMsg}</p>}
                </>
              ) : (
                <Link
                  className="btn btn-anim btn-default btn-outline btn-fullwidth slide-right-up anim-uni-in-up"
                  href="/contact"
                >
                  <span className="btn-caption">{plan.action.label}</span>
                  <i className="ph-bold ph-arrow-up-right" />
                </Link>
              )}
            </div>
          </article>
        ))}

        {/* Card 07 — ongoing care with Running / Found toggle */}
        <article className={`${styles.card} animate-card-3`}>
          <div className={`${styles.metric} anim-uni-in-up`}>
            <i className="ph-fill ph-lightning" aria-hidden="true" />
            {active.metric}
          </div>

          <div className={`${styles.toggle} anim-uni-in-up`} role="tablist" aria-label="Choose a monthly plan">
            {RETAINERS.map((r, i) => (
              <button
                key={r.key}
                type="button"
                role="tab"
                aria-selected={retainer === i}
                className={`${styles.toggleBtn} ${retainer === i ? styles.toggleBtnActive : ''}`}
                onClick={() => setRetainer(i)}
              >
                {r.toggleLabel}
              </button>
            ))}
          </div>

          <div className={styles.top}>
            <div className={styles.iconBox}>
              <i className={`ph ${active.icon}`} />
            </div>
            <div className={styles.num}>
              <span className={styles.dot} aria-hidden="true" />
              07
            </div>
          </div>

          <div className={styles.head}>
            <h4 className={`${styles.title} anim-uni-in-up`}>{active.title}</h4>
          </div>
          <p className={`${styles.desc} anim-uni-in-up`}>{active.description}</p>

          <ul className={`mxd-check-list ${styles.features}`}>
            {active.features.map((f) => (
              <li key={f} className="anim-uni-in-up">
                <i className="ph ph-check" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className={`${styles.tools} anim-uni-in-up`}>Tools we use: {active.tools}</p>

          <div className={styles.footer}>
            <div className={`${styles.priceRow} anim-uni-in-up`}>
              <span className={styles.price}>{active.price}</span>
              <span className={styles.period}>{active.period}</span>
            </div>
            <button
              type="button"
              className="btn btn-anim btn-default btn-outline btn-fullwidth slide-right-up anim-uni-in-up"
              onClick={() => buy(active.key)}
              disabled={loadingKey === active.key}
            >
              <span className="btn-caption">
                {loadingKey === active.key ? 'Redirecting…' : active.buyLabel}
              </span>
              <i className="ph-bold ph-arrow-up-right" />
            </button>
            {errorKey === active.key && <p className={styles.error}>{errorMsg}</p>}
          </div>
        </article>
      </div>
    </div>
  );
}
