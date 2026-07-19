'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ProjectListItem } from './ProjectsList';
import styles from './PortfolioShowcase.module.css';

// Editorial list-portfolio (reference: names stacked left, an image rail
// scrolling through a fixed rounded frame). Same proven mechanics as
// SelectedWork: CSS sticky pin + one ScrollTrigger driving the rail's
// translateY and the active name via hysteresis stepping.

const posterOf = (videoUrl: string) =>
  videoUrl.replace(/\.(mp4|webm|mov)(\?.*)?$/i, '-poster.webp');

export default function PortfolioShowcase({ projects }: { projects: ProjectListItem[] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (!projects.length) return;
    const w = window as unknown as { gsap?: any; ScrollTrigger?: any; lenis?: any };
    let mm: any;
    let cancelled = false;
    let tries = 0;

    const setup = () => {
      if (cancelled) return;
      const gsap = w.gsap;
      const ScrollTrigger = w.ScrollTrigger;
      if (!gsap || !ScrollTrigger || (!w.lenis && tries < 40)) {
        if (tries++ < 90) setTimeout(setup, 100);
        return;
      }
      const N = projects.length;
      mm = gsap.matchMedia();

      mm.add('(min-width: 1px)', () => {
        const root = rootRef.current;
        const rail = railRef.current;
        if (!root || !rail) return;

        // rail geometry: first card centre + step between card centres —
        // measured on refresh only, never per frame. Guarded against the
        // degenerate mid-hydration layout (pin height ~0) that produced a
        // wrong anchor and made the first scroll "jump".
        let firstCenter = 0;
        let step = 0;
        const measure = () => {
          const cards = rail.querySelectorAll<HTMLElement>('[data-card]');
          if (cards.length < 2) return;
          const vp = rail.parentElement!;
          if (vp.clientHeight < 200) return; // not laid out yet — keep last good values
          const a = cards[0].offsetTop + cards[0].offsetHeight / 2;
          const b = cards[1].offsetTop + cards[1].offsetHeight / 2;
          step = b - a;
          firstCenter = a - vp.clientHeight / 2;
        };

        let st: any = null;
        let lastY: number | null = null;
        const applyY = (progress: number) => {
          const f = progress * (N - 1);
          const y = -(firstCenter + f * step);
          if (y !== lastY) {
            lastY = y;
            gsap.set(rail, { y });
          }
        };
        // resting state is correct even before the trigger exists / fires
        measure();
        applyY(0);

        const create = () => {
          st = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
            // re-anchor AND re-apply on every refresh (images settling,
            // mobile URL-bar resize, killAll re-creates) — never leave the
            // rail on a stale transform
            onRefresh: (self: any) => {
              measure();
              applyY(self.progress);
            },
            onUpdate: (self: any) => {
              applyY(self.progress);
              const f = self.progress * (N - 1);
              const idx = Math.round(f);
              if (idx !== activeRef.current && Math.abs(f - idx) < 0.4) {
                activeRef.current = idx;
                setActive(idx);
              }
            },
          });
          requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        create();

        // survive AppInitializer's killAll on (re)init
        const guard = setInterval(() => {
          if (st && !ScrollTrigger.getAll().includes(st)) create();
        }, 1200);

        return () => {
          clearInterval(guard);
          if (st) st.kill();
        };
      });
    };

    setup();
    return () => {
      cancelled = true;
      if (mm) mm.revert();
    };
  }, [projects]);

  if (!projects.length) return null;
  const N = projects.length;

  return (
    <section
      ref={rootRef}
      className={styles.root}
      style={{ ['--pfh' as string]: `${N * 85}vh` }}
      aria-label="Portfolio"
    >
      <div className={styles.pin}>
        {/* image rail — scrolls through the frame. Wrap-around ghosts (the
            last projects above the first, the first below the last — WITHOUT
            data-card, so the anchor/step math only sees the real cards) keep
            the rail looking endless like the reference. */}
        <div className={styles.railViewport}>
          <div ref={railRef} className={styles.rail}>
            {projects.slice(-2).map((p) => {
              const img = p.image || (p.video ? posterOf(p.video) : undefined);
              return (
                <Link
                  key={`lead-${p.id}`}
                  href={`/project-details/${p.id}`}
                  className={styles.card}
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" loading="eager" />
                  ) : (
                    <span className={styles.noMedia} />
                  )}
                </Link>
              );
            })}
            {projects.map((p, i) => {
              const img = p.image || (p.video ? posterOf(p.video) : undefined);
              return (
                <Link
                  key={p.id}
                  data-card
                  href={`/project-details/${p.id}`}
                  className={`${styles.card} ${i === active ? styles.cardActive : ''}`}
                  aria-label={p.title}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={p.title} loading={i < 2 ? 'eager' : 'lazy'} />
                  ) : (
                    <span className={styles.noMedia} />
                  )}
                </Link>
              );
            })}
            {projects.slice(0, 2).map((p) => {
              const img = p.image || (p.video ? posterOf(p.video) : undefined);
              return (
                <Link
                  key={`tail-${p.id}`}
                  href={`/project-details/${p.id}`}
                  className={styles.card}
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" loading="lazy" />
                  ) : (
                    <span className={styles.noMedia} />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* names — the reference's stacked list, active follows the scroll */}
        <nav className={styles.names} aria-label="Projects">
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/project-details/${p.id}`}
              className={`${styles.name} ${i === active ? styles.nameActive : ''}`}
            >
              {p.title}
            </Link>
          ))}
        </nav>

        {/* fixed rounded frame + rotated micro-labels */}
        <div className={styles.frame} aria-hidden="true">
          <span className={`${styles.side} ${styles.sideTop}`}>GRAPHIQ STUDIO LLC</span>
          <span className={`${styles.side} ${styles.sideMid}`}>PORTFOLIO</span>
          <span className={`${styles.side} ${styles.sideBot}`}>SELECTED CASES</span>
          <span className={styles.counter}>
            {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
