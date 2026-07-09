'use client';

import { useEffect, useState } from 'react';

// Sales-pitch one-liners shown in the open menu — rotates every few seconds.
const LINES = [
  '🚀 Warning: we cause sales spikes',
  '📈 We turn clicks into paying customers',
  '✨ Designs that sell while you sleep',
];

const INTERVAL_MS = 3500;
const FADE_MS = 350;

export default function RotatingCaption() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      // fade out, swap text, fade back in
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LINES.length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      style={{
        display: 'inline-block',
        // Inherit the menu caption's themed color so the text stays readable
        // in both light and dark themes (a base span style was forcing white).
        color: 'inherit',
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      {LINES[index]}
    </span>
  );
}
