'use client';

import { useEffect, useRef } from 'react';
import PixelText from './PixelText';
import styles from './VisorCard.module.css';

// "The Visor" — collectible cards wearing the hero effect: a marquee of
// pixel icons projected onto the mirrored band of each person's glasses.
// The projection is clipped by a MATTE OF THE ACTUAL LENS, extracted from
// each photo's pixels (glass silhouette incl. curved edges, nose-bridge
// cutouts and overlapping hair — icons pass BEHIND those, like a
// compositor's matte). Same interaction skeleton as the other cards:
// eased 3D cursor tilt, idle float, IO-paused rAF.

type Band = { left: string; top: string; width: string; height: string; tilt: number };

type PersonConfig = {
  photo: string;
  mask: string;
  /* the photo's exact aspect ratio — the parallax wrap uses it so the matte's
     percentage coordinates map 1:1 onto the image (no object-fit cropping) */
  aspect: string;
  alt: string;
  name: string;
  sub: string;
  band: Band;
  icons: string[][];
};

// shared pixel bitmaps ('#' = filled cell)
const G = ['.###.', '#....', '#..##', '#...#', '.###.'];                     // brand logo
const EYE = ['..###..', '.#...#.', '#..#..#', '.#...#.', '..###..'];
const BOLT = ['..##.', '.##..', '####.', '..##.', '.##..', '##...'];
const HEART = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
const STAR = ['...#...', '..###..', '#######', '.#####.', '..###..', '.#...#.'];

const CONFIGS: Record<'andrej' | 'asad' | 'anon', PersonConfig> = {
  // Design lead: G, designer's cursor, pen nib, eye, bolt, heart, star
  andrej: {
    photo: '/king/andrej-visor.webp',
    mask: '/king/andrej-visor-mask.png',
    aspect: '1086 / 1448',
    alt: 'Andrej — Design Lead',
    name: 'ANDREJ',
    sub: 'DESIGN LEAD',
    // lens band measured from the photo: x 27.3%→77.6%, centerline y 38.6%,
    // real downward tilt 3.2° to camera-right
    band: { left: '27.3%', top: '33.2%', width: '50.3%', height: '10.4%', tilt: 3.2 },
    icons: [
      G,
      ['#......', '##.....', '###....', '####...', '#####..', '######.', '###....', '#.#....'], // cursor
      ['..###..', '.#####.', '.#####.', '..###..', '..#.#..', '...#...'], // pen nib
      EYE,
      BOLT,
      HEART,
      STAR,
    ],
  },
  // Dev lead: G, code brackets, terminal prompt, eye, bolt, heart, star
  asad: {
    photo: '/king/asad-visor.webp',
    mask: '/king/asad-visor-mask.png',
    aspect: '1122 / 1402',
    alt: 'Asad — Dev Lead',
    name: 'ASAD',
    sub: 'DEV LEAD',
    // lens band measured from the photo: x 28.3%→74.9%, centerline y ~37.4%,
    // essentially level (−0.8°)
    band: { left: '28%', top: '32.1%', width: '47.5%', height: '10.5%', tilt: -0.8 },
    icons: [
      G,
      ['..#.#..', '.#...#.', '#.....#', '.#...#.', '..#.#..'], // <> brackets
      ['#.....', '.#....', '..#...', '.#....', '#..###'],      // >_ terminal
      EYE,
      BOLT,
      HEART,
      STAR,
    ],
  },
  // The Anonymous — the hero smiley ball itself in a suit. The marquee runs
  // straight through BOTH star-shaped eye recesses (parametric star mattes
  // aligned to the photo), icons sized up to the recess scale.
  anon: {
    photo: '/king/anon-visor.webp',
    mask: '/king/anon-visor-mask.png',
    aspect: '2 / 3',
    alt: 'Anonymous — the GRAPHIQ smiley',
    name: 'ANONYMOUS',
    sub: 'CLASSIFIED',
    // one lane through both star eyes: x 22%→78%, centerline y ~25.8%,
    // slight 1.3° tilt between the two recess centers
    band: { left: '22%', top: '19.3%', width: '56%', height: '13%', tilt: 1.3 },
    icons: [
      G,
      ['.###.', '#...#', '...#.', '..#..', '..#..', '.....', '..#..'], // ?
      [
        '..#.....#..',
        '...#...#...',
        '..#######..',
        '.##.###.##.',
        '###########',
        '#.#######.#',
        '#.#.....#.#',
        '...##.##...',
      ], // space invader (was printed in the eyes)
      EYE,
      BOLT,
      HEART,
      STAR,
    ],
  },
};

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
function IconSet({ icons }: { icons: string[][] }) {
  return (
    <>
      {icons.map((bm, i) => (
        <span key={i} className={styles.icon}>
          <IconSvg rows={bm} />
        </span>
      ))}
    </>
  );
}

export default function VisorCard({
  person = 'andrej',
  sub,
}: {
  person?: 'andrej' | 'asad' | 'anon';
  /* per-slot label override (the two Anonymous entries share one card
     but carry their own roles) */
  sub?: string;
}) {
  const cfg = CONFIGS[person];
  const subText = sub ?? cfg.sub;
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
            <div className={styles.photoWrap} style={{ aspectRatio: cfg.aspect }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img decoding="async" className={styles.portrait} src={cfg.photo} alt={cfg.alt} />

              {/* the projection, clipped by the lens matte */}
              <div
                className={styles.visor}
                aria-hidden="true"
                style={{
                  WebkitMaskImage: `url(${cfg.mask})`,
                  maskImage: `url(${cfg.mask})`,
                }}
              >
                <div
                  className={styles.visorBand}
                  style={{
                    left: cfg.band.left,
                    top: cfg.band.top,
                    width: cfg.band.width,
                    height: cfg.band.height,
                    transform: `rotate(${cfg.band.tilt}deg)`,
                  }}
                >
                  <div className={styles.visorStrip}>
                    <IconSet icons={cfg.icons} />
                    <IconSet icons={cfg.icons} />
                  </div>
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
            <div className={`${styles.word} ${cfg.name.length > 7 ? styles.wordLong : ''}`}>
              <PixelText text={cfg.name} cursor={false} font="5x7" />
            </div>
            <div className={styles.sub}>{subText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
