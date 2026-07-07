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

// Poster convention: a webp first-frame sitting beside the video file
// (e.g. …/ami-loop.mp4 → …/ami-loop-poster.webp). Shown while approaching
// the section so the video costs nothing until the viewer is pinned.
const posterOf = (videoUrl: string) => videoUrl.replace(/\.(mp4|webm|mov)(\?.*)?$/i, '-poster.webp');

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
  // The wipe only exists in the DOM for a short window after a REAL project
  // change (never on initial load), then React removes it — no reliance on
  // CSS animation fill states, so tiles can never get stuck on screen.
  const [wipeOn, setWipeOn] = useState(false);
  // Direction of the last step (+1 down / -1 up) and a monotonic transition
  // counter — both set at commit time (before setActive) so the wipe render
  // reads stable values: down sweeps left→right, up sweeps right→left, and
  // the motif cycles heart→trophy→1UP per TRANSITION (not per index, which
  // made back-and-forth steps repeat the same icon and feel direction-blind).
  const dirRef = useRef(1);
  const wipeSeqRef = useRef(0);
  // Video elements mount only once the viewer is pinned — until then video
  // works show a poster image (zero network/decoder cost on the way down).
  // Armed from the ScrollTrigger (progress > 0 = pin engaged); IO delivery is
  // too flaky for this.
  const [videoArmed, setVideoArmed] = useState(false);
  const videoArmedRef = useRef(false);
  const firstActive = useRef(true);
  const inViewRef = useRef(false);

  useEffect(() => {
    if (firstActive.current) { firstActive.current = false; return; }
    setWipeOn(true);
    // haptic tick on each detent (Android Chrome; iOS Safari has no vibration
    // API — there the native scroll-snap physics provide the tactile feel)
    try { (navigator as Navigator & { vibrate?: (ms: number) => void }).vibrate?.(12); } catch { /* noop */ }

    // On phones, hold the scroll while the transition plays — one flick = one
    // clean project change; scrolling resumes the moment the wipe is done.
    // The hold blocks the INPUT EVENTS (preventDefault on touchmove/wheel)
    // instead of toggling overflow on <html>: the overflow toggle forced a
    // full-page reflow right at the transition — the freeze users felt when
    // scrolling from the hero into this section.
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const w = window as unknown as { lenis?: { stop?: () => void; start?: () => void } };
    const prevent = (ev: Event) => ev.preventDefault();
    if (isMobile) {
      w.lenis?.stop?.();
      window.addEventListener('touchmove', prevent, { passive: false });
      window.addEventListener('wheel', prevent, { passive: false });
    }
    const unlock = () => {
      if (isMobile) {
        window.removeEventListener('touchmove', prevent);
        window.removeEventListener('wheel', prevent);
        w.lenis?.start?.();
      }
    };

    const t = setTimeout(() => { setWipeOn(false); unlock(); }, 260); // motif gone ~220ms, field ~240ms
    return () => { clearTimeout(t); unlock(); };
  }, [active]);

  // Mount the <video> elements while the browser is idle after load — they
  // are preload="none" and only play() once active AND in view, so mounting
  // costs no network. Mounting them mid-scroll (the old 150px-before-the-pin
  // trigger alone) put a React commit + layout right at the hero→viewer
  // boundary: the hitch felt on the first flick down. The scroll trigger
  // stays as a fallback for users who scroll before idle fires.
  useEffect(() => {
    const arm = () => {
      if (!videoArmedRef.current) { videoArmedRef.current = true; setVideoArmed(true); }
    };
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(arm, { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(arm, 2500);
    return () => clearTimeout(t);
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
            onUpdate: (self: any) => {
              // pin engaged → mount the video elements (posters showed until now)
              if (!videoArmedRef.current && self.progress > 0.001) {
                videoArmedRef.current = true;
                setVideoArmed(true);
              }
              const f = self.progress * (N - 1);
              gsap.set(list, { y: -(firstCenter + f * step) });
              // tile progress strip: fills tile-by-tile (18 tiles), binary steps
              if (fillRef.current) {
                const filled = Math.round(self.progress * 18);
                fillRef.current.style.width = `${(filled / 18) * 100}%`;
              }
              // Hysteresis: only commit to a new project once we're clearly
              // inside its zone (not hovering the .5 boundary). Stops the tile
              // wipe from flip-flopping / re-firing on jittery mobile scroll,
              // so the checkerboard only appears on a real transition.
              const idx = Math.round(f);
              if (idx !== activeRef.current && Math.abs(f - idx) < 0.4) {
                dirRef.current = idx > activeRef.current ? 1 : -1;
                wipeSeqRef.current += 1;
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

        // Arm the <video> elements when the scroll gets within 150px of the
        // pin (plain scroll listener — fires on every real touch/lenis
        // scroll, no IO/ST delivery quirks). Until then video works show
        // only their poster: zero network/decoder cost on the way down.
        const armOnScroll = () => {
          if (!st) return;
          if (window.scrollY > st.start - 150) {
            inViewRef.current = true; // this close, the section fills the screen
            if (!videoArmedRef.current) {
              videoArmedRef.current = true;
              setVideoArmed(true);
            } else {
              syncVideos(); // already mounted at idle — just start the active one
            }
            window.removeEventListener('scroll', armOnScroll);
          }
        };
        window.addEventListener('scroll', armOnScroll, { passive: true });
        armOnScroll(); // page may load already inside the section

        return () => {
          clearInterval(guard);
          window.removeEventListener('scroll', armOnScroll);
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
  useEffect(syncVideos, [active, videoArmed, projects]);
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
      {/* Native scroll-snap detents (mobile) — one invisible snap point per
          work at its exact runway position, so the phone's own scroll physics
          settles each project into place like the iOS date-picker wheel. */}
      {Array.from({ length: N }).map((_, i) => (
        <div
          key={`snap-${i}`}
          className={styles.snapPoint}
          aria-hidden="true"
          style={{ top: `calc((${N * 90}vh - 100vh) * ${N > 1 ? i / (N - 1) : 0})` }}
        />
      ))}

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
                      <>
                        {/* poster shows on approach; the video element only
                            exists once the viewer is pinned */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={posterOf(p.video)}
                          alt={p.title}
                          loading="lazy"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                        />
                        {videoArmed && (
                          <video
                            src={p.video}
                            muted
                            loop
                            playsInline
                            preload="none"
                            style={{ position: 'absolute', inset: 0 }}
                          />
                        )}
                      </>
                    ) : p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} loading="lazy" />
                    ) : (
                      <span className={styles.noMedia} />
                    )}
                  </div>
                ))}

                {/* checkerboard tile wipe — only exists in the DOM for ~260ms
                    after a real project change (React removes it, so tiles can
                    never linger). The tiles draw a heart / trophy / 1UP
                    mid-transition: tiles pop in staggered (sweep), each LAYER
                    pops out as one — dark field first, motif a beat later. */}
                {wipeOn && (() => {
                  const dir = dirRef.current;
                  const shape = WIPE_SHAPES[wipeSeqRef.current % WIPE_SHAPES.length];
                  const rowOff = Math.floor((WIPE_ROWS - shape.length) / 2);
                  const colOff = Math.floor((WIPE_COLS - shape[0].length) / 2);
                  // scroll down: sweep left→right; scroll up: mirrored right→left
                  const delay = (c: number, r: number) =>
                    (dir === 1 ? c : WIPE_COLS - 1 - c) * 3 + ((r + c) % 2) * 18;
                  // only the shape's own cells get DOM nodes (placed on the grid)
                  const shapeCells: { c: number; r: number; ch: string }[] = [];
                  shape.forEach((row, sr) =>
                    [...row].forEach((ch, sc) => {
                      if (ch === '#' || ch === 'o') shapeCells.push({ c: sc + colOff, r: sr + rowOff, ch });
                    })
                  );
                  return (
                    <>
                      <div key={`d${wipeSeqRef.current}`} className={`${styles.wipe} ${styles.wipeDarkLayer}`} aria-hidden="true">
                        {Array.from({ length: WIPE_COLS * WIPE_ROWS }).map((_, i) => {
                          const c = i % WIPE_COLS;
                          const r = (i / WIPE_COLS) | 0;
                          return <i key={i} className={styles.wipeDark} style={{ animationDelay: `${delay(c, r)}ms` }} />;
                        })}
                      </div>
                      <div key={`s${wipeSeqRef.current}`} className={`${styles.wipe} ${styles.wipeShapeLayer} ${dir === -1 ? styles.wipeUp : ''}`} aria-hidden="true">
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
