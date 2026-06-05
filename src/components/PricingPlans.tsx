'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './PricingPlans.module.css';

type BuyKey = 'hosting' | 'seo' | 'lead-engine' | 'shopify';

type Retainer = {
  key: BuyKey;
  toggleLabel: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  period: string;
  buyLabel: string;
};

type Plan = {
  num: string;
  icon: string;
  title: string;
  badge?: string;
  description: string;
  features: string[];
  price: string;
  period: string;
  action:
    | { type: 'buy'; key: BuyKey; label: string }
    | { type: 'contact'; label: string };
};

// Card 01 — two monthly retainers behind one toggle.
const RETAINERS: Retainer[] = [
  {
    key: 'hosting',
    toggleLabel: 'Hosting',
    icon: 'ph-hard-drives',
    title: 'Hosting & Domain Caring',
    description: 'We manage your hosting, domains and everything technical.',
    features: [
      'Premium Hosting',
      'Domain Management',
      'SSL, Backups & Security',
      'Updates & Uptime Monitoring',
      '24/7 Technical Support',
    ],
    price: '$150',
    period: '/ month',
    buyLabel: 'Subscribe',
  },
  {
    key: 'seo',
    toggleLabel: 'SEO',
    icon: 'ph-chart-line-up',
    title: 'SEO Growth Retainer',
    description: 'Ongoing SEO that compounds — we get you found and keep you ranking.',
    features: [
      'Keyword Research & Strategy',
      'On-Page Optimization',
      'Technical SEO Audits',
      'Content & Link Building',
      'Monthly Ranking Reports',
    ],
    price: '$350',
    period: '/ month',
    buyLabel: 'Subscribe',
  },
];

const PLANS: Plan[] = [
  {
    num: '02',
    icon: 'ph-funnel',
    title: 'Lead Engine + Automation',
    description: 'High-converting landing pages with full automation systems.',
    features: [
      'Landing Page Design',
      'Lead Generation Funnels',
      'Automation & Workflows',
      'CRM Integration',
      'Email & SMS Automation',
    ],
    price: '$1,100',
    period: '/ one time',
    action: { type: 'buy', key: 'lead-engine', label: 'Buy now' },
  },
  {
    num: '03',
    icon: 'ph-shopping-bag',
    title: 'Shopify / E-Commerce Store',
    description: 'Complete store setup with up to 50 products.',
    features: [
      'Shopify Store Setup',
      'Up to 50 Products',
      'Payment Integration',
      'Mobile Optimized',
      'Launch & Training',
    ],
    price: '$1,650',
    period: '/ one time',
    action: { type: 'buy', key: 'shopify', label: 'Buy now' },
  },
  {
    num: '04',
    icon: 'ph-cube',
    title: 'SaaS Platform Development',
    badge: 'PLATFORM',
    description: 'Full SaaS platform with everything you need to scale.',
    features: [
      'Custom SaaS Development',
      'User Authentication',
      'Subscription Systems',
      'Admin Dashboard',
      'Scalable Architecture',
    ],
    price: '$5,500 – $11,000',
    period: '/ project',
    action: { type: 'contact', label: 'Get a quote' },
  },
  {
    num: '05',
    icon: 'ph-code',
    title: 'Custom Web Application (React)',
    badge: 'PREMIUM',
    description: 'Powerful, fast and interactive web applications with React.',
    features: [
      'Custom React Development',
      'API Integrations',
      'Dashboard & Admin Panel',
      'Performance Optimized',
      'Advanced Features',
    ],
    price: '$11,000+',
    period: '/ project',
    action: { type: 'contact', label: 'Get a quote' },
  },
  {
    num: '06',
    icon: 'ph-sparkle',
    title: 'Strategic Partnership',
    description: 'Your external digital team for continuous growth.',
    features: [
      'Strategy & Consulting',
      'Continuous Optimization',
      'Priority Support',
      'Monthly Reporting',
      'Long-Term Growth',
    ],
    price: 'Custom',
    period: '/ monthly',
    action: { type: 'contact', label: "Let's talk" },
  },
];

export default function PricingPlans() {
  const [retainer, setRetainer] = useState(0);
  const [loadingKey, setLoadingKey] = useState<BuyKey | null>(null);
  const [errorKey, setErrorKey] = useState<BuyKey | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [notice, setNotice] = useState<'success' | 'cancelled' | null>(null);

  // Read the post-checkout redirect status from the URL (no Suspense needed).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchase = params.get('purchase');
    if (purchase === 'success') setNotice('success');
    else if (purchase === 'cancelled') setNotice('cancelled');
  }, []);

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
    }
  }

  const active = RETAINERS[retainer];

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
        {/* Card 01 — Monthly retainer with Hosting / SEO toggle */}
        <article className={`${styles.card} animate-card-3`}>
          <div className={`${styles.toggle} anim-uni-in-up`} role="tablist" aria-label="Choose a monthly retainer">
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
              01
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

          <div className={styles.footer}>
            <div className={`${styles.priceRow} anim-uni-in-up`}>
              <span className={styles.price}>{active.price}</span>
              <span className={styles.period}>{active.period}</span>
            </div>
            <button
              type="button"
              className="btn btn-anim btn-default btn-opposite btn-fullwidth slide-right-up anim-uni-in-up"
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

        {/* Cards 02–06 */}
        {PLANS.map((plan) => (
          <article key={plan.num} className={`${styles.card} animate-card-3`}>
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

            <div className={styles.footer}>
              <div className={`${styles.priceRow} anim-uni-in-up`}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>

              {plan.action.type === 'buy' ? (
                <>
                  <button
                    type="button"
                    className="btn btn-anim btn-default btn-opposite btn-fullwidth slide-right-up anim-uni-in-up"
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
      </div>
    </div>
  );
}
