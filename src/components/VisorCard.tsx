'use client';

import { useEffect, useRef } from 'react';
import PixelText from './PixelText';
import styles from './VisorCard.module.css';

// "The Visor" — Andrej's collectible card. The hero section's lens effect,
// worn: a marquee of the SAME pixel icons (heart, crown, diamond, invader,
// star) scrolls across the mirrored band of his glasses, as if the hero
// marquee is being projected onto the visor. Same interaction skeleton as
// the other cards: eased 3D cursor tilt, idle float, IO-paused rAF.

// Pixel-art bitmaps — identical to HeroMarqueeLens so the brand language
// stays one-to-one ('#' = filled cell).
const BITMAPS: string[][] = [
  // heart
  ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
  // crown
  ['#..#..#', '#..#..#', '#######', '#######', '.#####.'],
  // diamond
  ['..##..', '.####.', '######', '.####.', '..##..'],
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
  ['...#...', '..###..', '#######', '.#####.', '..###..', '.#...#.'],
];

function IconSvg({ rows }: { rows: string[] }) {
  const h = rows.length;
  const w = rows[0].length;
  const rects = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rows[y][x] === '#') rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}

// One icon set; rendered twice inside the strip for a seamless -50% loop.
function IconSet() {
  return (
    <>
      {BITMAPS.map((bm, i) => (
        <span key={i} className={styles.icon}>
          <IconSvg rows={bm} />
        </span>
      ))}
    </>
  );
}

export default function VisorCard() {
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
      tRy = (nx - 0.5) * 18;
      tRx = (ny - 0.5) * -16;
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
          <div className={styles.frame}>
            {/* photo + visor overlay share ONE parallax wrap so the marquee
                stays glued to the glasses while the card tilts */}
            <div className={styles.photoWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img decoding="async" className={styles.portrait} src="/king/andrej-visor.webp" alt="Andrej — Design Lead" />

              {/* the visor projection: hero pixel icons scrolling on the lens */}
              <div className={styles.visor} aria-hidden="true">
                <div className={styles.visorStrip}>
                  <IconSet />
                  <IconSet />
                </div>
                <div className={styles.visorSheen} />
              </div>
            </div>

            <div className={styles.shine} />
            <div className={styles.vignette} />
          </div>

          {/* thin brand border + hover glow */}
          <div className={styles.border} />
          <div className={styles.glow} />

          {/* typography — tile lettering, hero language */}
          <div className={styles.type}>
            <div className={styles.word}>
              <PixelText text="ANDREJ" cursor={false} font="5x7" />
            </div>
            <div className={styles.sub}>DESIGN LEAD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
