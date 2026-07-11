'use client';

import dynamic from 'next/dynamic';

// The collectible-card freelancer list (KingCard + CodeCard, their per-frame
// pointer-tilt rAF loops, and the /king art) is loaded as a SEPARATE,
// client-only chunk that exists ONLY on the About Us page. Nothing here is
// ever pulled into another page's bundle — it can't touch the home page.
// A reserved-height placeholder keeps the layout stable until it hydrates.
const FreelancersList = dynamic(() => import('./FreelancersList'), {
  ssr: false,
  loading: () => <div style={{ minHeight: 'clamp(420px, 60vh, 640px)' }} aria-hidden="true" />,
});

export default function FreelancersListLazy() {
  return <FreelancersList />;
}
