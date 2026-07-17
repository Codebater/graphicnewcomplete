'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function SelectedWork({ projects }: { projects: ProjectListItem[] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
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
    // subtle haptic tick on Android when the project changes (iOS has no API)
    try { (navigator as Navigator & { vibrate?: (ms: number) => void }).vibrate?.(12); } catch { /* noop */ }

    // Mobile no longer blocks the scroll during the wipe. The old input-block
    // (preventDefault on touchmove/wheel + lenis.stop for 260ms per step) plus
    // the scroll-snap detents made phone scrolling feel "stepped/stateful" —
    // every swipe locked for a beat and snapped. Desktop has neither and feels
    // perfect, so mobile now uses the SAME smooth continuous scrub: the wipe is
    // just a visual overlay over the project that's already changing underneath.
    const t = setTimeout(() => setWipeOn(false), 260); // motif gone ~220ms, field ~240ms
    return () => clearTimeout(t);
  }, [active]);

  // Aurora tile styles, computed ONCE per transition (176 unique inline
  // styles incl. color-mix). The wipe mount lands exactly while the next
  // section's pin engages, so recomputing them on every render during the
  // 260ms window was paid main-thread time at the worst possible moment.
  // active is the dep (not just wipeOn): a fast multi-step scroll keeps
  // wipeOn true across transitions but must still recolour for the new seq.
  const wipeTiles = useMemo(() => {
    if (!wipeOn) return null;
    const dir = dirRef.current;
    const seq = wipeSeqRef.current;
    // scroll down: sweep left→right; scroll up: mirrored right→left
    const delay = (c: number, r: number) =>
      (dir === 1 ? c : WIPE_COLS - 1 - c) * 3 + ((r + c) % 2) * 18;
    // subtle per-transition hue drift (kept small — big rotations would drag
    // the palette through greens the artwork avoids)
    const hueDrift = ((seq * 37) % 81) - 40;
    const tiles: React.CSSProperties[] = [];
    for (let i = 0; i < WIPE_COLS * WIPE_ROWS; i++) {
      const c = i % WIPE_COLS;
      const r = (i / WIPE_COLS) | 0;
      // aurora flows WITH the scroll: mirrored when stepping back
      const dx = (dir === 1 ? c / (WIPE_COLS - 1) : 1 - c / (WIPE_COLS - 1)) - 0.5;
      const dy = r / (WIPE_ROWS - 1) - 0.5;
      const d = Math.min(1, Math.hypot(dx, dy) * 1.9);
      // long-way hue lerp 215° → 390° (blue → violet core → orange),
      // never crossing green; top rows lean magenta
      const hue = (215 + (dx + 0.5) * 175 - dy * 35 + hueDrift + 360) % 360;
      const sat = Math.round(92 - d * 48);
      const light = Math.round(27 + d * 46);
      const melt = Math.max(0, Math.min(1, (d - 0.55) / 0.45)); // edges → page colour
      const vivid = Math.round(100 - melt * 82);
      const s: React.CSSProperties = {
        animationDelay: `${delay(c, r)}ms`,
        backgroundColor: `color-mix(in oklab, hsl(${hue} ${sat}% ${light}%) ${vivid}%, var(--base))`,
      };
      // sparse pattern tiles like the artwork (deterministic)
      const h = (c * 7 + r * 13 + seq * 5) % 23;
      if (h === 3) {
        s.backgroundImage =
          'repeating-linear-gradient(45deg, rgba(255,255,255,0.30) 0 2px, transparent 2px 6px)';
      } else if (h === 7) {
        s.backgroundImage = 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1.4px)';
        s.backgroundSize = '6px 6px';
      }
      tiles.push(s);
    }
    return { seq, styles: tiles };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wipeOn, active]);

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
        // Dedupe caches: scrub:1 keeps onUpdate firing for ~1s AFTER the pin
        // releases (catch-up tail overlapping the stacking-cards section below)
        // with values clamped constant — skip every write whose value hasn't
        // changed so those tail frames are pure no-ops.
        let lastY: number | null = null;
        let lastFilled = -1;
        let lastDrift = '';
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
              const y = -(firstCenter + f * step);
              if (y !== lastY) {
                lastY = y;
                gsap.set(list, { y });
              }
              // tile progress strip: fills tile-by-tile (18 tiles), binary steps
              if (fillRef.current) {
                const filled = Math.round(self.progress * 18);
                if (filled !== lastFilled) {
                  lastFilled = filled;
                  fillRef.current.style.width = `${(filled / 18) * 100}%`;
                }
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
              // scroll-linked drift: the active work slides gently against
              // the scroll on the way to the next project (CSS moves the
              // media by this var — transform-only, composited)
              const frac = Math.max(-0.5, Math.min(0.5, f - activeRef.current));
              const drift = frac.toFixed(4);
              if (drift !== lastDrift && mediaRef.current) {
                lastDrift = drift;
                mediaRef.current.style.setProperty('--sw-drift', drift);
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
      {/* ---------- sticky-pinned showcase (all sizes) ---------- */}
      <div className={styles.pin} style={{ ['--accent' as string]: accent }}>
        <div className={styles.topbar}>
          <span className={`${styles.tag} ${styles.pixelTag}`}>
            <PixelText text="SELECTED WORK" cursor={false} />
            <i />
          </span>
          <span className={`${styles.tag} ${styles.metaTag}`}>2026 — PORTFOLIO</span>
        </div>

        <div className={styles.stage}>
          {/* bento cluster: list tile + (media tile / info tile). The cluster
              stretches the list tile to the player column's height, so the
              boxes read as one composed bento. */}
          <div className={styles.cluster}>
          {/* side list */}
          <div className={styles.listViewport}>
            {/* mask lives on this inner wrapper — on the card itself it would
                fade the card surface away at the top/bottom, not just the
                names. measure() reads list.parentElement, so this wrapper IS
                the list viewport now. */}
            <div className={styles.listMask}>
              <ul ref={listRef} className={styles.list}>
                {projects.map((p, i) => (
                  <li key={p.id} data-item className={`${styles.item} ${i === active ? styles.itemActive : ''}`}>
                    <span className={styles.itemNum}>{num(i)}</span>
                    <span className={styles.itemName}>{p.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* centre player */}
          <div className={styles.player}>
            <div className={styles.mediaShell}>
              <div className={styles.media} ref={mediaRef}>
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

                {/* chromatic tile wipe (aurora mosaic) — only exists in the
                    DOM for ~260ms after a real project change (React removes
                    it, so tiles can never linger). Each tile is coloured from
                    a radial aurora field — blue → indigo core → magenta →
                    orange — melting into the page colour at the edges, with a
                    few striped/dotted accent tiles. Tiles pop in staggered
                    (direction-aware sweep) and the layer pops out as one.
                    Styles come from the memo above — computed once per
                    transition, not on every render while mounted. */}
                {wipeTiles && (
                  <div key={`d${wipeTiles.seq}`} className={`${styles.wipe} ${styles.wipeDarkLayer}`} aria-hidden="true">
                    {wipeTiles.styles.map((s, i) => (
                      <i key={i} className={styles.wipeDark} style={s} />
                    ))}
                  </div>
                )}

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
        </div>

        <div className={styles.hint}>
          <span className={styles.mouse} /> SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}
