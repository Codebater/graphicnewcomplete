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

// aurora tile cover (the Selected Work wipe language): 8x5 opaque tiles per
// card, coloured from the same 215°->390° long-way hue ramp, melting to the
// page base at the card edges. Rendered once (SSR) — the reveal/cover is
// pure CSS class + staggered transition delays.
const COVER_COLS = 8;
const COVER_ROWS = 5;
const coverTiles = (() => {
  const tiles: { bg: string; d: number }[] = [];
  for (let i = 0; i < COVER_COLS * COVER_ROWS; i++) {
    const c = i % COVER_COLS;
    const r = (i / COVER_COLS) | 0;
    const dx = c / (COVER_COLS - 1) - 0.5;
    const dy = r / (COVER_ROWS - 1) - 0.5;
    const dist = Math.min(1, Math.hypot(dx, dy) * 1.9);
    const hue = (215 + (dx + 0.5) * 175 - dy * 35 + 360) % 360;
    const sat = Math.round(92 - dist * 48);
    const light = Math.round(27 + dist * 46);
    const melt = Math.max(0, Math.min(1, (dist - 0.55) / 0.45));
    const vivid = Math.round(100 - melt * 82);
    tiles.push({
      bg: `color-mix(in oklab, hsl(${hue.toFixed(0)} ${sat}% ${light}%) ${vivid}%, var(--base))`,
      d: c * 22 + ((r + c) % 2) * 40,
    });
  }
  return tiles;
})();

const TileCover = () => (
  <span className="pfTileCover" aria-hidden="true">
    {coverTiles.map((t, i) => (
      <i key={i} style={{ backgroundColor: t.bg, transitionDelay: `${t.d}ms` }} />
    ))}
  </span>
);

export default function PortfolioShowcase({ projects }: { projects: ProjectListItem[] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const namesRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const inViewRef = useRef(false);

  // play ONLY the active card's video while the section is on screen
  const syncVideos = () => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLVideoElement>('video[data-idx]').forEach((v) => {
      v.muted = true;
      if (Number(v.dataset.idx) === activeRef.current && inViewRef.current) {
        v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  };
  useEffect(syncVideos, [active]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[entries.length - 1].isIntersecting;
        syncVideos();
      },
      { rootMargin: '0px 0px -80px 0px' }
    );
    io.observe(root);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        let vpH = 0;
        // every rail child (incl. wrap-around ghosts) cached with its static
        // centre in rail coordinates — the per-frame zoom needs NO rect reads
        let cardCache: { el: HTMLElement; c: number; s: number }[] = [];
        // names: the straight list shifts so the ACTIVE name sits at the
        // frame's vertical middle. The shift is written on EVERY name (not
        // the container — a container-level gsap y was beaten by module CSS
        // on some phones). Ghost names (no data-name) fill the box above
        // the first and below the last project; anchor math uses reals only.
        let nameCache: { el: HTMLElement; c: number; y: number; s: number }[] = [];
        let realNames: typeof nameCache = [];
        let rowUnit = 1;
        // half the frame's height — cards whose centre is beyond this line
        // are outside the box and get the frost blur (per-card CSS filter;
        // backdrop-filter bands silently failed on the user's phone)
        let frameHalf = 0;
        const measure = () => {
          const cards = rail.querySelectorAll<HTMLElement>('[data-card]');
          if (cards.length < 2) return;
          const vp = rail.parentElement!;
          if (vp.clientHeight < 200) return; // not laid out yet — keep last good values
          vpH = vp.clientHeight;
          const a = cards[0].offsetTop + cards[0].offsetHeight / 2;
          const b = cards[1].offsetTop + cards[1].offsetHeight / 2;
          step = b - a;
          firstCenter = a - vp.clientHeight / 2;
          cardCache = Array.from(rail.children).map((el) => {
            const h = el as HTMLElement;
            return { el: h, c: h.offsetTop + h.offsetHeight / 2, s: -1 };
          });
          frameHalf = frameRef.current ? frameRef.current.offsetHeight / 2 : 0;
          const namesEl = namesRef.current;
          if (namesEl) {
            nameCache = Array.from(namesEl.children).map((el) => {
              const h = el as HTMLElement;
              return { el: h, c: h.offsetTop + h.offsetHeight / 2, y: NaN, s: NaN };
            });
            realNames = nameCache.filter((n) => n.el.hasAttribute('data-name'));
            rowUnit =
              realNames.length > 1
                ? (realNames[realNames.length - 1].c - realNames[0].c) / (realNames.length - 1)
                : 1;
          }
        };

        let st: any = null;
        let lastY: number | null = null;
        const applyY = (progress: number) => {
          const f = progress * (N - 1);
          const y = -(firstCenter + f * step);
          if (y !== lastY) {
            lastY = y;
            gsap.set(rail, { y });
            // promo-style zoom-settle: each card grows to full size as it
            // nears the frame centre (transform-only, deduped per card)
            if (vpH) {
              for (const it of cardCache) {
                const aoff = Math.abs(it.c + y - vpH / 2);
                const d = aoff / vpH;
                const sc = Math.round((1 - 0.14 * Math.min(1, d * 1.6)) * 250) / 250;
                if (sc !== it.s) {
                  it.s = sc;
                  gsap.set(it.el, { scale: sc });
                }
                // frost outside the box — re-asserted every frame (React
                // re-renders rewrite className and would drop the class)
                it.el.classList.toggle('pfBlur', frameHalf > 0 && aoff > frameHalf);
              }
            }
          }
          // straight names list: shift every name up by the interpolated
          // active centre so the highlighted name sits at the frame middle
          // (per-name writes, fully deduped; the active pop is folded into
          // the transform because an inline y would override a CSS scale)
          if (nameCache.length && realNames.length) {
            const i0 = Math.min(N - 1, Math.floor(f));
            const i1 = Math.min(N - 1, i0 + 1);
            const lc = realNames[i0].c + (realNames[i1].c - realNames[i0].c) * (f - i0);
            const ny = -Math.round(lc * 2) / 2;
            for (const n of nameCache) {
              const ad = Math.abs(n.c - lc) / rowUnit;
              const sc = Math.round((1 + Math.max(0, 1 - ad) * 0.06) * 200) / 200;
              if (ny !== n.y || sc !== n.s) {
                n.y = ny;
                n.s = sc;
                gsap.set(n.el, { y: ny, scale: sc });
              }
            }
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
            scrub: 1.6,
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
                  <TileCover />
                </Link>
              );
            })}
            {projects.map((p, i) => {
              const img = p.image || (p.video ? posterOf(p.video) : undefined);
              const revealed = i === active;
              return (
                <Link
                  key={p.id}
                  data-card
                  href={`/project-details/${p.id}`}
                  className={`${styles.card} ${revealed ? `${styles.cardActive} ${styles.cardRevealed}` : ''}`}
                  aria-label={p.title}
                >
                  {p.video ? (
                    <video
                      data-idx={i}
                      src={p.video}
                      poster={p.video ? posterOf(p.video) : undefined}
                      muted
                      loop
                      playsInline
                      preload="none"
                    />
                  ) : img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={p.title} loading={i < 2 ? 'eager' : 'lazy'} />
                  ) : (
                    <span className={styles.noMedia} />
                  )}
                  <TileCover />
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
                  <TileCover />
                </Link>
              );
            })}
          </div>
        </div>

        {/* names — the reference's stacked list, active follows the scroll
            and always sits at the frame middle. Wrap-around ghosts (the last
            projects above the first, the first below the last — WITHOUT
            data-name, so the shift math only sees the real names) keep the
            box filled above and below. */}
        <nav ref={namesRef} className={styles.names} aria-label="Projects">
          {projects.slice(-2).map((p) => (
            <Link
              key={`nlead-${p.id}`}
              href={`/project-details/${p.id}`}
              className={styles.name}
              aria-hidden="true"
              tabIndex={-1}
            >
              {p.title}
            </Link>
          ))}
          {projects.map((p, i) => (
            <Link
              key={p.id}
              data-name
              href={`/project-details/${p.id}`}
              className={`${styles.name} ${i === active ? styles.nameActive : ''}`}
            >
              {p.title}
            </Link>
          ))}
          {projects.slice(0, 2).map((p) => (
            <Link
              key={`ntail-${p.id}`}
              href={`/project-details/${p.id}`}
              className={styles.name}
              aria-hidden="true"
              tabIndex={-1}
            >
              {p.title}
            </Link>
          ))}
        </nav>

        {/* fixed rounded frame + rotated micro-labels */}
        <div ref={frameRef} className={styles.frame} aria-hidden="true">
          <span className={styles.year}>26</span>
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
