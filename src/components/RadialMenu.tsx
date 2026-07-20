'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PixelGLogo from '@/components/PixelGLogo';

// Mobile installation menu (sub-1200 only — the desktop menu keeps its own
// design): numbered editorial destination list, then the hero's ball head
// riding a cream band (the marquee-line motif) with the lens pixel icons
// drifting through its star eyes, and a three-column social block below.

const NAV = [
  { href: '/', label: 'HOME' },
  { href: '/about-us', label: 'STUDIO' },
  { href: '/pricing', label: 'SERVICES' },
  { href: '/portfolio', label: 'WORK' },
  { href: '/contact', label: 'CONTACT' },
];

const SOCIALS = [
  { href: 'https://wa.me/12132322227', label: 'WHATSAPP', icon: 'ph-whatsapp-logo' },
  { href: 'https://www.instagram.com/n_drjj', label: 'INSTAGRAM', icon: 'ph-instagram-logo' },
  { href: 'https://www.linkedin.com/in/andrej-lisal-67620341a/', label: 'LINKEDIN', icon: 'ph-linkedin-logo' },
];

// pixel bitmaps — the hero lens language
const BITMAPS: string[][] = [
  ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'], // heart
  ['#..#..#', '#..#..#', '#######', '#######', '.#####.'], // crown
  ['..##..', '.####.', '######', '.####.', '..##..'], // diamond
  [
    '..#.....#..',
    '...#...#...',
    '..#######..',
    '.##.###.##.',
    '###########',
    '#.#######.#',
    '#.#.....#.#',
    '...##.##...',
  ], // invader
  ['...#...', '..###..', '#######', '.#####.', '..###..', '.#...#.'], // star
];

function PixelIcon({ rows }: { rows: string[] }) {
  const h = rows.length;
  const w = rows[0].length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null
        )
      )}
    </svg>
  );
}

function EyeStrip({ delay }: { delay?: string }) {
  // duplicated set → seamless -50% translateX loop
  const set = [...BITMAPS, ...BITMAPS];
  return (
    <span className="rm-eye__strip" style={delay ? { animationDelay: delay } : undefined}>
      {set.map((bm, i) => (
        <span key={i} className="rm-eye__icon"><PixelIcon rows={bm} /></span>
      ))}
    </span>
  );
}

export default function RadialMenu() {
  const pathname = usePathname();
  return (
    <div className="radial-menu" aria-label="Menu">
      {/* logo lockup */}
      <div className="rm-top menu-fade-in">
        <span className="rm-logo-mark"><PixelGLogo /></span>
        <span className="rm-logo-text">GRAPHIQ<br />STUDIO LLC</span>
      </div>

      {/* numbered destination list */}
      <nav className="rm-list menu-fade-in" aria-label="Main">
        {NAV.map((n, i) => (
          <Link
            key={n.href}
            href={n.href}
            className={`rm-row ${pathname === n.href ? 'rm-row--active' : ''}`}
          >
            <span className="rm-row__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="rm-row__label">{n.label}</span>
            <i className="ph ph-arrow-right rm-row__arrow"></i>
          </Link>
        ))}
      </nav>

      {/* the head on the cloud — the see-through strip + notch are punched
          THROUGH the menu card (mask on the hamburger base), and the strip's
          bottom edge is a cloud bank: the lower card piece IS the cloud the
          ball sits on */}
      <div className="rm-band menu-fade-in" aria-hidden="true">
        <span className="rm-ball">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/porthomeimages/menu-ball.webp" alt="" />
          <span className="rm-eye rm-eye--left"><EyeStrip /></span>
          <span className="rm-eye rm-eye--right"><EyeStrip delay="-5.2s" /></span>
        </span>
      </div>

      {/* socials — bare bold icons, springing in asynchronously on open.
          NOT in menu-fade-in: the gsap fade held the block invisible while
          the earliest spring played, so WhatsApp appeared without its
          bounce — the springs' own opacity is the entrance. */}
      <div className="rm-socials">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            className="rm-social"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
          >
            <i className={`ph-bold ${s.icon}`}></i>
          </a>
        ))}
      </div>
    </div>
  );
}
