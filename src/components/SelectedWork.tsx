'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ProjectListItem } from './ProjectsList';
import PixelText from './PixelText';
import styles from './SelectedWork.module.css';

// Awwwards-style "Selected Work" — a large themed project player pinned in the
// centre of the viewport, with a compact vertical name list beside it. GSAP
// ScrollTrigger pins the player and steps the active project as each name
// reaches the list centre; media/text crossfade with scale + blur; the list
// scrolls continuously. Releases after the last project. Themed with the
// brand's pixel tiles: stepped media corners, a checkerboard tile wipe on
// project change, tile-font counter and a tile progress strip.

const ACCENTS = ['#c9a24b', '#8ea6c4', '#b98a6e', '#84a493', '#a98bb2', '#cfc7ba'];
const num = (n: number) => String(n + 1).padStart(2, '0');

// checker wipe grid (cols x rows tiles over the media)
const WIPE_COLS = 16;
const WIPE_ROWS = 11;

export default function SelectedWork({ projects }: { projects: ProjectListItem[] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
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
      // Wait for GSAP/ScrollTrigger AND for AppInitializer to finish its init
      // (it runs ScrollTrigger.killAll() then creates Lenis last — so once
      // window.lenis exists, our trigger won't be killed). Fall back after ~4s.
      if (!gsap || !ScrollTrigger || (!w.lenis && tries < 40)) {
        if (tries++ < 90) setTimeout(setup, 100);
        return;
      }
      const N = projects.length;
      mm = gsap.matchMedia();

      // Pinning is done with CSS position:sticky (no pin-spacer → no conflict
      // with the template's existing pinned sections). ScrollTrigger only
      // tracks progress to drive the active project + list scroll. Runs at all
      // sizes; on mobile the side list is hidden (centered player only).
      mm.add('(min-width: 1px)', () => {
        const root = rootRef.current;
        const list = listRef.current;
        if (!root || !list) return;

        let firstCenter = 0;
        let step = 0;
        const measure = () => {
          const items = list.querySelectorAll<HTMLElement>('[data-item]');
          if (items.length < 2) return;
          const vp = list.parentElement!; // list viewport
          const a = items[0].offsetTop + items[0].offsetHeight / 2;
          const b = items[1].offsetTop + items[1].offsetHeight / 2;
          step = b - a;
          firstCenter = a - vp.clientHeight / 2;
        };
        measure();

        let st: any = null;
        const create = () => {
          st = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: measure,
            onUpdate: (self: any) => {
              const f = self.progress * (N - 1);
              gsap.set(list, { y: -(firstCenter + f * step) });
              // tile progress strip: fills tile-by-tile (18 tiles), binary steps
              if (fillRef.current) {
                const filled = Math.round(self.progress * 18);
                fillRef.current.style.width = `${(filled / 18) * 100}%`;
              }
              const idx = Math.round(f);
              if (idx !== activeRef.current) {
                activeRef.current = idx;
                setActive(idx);
              }
            },
          });
          requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        create();

        // AppInitializer runs ScrollTrigger.killAll() when it (re)initialises
        // (dev double-effect, client-side navigation) — recreate ours if it
        // gets swept away.
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

  // Play the active frame's video, pause the others (React's `muted` prop
  // quirk can block autoplay, so drive playback imperatively).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLVideoElement>('video').forEach((v) => {
      const isActive = !!v.closest(`.${styles.frameActive}`);
      v.muted = true;
      if (isActive) {
        v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, [active, projects]);

  if (!projects.length) return null;
  const N = projects.length;
  const accent = ACCENTS[active % ACCENTS.length];

  return (
    <section
      ref={rootRef}
      className={styles.root}
      style={{ ['--sw-h' as string]: `${N * 90}vh` }}
      aria-label="Selected work"
    >
      {/* ---------- desktop: sticky-pinned showcase ---------- */}
      <div className={styles.pin} style={{ ['--accent' as string]: accent }}>
        <div className={styles.topbar}>
          <span className={`${styles.tag} ${styles.pixelTag}`}>
            <PixelText text="SELECTED WORK" cursor={false} />
            <i />
          </span>
          <span className={styles.tag}>2025 — PORTFOLIO</span>
        </div>

        <div className={styles.stage}>
          {/* side list */}
          <div className={styles.listViewport}>
            <ul ref={listRef} className={styles.list}>
              {projects.map((p, i) => (
                <li key={p.id} data-item className={`${styles.item} ${i === active ? styles.itemActive : ''}`}>
                  <span className={styles.itemNum}>{num(i)}</span>
                  <span className={styles.itemName}>{p.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* centre player */}
          <div className={styles.player}>
            <div className={styles.mediaShell}>
              <div className={styles.media}>
                {projects.map((p, i) => (
                  <div key={p.id} className={`${styles.frame} ${i === active ? styles.frameActive : ''}`}>
                    {p.video ? (
                      <video src={p.video} muted loop playsInline autoPlay preload="metadata" />
                    ) : p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} loading="lazy" />
                    ) : (
                      <span className={styles.noMedia} />
                    )}
                  </div>
                ))}

                {/* checkerboard tile wipe — remounts (and replays) on change */}
                <div key={active} className={styles.wipe} aria-hidden="true">
                  {Array.from({ length: WIPE_COLS * WIPE_ROWS }).map((_, i) => {
                    const c = i % WIPE_COLS;
                    const r = (i / WIPE_COLS) | 0;
                    const d = c * 16 + ((r + c) % 2) * 80; // sweep + checker offset (ms)
                    return (
                      <i
                        key={i}
                        className={(r * 7 + c * 3) % 11 === 0 ? styles.wipeAccent : undefined}
                        style={{ animationDelay: `${d}ms` }}
                      />
                    );
                  })}
                </div>

                <div className={styles.mediaBar}>
                  <span className={styles.play} aria-hidden="true">▶</span>
                  <span className={styles.counter}>
                    <span className={styles.pixelNum}>
                      <PixelText text={num(active)} cursor={false} />
                    </span>
                    <span className={styles.progress}>
                      <span ref={fillRef} className={styles.progressFill} />
                    </span>
                    <span className={styles.pixelNum}>
                      <PixelText text={num(N - 1)} cursor={false} />
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.info}>
              {projects.map((p, i) => (
                <div key={p.id} className={`${styles.infoBlock} ${i === active ? styles.infoActive : ''}`}>
                  <div className={styles.cat}>{(p.category || p.subtitle || 'Project').toUpperCase()}</div>
                  <h3 className={styles.title}>{p.title}</h3>
                  {p.desc && <p className={styles.desc}>{p.desc}</p>}
                  <Link className={styles.view} href={`/project-details/${p.id}`}>
                    VIEW PROJECT <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.hint}>
          <span className={styles.mouse} /> SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}
