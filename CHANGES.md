# Changes — `changes` branch

A batch of UI, pricing, and infrastructure updates. Summary below for review.

_Last updated: 2026-06-05_

---

## 1. About Us — "The best freelancers" section
Replaced the old "Creative leaders" cards with an interactive freelancer
showcase (serious.business style), built in the site's own dark theme + GSAP.

- Big stacked names; inactive ones greyed, the active one bright with its role
  + one‑liner revealed, and a photo that swaps on hover (desktop).
- **Mobile**: mirrors the desktop behaviour — one photo open at a time, swaps as
  you tap the next name; the whole section is centered.
- Added the studio origin paragraph above the section, with spacing.
- People: **Andrej Lisal**, **Sadullah Maliyawala**, + two anonymous profiles
  (on‑brand avatar SVGs).
- ⚠️ **Placeholder photos**: `public/porthomeimages/andrej.jpg` and
  `sadullah.jpg` are temporary stand‑ins. Drop in the real headshots under the
  same filenames to replace them — no code change needed.

Files: `src/app/about-us/page.tsx`, `src/components/FreelancersList.tsx`,
`src/components/FreelancersList.module.css`, avatar SVGs.

## 2. Pricing — 6 buyable plans + Stripe checkout
Replaced the 3 vague packages with a 6‑card grid (dark theme + GSAP), each a
concrete, directly‑purchasable offering.

| Card | Price | Action |
|------|-------|--------|
| Monthly Care — **Hosting** / **SEO** toggle | $150/mo · $350/mo | Stripe subscription |
| Lead Engine + Automation | $1,100 one‑time | Stripe |
| Shopify / E‑Commerce Store | $1,650 one‑time | Stripe |
| SaaS Platform Development | $5,500 – $11,000 | Contact for quote |
| Custom Web Application (React) | $11,000+ | Contact for quote |
| Strategic Partnership | Custom | Contact for quote |

- Hosting + SEO share one card via a **Hosting | SEO toggle** (keeps a clean 3×2 grid).
- New `POST /api/checkout` creates real Stripe Checkout sessions (subscription
  for monthly plans, one‑time for the rest). Server is the source of truth for prices.
- **Setup**: requires `STRIPE_SECRET_KEY` (+ `NEXT_PUBLIC_SITE_URL`) in env.
  Without it, buttons show a clear "not configured" message.

Files: `src/app/pricing/page.tsx`, `src/components/PricingPlans.tsx`,
`src/components/PricingPlans.module.css`, `src/app/api/checkout/route.ts`.

## 3. Admin uploads — fixed on Vercel (Vercel Blob)
The admin dashboard image upload failed in production ("Failed to upload featured
image"). Root cause: the old route wrote files to the local filesystem, which is
**read‑only on Vercel**. Switched to **Vercel Blob** (persistent cloud storage).

- **Setup**: create a Blob store in Vercel (Storage → Blob) and connect it to the
  project — this injects `BLOB_READ_WRITE_TOKEN` automatically. For local dev, add
  the token to `.env.local`.

Files: `src/app/api/upload/route.ts`, `next.config.ts` (allowlisted the Blob host).

## 4. Menu — rotating sales‑pitch caption
The static menu caption now rotates through 3 lines every few seconds with a
fade, and is readable in both light and dark themes (a base style was forcing the
text white).

Files: `src/components/RotatingCaption.tsx`, `src/components/Header.tsx`.

## 5. Card‑stack scroll fix (mobile)
The home‑page stacking‑cards section measured card height before images loaded,
so on mobile it scrolled without stacking until a stray resize fixed it. Now it
refreshes ScrollTrigger after images load → stacks correctly from the start.

File: `src/components/AppInitializer.tsx`.

## 6. Phone number
Updated the company number across the site (global footer + contact page, and the
legacy static `.html` files) to the new US number **+1 213‑232‑2227**.

Files: `src/components/Footer.tsx`, `src/app/contact/page.tsx`, root `*.html`.

---

## Env vars needed (set in Vercel for production)
- `STRIPE_SECRET_KEY` — pricing checkout
- `NEXT_PUBLIC_SITE_URL` — Stripe redirect URLs (e.g. `https://graphiq.art`)
- `BLOB_READ_WRITE_TOKEN` — admin image uploads (auto‑added when a Blob store is connected)
- `STRIPE_WEBHOOK_SECRET` — optional, only for the consultation webhook

## Known follow‑ups (not in this branch)
- Replace the two placeholder freelancer photos.
- Harden admin auth (credentials are currently hardcoded; the repo is public).
- Card‑stack "snap/jump" polish on first scroll.
