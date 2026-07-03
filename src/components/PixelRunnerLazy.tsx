'use client';

import { useState } from 'react';
import PixelRunner from './PixelRunner';
import styles from './PixelRunnerLazy.module.css';

// Static, canvas-free "tap to play" placeholder. The real PixelRunner (canvas +
// requestAnimationFrame loop) only mounts once the user taps, so it never runs
// during the pinned card-stack scroll — keeping that section smooth on mobile.
const G = ['.###.', '#....', '#..##', '#...#', '.###.'];

export default function PixelRunnerLazy() {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <div className={styles.host}>
        <PixelRunner autoStart />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.host} ${styles.ph}`}
      onClick={() => setPlay(true)}
      aria-label="Play the GRAPHIQ pixel runner mini-game"
    >
      <span className={styles.scene}>
        <span className={styles.grid} aria-hidden="true">
          {G.flatMap((row, r) =>
            [...row].map((c, ci) => (
              <i key={`${r}-${ci}`} className={c === '#' ? styles.on : styles.off} />
            ))
          )}
        </span>
        <span className={styles.ground} aria-hidden="true" />
      </span>
      <span className={styles.label}>
        <span className={styles.play}>▶</span> TAP TO PLAY
      </span>
    </button>
  );
}
