'use client';

import { useEffect, useRef, useState } from 'react';

// Kawaii stop-motion faces (plus the pixel-G logo) on a 13x9 pixel box,
// centred on the loader's clean background — no full-screen tile field.
// '#' = bright tile, '*' = accent tile, '.' = empty (transparent).
const FACES: string[][] = [
  // 0 — happy: tall shiny eyes (inner-top notch), ω mouth tight under them,
  // chunky cheek blush — features sit low = kawaii proportions.
  [
    '.............',
    '.............',
    '.............',
    '..#.......#..',
    '..##.....##..',
    '..##.....##..',
    '**...#.#...**',
    '......#......',
    '.............',
  ],
  // 1 — blink
  [
    '.............',
    '.............',
    '.............',
    '.............',
    '.............',
    '..##.....##..',
    '**...#.#...**',
    '......#......',
    '.............',
  ],
  // 2 — joy (^ ^ eyes, open mouth with accent tongue, corner sparkles)
  [
    '.............',
    '*...........*',
    '.............',
    '...#.....#...',
    '..#.#...#.#..',
    '.............',
    '**...###...**',
    '.....#*#.....',
    '.............',
  ],
  // 3 — star eyes (full accent)
  [
    '.............',
    '.............',
    '.............',
    '..**.....**..',
    '..**.....**..',
    '..**.....**..',
    '.....#.#.....',
    '......#......',
    '.............',
  ],
  // 4 — wink (right eye open with shine, accent tongue)
  [
    '.............',
    '.............',
    '.............',
    '..........#..',
    '.........##..',
    '..##.....##..',
    '**...#.#...**',
    '......*......',
    '.............',
  ],
  // 5 — uwu (closed drooping eyes, ω mouth)
  [
    '.............',
    '.............',
    '.............',
    '.............',
    '..##.....##..',
    '.#.........#.',
    '**...#.#...**',
    '......#......',
    '.............',
  ],
  // 6 — pixel-G logo (accent on the bottom bar, like the artwork)
  [
    '.............',
    '.............',
    '.....###.....',
    '....#........',
    '....#..##....',
    '....#...#....',
    '.....##*.....',
    '.............',
    '.............',
  ],
  // 7 — pixel-G (accent at the inner bar)
  [
    '.............',
    '.............',
    '.....###.....',
    '....#........',
    '....#..#*....',
    '....#...#....',
    '.....###.....',
    '.............',
    '.............',
  ],
  // 8 — pixel-G (accent on the top bar)
  [
    '.............',
    '.............',
    '.....#*#.....',
    '....#........',
    '....#..##....',
    '....#...#....',
    '.....###.....',
    '.............',
    '.............',
  ],
];

// Frame sequence — expressive frames lead (the loader window is short on fast
// loads), morphing into the G logo mid-cycle, then back.
const SEQ = [0, 2, 2, 3, 3, 0, 4, 4, 1, 0, 6, 6, 7, 7, 8, 8, 0, 2, 2, 5, 5, 1, 0, 3, 3, 0];

const FACE_H = 9;
const FACE_W = 13;

export default function PixelLoader() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const gridRef = useRef<HTMLSpanElement | null>(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      id = setInterval(() => setStep((s) => (s + 1) % SEQ.length), 150);
    }

    // Once the loader has finished (hideLoader adds .loaded), stop the frame
    // interval and unmount the tiles.
    const loaderEl = document.getElementById('loader');
    let mo: MutationObserver | undefined;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (id) clearInterval(id);
      setDone(true);
    };
    if (loaderEl) {
      if (loaderEl.classList.contains('loaded')) {
        finish();
      } else {
        mo = new MutationObserver(() => {
          if (loaderEl.classList.contains('loaded')) finish();
        });
        mo.observe(loaderEl, { attributes: true, attributeFilter: ['class'] });
      }
    }
    doneTimer = setTimeout(finish, 12000); // safety net

    return () => {
      if (id) clearInterval(id);
      if (mo) mo.disconnect();
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, []);

  // Entrance — checkerboard build-in of the face tiles (binary pops).
  useEffect(() => {
    if (enteredRef.current || !gridRef.current) return;
    enteredRef.current = true;
    const w = window as unknown as { gsap?: typeof import('gsap').gsap };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!w.gsap) return; // CSS fade-in fallback still applies
    const g = w.gsap;
    const tiles = Array.from(gridRef.current.children);
    const checkerA: Element[] = [];
    const checkerB: Element[] = [];
    tiles.forEach((t, i) => {
      ((Math.floor(i / FACE_W) + (i % FACE_W)) % 2 === 0 ? checkerA : checkerB).push(t);
    });
    g.set(gridRef.current, { opacity: 1 });
    g.from(checkerA, {
      opacity: 0,
      duration: 0.001,
      ease: 'none',
      stagger: { grid: 'auto', axis: 'x', from: 'start', amount: 0.35 },
    });
    g.from(checkerB, {
      opacity: 0,
      duration: 0.001,
      ease: 'none',
      delay: 0.4,
      stagger: { grid: 'auto', axis: 'x', from: 'start', amount: 0.35 },
    });
  }, []);

  // After the loader exit, render nothing — frees the tile nodes entirely.
  if (done) return null;

  const face = FACES[SEQ[step]];
  const cells = [];
  for (let r = 0; r < FACE_H; r++) {
    for (let c = 0; c < FACE_W; c++) {
      const ch = face[r][c];
      cells.push(
        <span
          key={`${r}-${c}`}
          className={
            'pixel-loader__tile' +
            (ch === '#' ? ' pixel-loader__tile--on' : '') +
            (ch === '*' ? ' pixel-loader__tile--accent' : '')
          }
        />
      );
    }
  }

  return (
    <span
      ref={gridRef}
      className="pixel-loader-screen is-ready"
      role="img"
      aria-label="Loading"
      style={{
        gridTemplateColumns: `repeat(${FACE_W}, var(--plt))`,
        gridTemplateRows: `repeat(${FACE_H}, var(--plt))`,
      }}
    >
      {cells}
    </span>
  );
}
