'use client';

import { useEffect, useState } from 'react';

// Sales-pitch one-liners shown in the open menu — rotates every few seconds.
// All lines are absolutely stacked inside a fixed-height box, so swapping
// them never reflows the menu (different line lengths used to shift it).
const LINES = [
  '🚀 Warning: we cause sales spikes',
  '📈 We turn clicks into paying customers',
  '✨ Designs that sell while you sleep',
];

const INTERVAL_MS = 3500;

export default function RotatingCaption() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((prev) => (prev + 1) % LINES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="rotating-caption">
      {LINES.map((line, i) => (
        <span
          key={line}
          className={`rotating-caption__line${i === index ? ' is-on' : ''}`}
          aria-hidden={i === index ? undefined : 'true'}
        >
          {line}
        </span>
      ))}
    </span>
  );
}
