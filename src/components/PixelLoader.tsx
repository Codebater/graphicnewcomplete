'use client';

import { useEffect, useRef, useState } from 'react';

// Kawaii stop-motion faces (plus the pixel-G logo) on an 11x9 pixel box,
// drawn in the middle of a full-screen tile field.
// '#' = bright tile, '*' = accent tile, '.' = filler.
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
  const [dims, setDims] = useState<{ cols: number; rows: number } | null>(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const gridRef = useRef<HTMLSpanElement | null>(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    const calc = () => {
      // Measure the container itself (not the window) and target ~3.8vw tiles.
      const w = gridRef.current?.clientWidth || window.innerWidth;
      const h = gridRef.current?.clientHeight || window.innerHeight;
      const t = Math.max(26, Math.min(52, w * 0.038));
      // The face must always fit with at least one margin column/row, and the
      // leftover must be EVEN so the face centers exactly (odd leftovers used
      // to push the face off-center on mobile).
      let cols = Math.max(FACE_W + 2, Math.ceil(w / t));
      let rows = Math.max(FACE_H + 2, Math.ceil(h / t));
      if ((cols - FACE_W) % 2 !== 0) cols += 1;
      if ((rows - FACE_H) % 2 !== 0) rows += 1;
      setDims({ cols, rows });
    };
    calc();
    window.addEventListener('resize', calc);

    let id: ReturnType<typeof setInterval> | undefined;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      id = setInterval(() => setStep((s) => (s + 1) % SEQ.length), 150);
    }

    // Once the loader has finished (hideLoader adds .loaded), stop the frame
    // interval and unmount the ~600 tiles — otherwise they keep re-rendering
    // forever behind the page and eat into scroll performance.
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
      window.removeEventListener('resize', calc);
      if (id) clearInterval(id);
      if (mo) mo.disconnect();
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, []);

  // Entrance — mirror of the exit: a 90s checkerboard build-in. Half the
  // tiles pop ON (binary, no fade) in a left-to-right sweep, then the other
  // half. Runs once, right after the grid first renders.
  useEffect(() => {
    if (!dims || enteredRef.current || !gridRef.current) return;
    enteredRef.current = true;
    const w = window as unknown as { gsap?: typeof import('gsap').gsap };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!w.gsap) return; // CSS fade-in fallback still applies
    const g = w.gsap;
    const tiles = Array.from(gridRef.current.children);
    const cols = dims.cols;
    const checkerA: Element[] = [];
    const checkerB: Element[] = [];
    tiles.forEach((t, i) => {
      ((Math.floor(i / cols) + (i % cols)) % 2 === 0 ? checkerA : checkerB).push(t);
    });
    // Kill the container's CSS fade — the pops must be binary, not softened.
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
  }, [dims]);

  // After the loader exit, render nothing — frees the tile nodes entirely.
  if (done) return null;

  // Pre-hydration / first paint: the loader's solid background shows alone,
  // then the tile field turns in. (Ref attached so calc() can measure it.)
  if (!dims) return <span ref={gridRef} className="pixel-loader-screen" aria-label="Loading" />;

  const face = FACES[SEQ[step]];
  const rOff = Math.max(0, Math.floor((dims.rows - FACE_H) / 2));
  const cOff = Math.max(0, Math.floor((dims.cols - FACE_W) / 2));

  const cells = [];
  for (let r = 0; r < dims.rows; r++) {
    for (let c = 0; c < dims.cols; c++) {
      const fr = r - rOff;
      const fc = c - cOff;
      let ch = '.';
      if (fr >= 0 && fr < FACE_H && fc >= 0 && fc < FACE_W) ch = face[fr][fc];
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
        gridTemplateColumns: `repeat(${dims.cols}, 1fr)`,
        gridTemplateRows: `repeat(${dims.rows}, 1fr)`,
      }}
    >
      {cells}
    </span>
  );
}
