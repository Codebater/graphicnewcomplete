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

// Single brand accent (the pixel-green) — no per-project theme colours, so the
// section reads as one coherent GRAPHIQ system.
const ACCENT = '#DDF160';
const num = (n: number) => String(n + 1).padStart(2, '0');

// checker wipe grid (cols x rows tiles over the media)
const WIPE_COLS = 16;
const WIPE_ROWS = 11;

// Pixel-art motifs drawn BY the wipe tiles: while the dark tiles fade out
// early, the shape tiles (green, `o` = white highlight) hold a beat so a
// heart / trophy / 1UP reads mid-transition, then dissolves. Rotates per
// project so every change feels like a little arcade reward.
const WIPE_SHAPES: string[][] = [
  [
    // heart
    '..##...##..',
    '.#o##.####.',
    '###########',
    '###########',
    '.#########.',
    '..#######..',
    '...#####...',
    '....###....',
    '.....#.....',
  ],
  [
    // trophy
    '###########',
    '#.o######.#',
    '#.#######.#',
    '.#.#####.#.',
    '...#####...',
    '....###....',
    '.....#.....',
    '....###....',
    '..#######..',
  ],
  [
    // 1UP mushroom
    '...#####...',
    '..##ooo##..',
    '.###ooo###.',
    '#oo#####oo#',
    '.#########.',
    '...ooooo...',
    '...o#o#o...',
    '....ooo....',
  ],
];

export default function SelectedWork({ projects }: { projects: ProjectListItem[] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // The wipe only exists in the DOM for a short window (React removes it — no
  // reliance on CSS animation fill states, so tiles can never get stuck).
  // It fires on project changes AND once on section entry, with a cooldown:
  // a new transition can only START 1s after the previous one finished, so
  // fast scrolling can't chain transitions back to back.
  // ---- sequential stepper: Transition → Work → Transition → Work ----
  // Each step parks the scroll ON the new work and hard-locks it through the
  // transition plus a viewing beat. Scroll intent is only read while IDLE, so
  // steps can never chain, skip, or double-fire — one gesture, one work.
  const WIPE_MS = 820;   // transition length (all wipe layers exit by ~760ms)
  const HOLD_MS = 1000;  // viewing beat after the transition before unlocking
  const [wipeOn, setWipeOn] = useState(false);
  const firstActive = useRef(true);
  const inViewRef = useRef(false);
  const lockUntilRef = useRef(0);
  const wipeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockRef = useRef<() => void>(() => {});
  const stRef = useRef<any>(null);

  // Park the page scroll at an exact step on the section's runway.
  const snapToF = (fTarget: number) => {
    const st = stRef.current;
    if (!st) return;
    const total = Math.max(1, projects.length - 1);
    const y = st.start + (fTarget / total) * (st.end - st.start);
    const l = (window as unknown as { lenis?: any }).lenis;
    if (l?.scrollTo && !l.isStopped) l.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y); // lenis stopped during the lock — park natively
  };
  const snapRef = useRef(snapToF);
  snapRef.current = snapToF;

  const startWipe = () => {
    lockUntilRef.current = Date.now() + WIPE_MS + HOLD_MS;
    setWipeOn(true);

    // Freeze the scroll for the whole step (transition + viewing beat).
    // Lenis covers desktop wheel; overflow/touch-action covers native touch.
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const w = window as unknown as { lenis?: { stop?: () => void; start?: () => void } };
    const html = document.documentElement;
    w.lenis?.stop?.();
    if (isMobile) {
      html.style.overflow = 'hidden';
      html.style.touchAction = 'none';
    }
    unlockRef.current = () => {
      if (isMobile) {
        html.style.overflow = '';
        html.style.touchAction = '';
      }
      w.lenis?.start?.();
    };

    if (wipeTimer.current) clearTimeout(wipeTimer.current);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    wipeTimer.current = setTimeout(() => setWipeOn(false), WIPE_MS);
    lockTimer.current = setTimeout(() => {
      unlockRef.current();
      snapRef.current(activeRef.current); // release exactly parked on the work
    }, WIPE_MS + HOLD_MS);
  };
  const startWipeRef = useRef(startWipe);
  startWipeRef.current = startWipe;

  useEffect(() => {
    if (firstActive.current) { firstActive.current = false; return; }
    startWipeRef.current();
  }, [active]);

  // teardown safety: never leave the page scroll-locked
  useEffect(() => () => {
    if (wipeTimer.current) clearTimeout(wipeTimer.current);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    unlockRef.current();
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
            // Entry transition: the moment the section pins (viewer centred),
            // the wipe plays once, parked on the first work.
            onEnter: () => {
              startWipeRef.current();
              snapRef.current(activeRef.current);
            },
            // Coming back up from below: land parked on the LAST work.
            onEnterBack: () => {
              if (activeRef.current !== N - 1) {
                activeRef.current = N - 1;
                setActive(N - 1); // fires the wipe via the active effect
              } else {
                startWipeRef.current();
              }
              snapRef.current(N - 1);
            },
            onUpdate: (self: any) => {
              const f = self.progress * (N - 1);
              gsap.set(list, { y: -(firstCenter + f * step) });
              // tile progress strip: fills tile-by-tile (18 tiles), binary steps
              if (fillRef.current) {
                const filled = Math.round(self.progress * 18);
                fillRef.current.style.width = `${(filled / 18) * 100}%`;
              }
              // Sequential stepper:
              // LOCKED — hard-park the scroll on the active work every frame
              //   (kills touch momentum; nothing can drift or queue).
              // IDLE — a deliberate push past half a zone steps EXACTLY one
              //   work (and immediately parks + locks again).
              const cur = activeRef.current;
              if (Date.now() < lockUntilRef.current) {
                if (Math.abs(f - cur) > 0.03) snapRef.current(cur);
                return;
              }
              if (f - cur > 0.5 && cur < N - 1) {
                activeRef.current = cur + 1;
                setActive(cur + 1);       // fires the wipe (locks + parks)
                snapRef.current(cur + 1);
              } else if (f - cur < -0.5 && cur > 0) {
                activeRef.current = cur - 1;
                setActive(cur - 1);
                snapRef.current(cur - 1);
              }
            },
          });
          stRef.current = st;
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

  // Play the active frame's video ONLY while the section is near the viewport
  // (videos are preload="none", so nothing downloads or decodes during the
  // initial hero scroll on mobile). Pause everything else.
  const syncVideos = () => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLVideoElement>('video').forEach((v) => {
      const isActive = !!v.closest(`.${styles.frameActive}`);
      v.muted = true;
      if (isActive && inViewRef.current) {
        v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  };
  useEffect(syncVideos, [active, projects]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        syncVideos();
      },
      // the section starts right below the 100vh hero, so at page load its
      // edge already touches the viewport bottom — require ~120px of real
      // entry before the video is allowed to load/play
      { rootMargin: '0px 0px -120px 0px' }
    );
    io.observe(root);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!projects.length) return null;
  const N = projects.length;
  const accent = ACCENT;

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
          <span className={`${styles.tag} ${styles.metaTag}`}>2025 — PORTFOLIO</span>
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
                      <video src={p.video} muted loop playsInline preload="none" />
                    ) : p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} loading="lazy" />
                    ) : (
                      <span className={styles.noMedia} />
                    )}
                  </div>
                ))}

                {/* checkerboard tile wipe — only exists in the DOM for ~1.15s
                    after a real project change (React removes it, so tiles can
                    never linger). The tiles draw a heart / trophy / 1UP
                    mid-transition: tiles pop in staggered (sweep), each LAYER
                    pops out as one — dark field first, motif a beat later. */}
                {wipeOn && (() => {
                  const shape = WIPE_SHAPES[active % WIPE_SHAPES.length];
                  const rowOff = Math.floor((WIPE_ROWS - shape.length) / 2);
                  const colOff = Math.floor((WIPE_COLS - shape[0].length) / 2);
                  const delay = (c: number, r: number) => c * 12 + ((r + c) % 2) * 60;
                  // only the shape's own cells get DOM nodes (placed on the grid)
                  const shapeCells: { c: number; r: number; ch: string }[] = [];
                  shape.forEach((row, sr) =>
                    [...row].forEach((ch, sc) => {
                      if (ch === '#' || ch === 'o') shapeCells.push({ c: sc + colOff, r: sr + rowOff, ch });
                    })
                  );
                  return (
                    <>
                      <div key={`d${active}`} className={`${styles.wipe} ${styles.wipeDarkLayer}`} aria-hidden="true">
                        {Array.from({ length: WIPE_COLS * WIPE_ROWS }).map((_, i) => {
                          const c = i % WIPE_COLS;
                          const r = (i / WIPE_COLS) | 0;
                          return <i key={i} className={styles.wipeDark} style={{ animationDelay: `${delay(c, r)}ms` }} />;
                        })}
                      </div>
                      <div key={`s${active}`} className={`${styles.wipe} ${styles.wipeShapeLayer}`} aria-hidden="true">
                        {shapeCells.map(({ c, r, ch }, i) => (
                          <i
                            key={i}
                            className={ch === '#' ? styles.wipeShape : styles.wipeShapeAlt}
                            style={{ gridColumn: c + 1, gridRow: r + 1, animationDelay: `${delay(c, r)}ms` }}
                          />
                        ))}
                      </div>
                    </>
                  );
                })()}

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
