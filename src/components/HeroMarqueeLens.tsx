'use client';

import { useEffect } from 'react';

// Pixel-art bitmaps ('#' = filled cell). Rendered as crisp SVG rects.
const BITMAPS: string[][] = [
  // heart
  [
    '.##.##.',
    '#######',
    '#######',
    '.#####.',
    '..###..',
    '...#...',
  ],
  // crown
  [
    '#..#..#',
    '#..#..#',
    '#######',
    '#######',
    '.#####.',
  ],
  // diamond
  [
    '..##..',
    '.####.',
    '######',
    '.####.',
    '..##..',
  ],
  // space invader
  [
    '..#.....#..',
    '...#...#...',
    '..#######..',
    '.##.###.##.',
    '###########',
    '#.#######.#',
    '#.#.....#.#',
    '...##.##...',
  ],
  // pixel star
  [
    '...#...',
    '..###..',
    '#######',
    '.#####.',
    '..###..',
    '.#...#.',
  ],
];

function bitmapToSvg(rows: string[]): string {
  const h = rows.length;
  const w = rows[0].length;
  let rects = '';
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rows[y][x] === '#') {
        rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">${rects}</svg>`;
}

// Overlays the hero marquee with a circular "lens" that tracks the smiley:
// inside the circle the scrolling text appears as pixel icons (moving at the
// exact same speed — the icon strip mirrors the real track's transform every
// frame), outside it stays the normal text marquee.
export default function HeroMarqueeLens() {
  useEffect(() => {
    let raf = 0;
    let overlay: HTMLDivElement | null = null;
    let tries = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanupInit: (() => void) | null = null;

    let maskedEl: HTMLElement | null = null;

    const init = (): boolean => {
      const marquee = document.querySelector('.mxd-hero-02-marquee');
      const line = marquee?.querySelector('.mxd-hero-02-marquee__line') as HTMLElement | null;
      const textMarquee = line?.querySelector('.marquee') as HTMLElement | null;
      const track = line?.querySelector('.marquee__toleft') as HTMLElement | null;
      // the BALL is its own layer now (behind the body so fingers overlap it)
      const smiley = marquee?.querySelector('.hero-ball') as HTMLElement | null;
      // Wait until the marquee is actually animating (GSAP has set a transform).
      if (!marquee || !line || !textMarquee || !track || !smiley) return false;
      if (getComputedStyle(track).transform === 'none') return false;
      maskedEl = textMarquee;

      overlay = document.createElement('div');
      overlay.className = 'marquee-lens';
      overlay.setAttribute('aria-hidden', 'true');

      const strip = document.createElement('div');
      strip.className = 'marquee-lens__strip';
      overlay.appendChild(strip);
      // Mount on the marquee container, NOT the line: the line's loading
      // animation leaves a transform on it (-> stacking context), which would
      // trap the overlay below the smiley (z-index 2). On the container the
      // overlay's z-index wins.
      (marquee as HTMLElement).appendChild(overlay);

      // Fill the strip with icons until it's comfortably wide, then duplicate
      // it once so we can loop seamlessly with a modulo.
      const addSet = () => {
        BITMAPS.forEach((bm) => {
          const span = document.createElement('span');
          span.className = 'marquee-lens__icon';
          span.innerHTML = bitmapToSvg(bm);
          strip.appendChild(span);
        });
      };
      addSet();
      // If our stylesheet hasn't applied yet, icons measure ~0 (or explode to
      // full width) — bail out and retry instead of mis-building.
      const probe = strip.firstElementChild as HTMLElement | null;
      const pw = probe ? probe.getBoundingClientRect().width : 0;
      if (!probe || pw < 30 || pw > 300 || getComputedStyle(overlay).position !== 'absolute') {
        overlay.remove();
        overlay = null;
        return false;
      }
      let guard = 0;
      while (strip.scrollWidth < 2600 && guard++ < 20) addSet();
      const setLen = strip.children.length;
      strip.innerHTML += strip.innerHTML; // duplicate for seamless loop

      // EXACT loop period: distance between the first icon of each set.
      // (scrollWidth/2 is wrong by gap/2 because of the flex gap — that was
      // the visible "jump" every time the strip wrapped.)
      const first = strip.children[0] as HTMLElement;
      const second = strip.children[setLen] as HTMLElement;
      const stripPeriod = second.offsetLeft - first.offsetLeft;

      // The lens tracks the dedicated ball element: its centre IS the ball
      // centre, radius just inside the sphere's edge.
      const HEAD = { cx: 0.5, cy: 0.5, r: 0.49 };

      // Static band geometry — only changes on resize, never per frame.
      // The head sits ON the marquee line (original composition): the icon
      // strip is the TEXT LINE's band with the ORIGINAL fixed icon sizes —
      // the exact icons-to-text ratio the effect always had. The overlay box
      // is sized to the character's region (the head pokes above the line's
      // container, so an inset:0 overlay would clip it); all coordinates are
      // relative to the overlay's own rect.
      const measureBand = () => {
        if (!overlay) return;
        const or = (marquee as HTMLElement).getBoundingClientRect();
        const lr = line.getBoundingClientRect();
        const ir = smiley.getBoundingClientRect();
        const pad = ir.width * 0.06;
        overlay.style.top = `${ir.top - or.top - pad}px`;
        overlay.style.height = `${ir.height + pad * 2}px`;
        const ovTop = ir.top - pad; // overlay's viewport top as just laid out
        strip.style.top = `${lr.top - ovTop}px`;
        strip.style.left = `${lr.left - or.left}px`;
        strip.style.height = `${lr.height}px`;
      };
      measureBand();

      // Only animate while the hero is actually on screen — the loop used to
      // run for the entire page life, stealing frames from every section.
      let onScreen = true;
      // Resize (mobile URL-bar show/hide fires it mid-scroll) is rAF-debounced,
      // and while the hero is off-screen the re-measure is DEFERRED to the IO
      // re-entry below — it runs before the tick restarts, so the hero is
      // re-measured before a single new frame of it paints (pixel-identical),
      // and scrolling other sections never pays the 3 forced rect reads.
      let measureDirty = false;
      let measureQueued = false;
      const onResize = () => {
        if (measureQueued) return;
        measureQueued = true;
        requestAnimationFrame(() => {
          measureQueued = false;
          if (!onScreen) { measureDirty = true; return; }
          measureBand();
        });
      };
      window.addEventListener('resize', onResize);

      const io = new IntersectionObserver((entries) => {
        // latest entry, not the oldest of a batched flicker
        const e = entries[entries.length - 1];
        const was = onScreen;
        onScreen = e.isIntersecting;
        if (onScreen && !was) {
          if (measureDirty) { measureDirty = false; measureBand(); }
          // never stack a second loop on a pending frame
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(tick);
        }
      });
      io.observe(marquee as HTMLElement);

      let lastClip = '';
      const tick = () => {
        if (!overlay || !onScreen) return;

        // --- READS FIRST (batched so no write below forces a sync re-layout) ---
        // Mirror the real track's x-position (style read, no layout).
        const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
        // The character BOBS vertically (CSS mxd-move, ±1rem @1.2s), so the
        // lens circle must follow it EVERY frame at sub-pixel precision.
        // These two rects are the only layout reads; taking them before any
        // style write keeps layout clean.
        const ovR = overlay.getBoundingClientRect();
        const sr = smiley.getBoundingClientRect();

        // --- COMPUTE ---
        const x = -((-m.m41 % stripPeriod + stripPeriod) % stripPeriod);
        // the lens is the character's HEAD; coords relative to the overlay
        // box (which is sized to the character's region, not the container)
        const cx = sr.left + sr.width * HEAD.cx - ovR.left;
        const cy = sr.top + sr.height * HEAD.cy - ovR.top;
        const r = sr.width * HEAD.r;
        // sub-pixel (no Math.round) so the circle glides with the ball
        const clip = r > 4 ? `circle(${r}px at ${cx}px ${cy}px)` : 'circle(0 at 50% 50%)';

        // --- WRITES ---
        // NOTE: the text is hidden under the ball by the overlay's OPAQUE
        // page-coloured backing (CSS) — the old per-move mask-image on the
        // text marquee re-rasterised that whole layer and caused the
        // hero→next-section freeze; clip-path on this one overlay is cheap.
        strip.style.transform = `translate3d(${x}px,0,0)`;
        if (clip !== lastClip) {
          lastClip = clip;
          overlay.style.clipPath = clip;
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      cleanupInit = () => {
        window.removeEventListener('resize', onResize);
        io.disconnect();
      };
      return true;
    };

    let disposed = false;
    const tryInit = () => {
      if (disposed) return;
      // generous retry window (~45s): slow devices/first paints can take a
      // while before the marquee tween writes its first transform. Each
      // retry attempt runs at browser IDLE (not inside a scroll frame) —
      // the probe build/measure/remove churn of a failed attempt was
      // landing mid-scroll on slow first loads.
      if (!init() && tries++ < 180) {
        retryTimer = setTimeout(() => {
          const w = window as unknown as {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
          };
          if (w.requestIdleCallback) w.requestIdleCallback(tryInit, { timeout: 400 });
          else tryInit();
        }, 250);
      }
    };
    tryInit();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (retryTimer) clearTimeout(retryTimer);
      cleanupInit?.();
      overlay?.remove();
      if (maskedEl) {
        maskedEl.style.webkitMaskImage = '';
        maskedEl.style.maskImage = '';
      }
    };
  }, []);

  return null;
}
