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
      strip.innerHTML += strip.innerHTML; // duplicate for seamless loop

      const tick = () => {
        if (!overlay) return;
        // Mirror the real track's x-position (works no matter how GSAP drives it).
        const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
        const half = strip.scrollWidth / 2;
        const x = half > 0 ? -((-m.m41 % half + half) % half) : 0;
        strip.style.transform = `translate3d(${x}px,0,0)`;

        // Keep the strip riding the marquee line's band (overlay covers the
        // whole hero-marquee container).
        const or = (marquee as HTMLElement).getBoundingClientRect();
        const lr = line.getBoundingClientRect();
        strip.style.top = `${lr.top - or.top}px`;
        strip.style.left = `${lr.left - or.left}px`;
        strip.style.height = `${lr.height}px`;

        // Keep the lens glued to the smiley (handles resize / motion). The
        // smiley PNG has transparent padding, so use a factor that matches the
        // visible ball — icons only appear once truly inside it.
        const sr = smiley.getBoundingClientRect();
        const cx = sr.left + sr.width / 2 - or.left;
        const cy = sr.top + sr.height / 2 - or.top;
        const r = Math.min(sr.width, sr.height) * 0.36;
        overlay.style.clipPath = r > 4 ? `circle(${r}px at ${cx}px ${cy}px)` : 'circle(0 at 50% 50%)';

        // Cut a matching hole in the text marquee so ONLY icons show inside
        // the ball (the ball is slightly translucent, so unmasked text would
        // ghost through).
        if (maskedEl) {
          const mr = maskedEl.getBoundingClientRect();
          const mx = sr.left + sr.width / 2 - mr.left;
          const my = sr.top + sr.height / 2 - mr.top;
          const mask =
            r > 4
              ? `radial-gradient(circle at ${mx}px ${my}px, transparent ${r - 1}px, #000 ${r}px)`
              : '';
          maskedEl.style.webkitMaskImage = mask;
          maskedEl.style.maskImage = mask;
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return true;
    };

    const tryInit = () => {
      if (!init() && tries++ < 60) retryTimer = setTimeout(tryInit, 250);
    };
    tryInit();

    return () => {
      cancelAnimationFrame(raf);
      if (retryTimer) clearTimeout(retryTimer);
      overlay?.remove();
      if (maskedEl) {
        maskedEl.style.webkitMaskImage = '';
        maskedEl.style.maskImage = '';
      }
    };
  }, []);

  return null;
}
