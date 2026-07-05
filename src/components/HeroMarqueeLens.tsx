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
      const smiley = marquee?.querySelector('.mxd-hero-02-marquee__image') as HTMLElement | null;
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

      // Static band geometry — only changes on resize, never per frame.
      const measureBand = () => {
        if (!overlay) return;
        const or = (marquee as HTMLElement).getBoundingClientRect();
        const lr = line.getBoundingClientRect();
        strip.style.top = `${lr.top - or.top}px`;
        strip.style.left = `${lr.left - or.left}px`;
        strip.style.height = `${lr.height}px`;
      };
      measureBand();
      window.addEventListener('resize', measureBand);

      // Only animate while the hero is actually on screen — the loop used to
      // run for the entire page life, stealing frames from every section.
      let onScreen = true;
      const io = new IntersectionObserver(([e]) => {
        const was = onScreen;
        onScreen = e.isIntersecting;
        if (onScreen && !was) raf = requestAnimationFrame(tick);
      });
      io.observe(marquee as HTMLElement);

      let frameNo = 0;
      let lastClip = '';
      const tick = () => {
        if (!overlay || !onScreen) return;
        // Mirror the real track's x-position (style read only — no layout).
        const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
        const x = -((-m.m41 % stripPeriod + stripPeriod) % stripPeriod);
        strip.style.transform = `translate3d(${x}px,0,0)`;

        // Lens tracking every 3rd frame; rects are cheap here (only transforms
        // change between frames, so layout stays clean) and the clip write is
        // guarded so nothing repaints unless the lens really moved.
        // NOTE: the text is hidden under the ball by the overlay's OPAQUE
        // page-coloured backing (see CSS) — the old per-move mask-image on
        // the text marquee re-rasterised that whole layer during scroll and
        // caused the hero→next-section freeze.
        if (frameNo++ % 3 === 0) {
          const or = (marquee as HTMLElement).getBoundingClientRect();
          const sr = smiley.getBoundingClientRect();
          const cx = sr.left + sr.width / 2 - or.left;
          const cy = sr.top + sr.height / 2 - or.top;
          const r = Math.min(sr.width, sr.height) * 0.36;
          const clip = r > 4 ? `circle(${Math.round(r)}px at ${Math.round(cx)}px ${Math.round(cy)}px)` : 'circle(0 at 50% 50%)';
          if (clip !== lastClip) {
            lastClip = clip;
            overlay.style.clipPath = clip;
          }
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      cleanupInit = () => {
        window.removeEventListener('resize', measureBand);
        io.disconnect();
      };
      return true;
    };

    const tryInit = () => {
      if (!init() && tries++ < 60) retryTimer = setTimeout(tryInit, 250);
    };
    tryInit();

    return () => {
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
