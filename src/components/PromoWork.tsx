'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import PixelText from './PixelText';
import styles from './PromoWork.module.css';

// "LET'S WORK" wordmark for the promo band — set in the brand's own tile
// font (PixelText) with the blinking green cursor, hovering in 3D above the
// card. The tilt follows the cursor across the whole promo band (rAF-eased,
// like KingCard); on hover an arrow steps in and the wordmark nudges aside.
export default function PromoWork() {
  const rootRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const zone = (root.closest('.mxd-promo__inner') as HTMLElement) || root;

    let raf = 0;
    let tx = 0, ty = 0;   // target tilt
    let cx = 0, cy = 0;   // current (eased) tilt
    const onMove = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tx = ny * -16;   // rotateX
      ty = nx * 20;    // rotateY
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty('--rx', `${cx.toFixed(2)}deg`);
      root.style.setProperty('--ry', `${cy.toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };
    zone.addEventListener('mousemove', onMove);
    zone.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      zone.removeEventListener('mousemove', onMove);
      zone.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Link
      ref={rootRef}
      className={styles.root}
      href="/contact"
      aria-label="Let's work — talk about your project"
    >
      <span className={styles.arrow} aria-hidden="true">
        <i className="ph-bold ph-arrow-right" />
      </span>
      <span className={styles.stage}>
        <span className={styles.word}>
          <PixelText text="LET'S WORK" />
        </span>
      </span>
    </Link>
  );
}
