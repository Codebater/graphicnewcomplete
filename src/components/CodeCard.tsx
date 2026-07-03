'use client';

import { useEffect, useRef } from 'react';
import styles from './CodeCard.module.css';

// "Code Genius — Architect of Digital Experiences" — a celestial/futuristic
// AAA collectible card for Asad. Fully layered (no single image): a multi-ring
// orbital halo (some rings pass behind the head, some in front), holographic
// code panels, floating gold geometry, light ribbons, a digital constellation,
// volumetric clouds, rising particles — each on its own depth, with a premium
// 3D cursor tilt, cursor-following glow, animated gold border and idle float.

const PANELS = [
  { cls: 'panelA', lines: [70, 45, 60, 35] },
  { cls: 'panelB', lines: [55, 80, 40] },
  { cls: 'panelC', lines: [60, 40, 75, 50, 30] },
];
const SHAPES = ['shapeA', 'shapeB', 'shapeC', 'shapeD', 'shapeE', 'shapeF'];

export default function CodeCard() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let tRx = 0, tRy = 0, tH = 0;
    let rx = 0, ry = 0, h = 0;
    let tPx = 0.5, tPy = 0.35, px = 0.5, py = 0.35;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      tPx = nx; tPy = ny;
      tRy = (nx - 0.5) * 15;
      tRx = (ny - 0.5) * -13;
      tH = 1;
    };
    const onLeave = () => { tRx = 0; tRy = 0; tH = 0; tPx = 0.5; tPy = 0.35; };

    const loop = () => {
      if (!running) return;
      rx += (tRx - rx) * 0.08;
      ry += (tRy - ry) * 0.08;
      h += (tH - h) * 0.07;
      px += (tPx - px) * 0.07;
      py += (tPy - py) * 0.07;
      card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      stage.style.setProperty('--h', h.toFixed(3));
      stage.style.setProperty('--px', px.toFixed(3));
      stage.style.setProperty('--py', py.toFixed(3));
      raf = requestAnimationFrame(loop);
    };

    if (!reduce) {
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerleave', onLeave);
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
          {/* ---- behind: constellation + arches + halo rings passing behind ---- */}
          <svg className={styles.constellation} viewBox="0 0 300 300" aria-hidden="true">
            <g>
              <line x1="40" y1="60" x2="130" y2="40" /><line x1="130" y1="40" x2="250" y2="90" />
              <line x1="250" y1="90" x2="210" y2="200" /><line x1="210" y1="200" x2="90" y2="250" />
              <line x1="90" y1="250" x2="40" y2="60" /><line x1="130" y1="40" x2="160" y2="150" />
              <line x1="160" y1="150" x2="250" y2="90" /><line x1="160" y1="150" x2="90" y2="250" />
            </g>
            {[[40,60],[130,40],[250,90],[210,200],[90,250],[160,150]].map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="2.4" />
            ))}
          </svg>

          <svg className={styles.arches} viewBox="0 0 300 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <path d="M40 380 L40 150 A110 110 0 0 1 260 150 L260 380" />
            <path d="M75 380 L75 175 A75 75 0 0 1 225 175 L225 380" />
            <path d="M110 380 L110 200 A40 40 0 0 1 190 200 L190 380" />
          </svg>

          <div className={`${styles.ring} ${styles.ringBack1}`} aria-hidden="true" />
          <div className={`${styles.ring} ${styles.ringBack2}`} aria-hidden="true" />

          {/* ---- clipped frame: portrait + clouds + light ---- */}
          <div className={styles.frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.portrait} src="/king/asad-real.webp" alt="Asad — Code Genius" />
            <div className={styles.tint} />
            <div className={styles.clouds} />
            <div className={styles.shimmer} />
            <div className={styles.vignette} />
          </div>

          {/* ---- halo rings passing in front (glowing, over the portrait) ---- */}
          <div className={`${styles.ring} ${styles.ringFront1}`} aria-hidden="true" />
          <div className={`${styles.ring} ${styles.ringFront2}`} aria-hidden="true" />

          {/* ---- border + cursor glow ---- */}
          <div className={styles.border} />
          <div className={styles.glow} />

          {/* ---- light ribbons wrapping the portrait ---- */}
          <svg className={styles.ribbons} viewBox="0 0 300 440" aria-hidden="true">
            <defs>
              <linearGradient id="cc-rib" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff6e2" stopOpacity="0" />
                <stop offset="0.5" stopColor="#f0c574" stopOpacity="0.9" />
                <stop offset="1" stopColor="#fff6e2" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className={styles.ribbon1} d="M-30 250 C 80 180, 90 330, 170 260 S 320 210, 340 300" />
            <path className={styles.ribbon2} d="M-20 150 C 70 120, 120 230, 190 150 S 300 120, 330 180" />
          </svg>

          {/* ---- holographic code / UI panels (orbiting, breaking the frame) ---- */}
          {PANELS.map((p) => (
            <div key={p.cls} className={`${styles.panel} ${styles[p.cls]}`} aria-hidden="true">
              <span className={styles.panelDot} />
              {p.lines.map((w, i) => (
                <span key={i} className={styles.panelLine} style={{ width: `${w}%` }} />
              ))}
            </div>
          ))}

          {/* ---- floating gold geometry ---- */}
          {SHAPES.map((s) => (
            <span key={s} className={`${styles.shape} ${styles[s]}`} aria-hidden="true" />
          ))}

          {/* ---- rising gold particles ---- */}
          <div className={styles.dust} aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} style={{ ['--i' as string]: i }} />
            ))}
          </div>

          {/* ---- typography ---- */}
          <div className={styles.type}>
            <div className={styles.title}>CODE&nbsp;GENIUS</div>
            <div className={styles.sub}>ARCHITECT&nbsp;OF&nbsp;DIGITAL&nbsp;EXPERIENCES</div>
          </div>
        </div>
      </div>
    </div>
  );
}
