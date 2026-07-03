'use client';

import { useEffect, useRef } from 'react';
import styles from './KingCard.module.css';

// "The King of Design" — a premium interactive collectible card for Andrej.
// Independent parallax layers (bg portrait / crown / splashes / particles /
// glow / type), 3D cursor tilt with smooth easing, idle float, animated
// gold+violet border, moving shine, and a purple bloom that intensifies on
// hover. Art breaks outside the frame (crown + splashes overflow the border).
export default function KingCard() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let tRx = 0, tRy = 0, tH = 0; // targets: rotX, rotY, hover(0..1)
    let rx = 0, ry = 0, h = 0;     // current (eased)
    let tPx = 0.5, tPy = 0.35, px = 0.5, py = 0.35; // pointer (0..1)
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      tPx = nx; tPy = ny;
      tRy = (nx - 0.5) * 18;   // rotateY from horizontal
      tRx = (ny - 0.5) * -16;  // rotateX from vertical
      tH = 1;
    };
    const onLeave = () => { tRx = 0; tRy = 0; tH = 0; tPx = 0.5; tPy = 0.35; };

    const loop = () => {
      if (!running) return;
      rx += (tRx - rx) * 0.12;
      ry += (tRy - ry) * 0.12;
      h += (tH - h) * 0.08;
      px += (tPx - px) * 0.1;
      py += (tPy - py) * 0.1;
      card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      stage.style.setProperty('--h', h.toFixed(3));
      stage.style.setProperty('--px', px.toFixed(3));
      stage.style.setProperty('--py', py.toFixed(3));
      raf = requestAnimationFrame(loop);
    };

    if (!reduce) {
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerleave', onLeave);
      // Pause the rAF when the card is offscreen (perf).
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
      });
      io.observe(card);
      raf = requestAnimationFrame(loop);
      return () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        stage.removeEventListener('pointermove', onMove);
        stage.removeEventListener('pointerleave', onLeave);
      };
    }
  }, []);

  return (
    <div className={styles.stage} ref={stageRef}>
      <div className={styles.float}>
        <div className={styles.card} ref={cardRef}>
          {/* clipped inner frame */}
          <div className={styles.frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.portrait} src="/king/andrej-real.webp" alt="Andrej — The King of Design" />
            <div className={styles.tint} />
            <div className={styles.shine} />
            <div className={styles.vignette} />
            <div className={styles.grain} />
          </div>

          {/* animated premium border (over the frame edge) */}
          <div className={styles.border} />

          {/* purple bloom */}
          <div className={styles.glow} />

          {/* foreground art that breaks the frame */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.crown} src="/king/crown.webp" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${styles.splash} ${styles.splashA}`} src="/king/splat-violet.webp" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${styles.splash} ${styles.splashB}`} src="/king/splat-gold.webp" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${styles.splash} ${styles.splashC}`} src="/king/splat-gold2.webp" alt="" aria-hidden="true" />

          {/* floating dust particles */}
          <div className={styles.dust} aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} style={{ ['--i' as string]: i }} />
            ))}
          </div>

          {/* typography */}
          <div className={styles.type}>
            <div className={styles.wordWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.word} src="/king/king-word.webp" alt="KING" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.designs} src="/king/designs-word.webp" alt="DESIGNS" />
            </div>
            <div className={styles.sub}>DESIGN LEAD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
