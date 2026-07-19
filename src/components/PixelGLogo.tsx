'use client';

import { useEffect, useState } from 'react';

// 5x5 pixel "G" ('#' = dark tile, '.' = light tile), matching the brand artwork.
const GRID = [
  '.###.',
  '#....',
  '#..##',
  '#...#',
  '.###.',
];

// The G's stroke as an ordered path — the accent pixel travels along it.
// Starts at row5/col4 (where the green tile sits in the artwork).
const PATH: Array<[number, number]> = [
  [0, 3], [0, 2], [0, 1], // top bar (right -> left)
  [1, 0], [2, 0], [3, 0], // left side down
  [4, 1], [4, 2], [4, 3], // bottom bar
  [3, 4], [2, 4], [2, 3], // up the right side, ending at the inner bar
];

const START_STEP = 8; // [4,3] — the accent tile position in the artwork

// aurora ramp (the tile-wipe colour language): the traveling pixel takes its
// hue from its position on the G — blue left, violet top, magenta/ember along
// the bottom and right. Same 215°→390° long-way ramp as the wipes.
const AURORA = PATH.map(([r, c]) => {
  const xf = c / 4;
  const dy = r / 4 - 0.5;
  const hue = (215 + xf * 175 - dy * 35 + 360) % 360;
  return `hsl(${hue.toFixed(0)} 88% 56%)`;
});

export default function PixelGLogo() {
  const [step, setStep] = useState(START_STEP);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setStep((s) => (s + 1) % PATH.length), 450);
    return () => clearInterval(id);
  }, []);

  const [ar, ac] = PATH[step];

  return (
    <span className="pixel-g-logo" role="img" aria-label="GRAPHIQ logo">
      {GRID.flatMap((row, r) =>
        [...row].map((ch, c) => {
          const on = ch === '#';
          const accent = r === ar && c === ac;
          return (
            <span
              key={`${r}-${c}`}
              className={
                'pixel-g-logo__tile' +
                (on ? ' pixel-g-logo__tile--on' : '') +
                (accent ? ' pixel-g-logo__tile--accent' : '')
              }
              style={accent ? { background: AURORA[step] } : undefined}
            />
          );
        })
      )}
    </span>
  );
}
