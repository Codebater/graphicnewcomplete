'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './FreelancersList.module.css';
import VisorCard from './VisorCard';
import CodeCard from './CodeCard';

type Freelancer = {
  first: string;
  last: string;
  role: string;
  note: string;
  photo: string;
  card?: 'king' | 'code'; // renders a collectible card instead of a photo
};

const FREELANCERS: Freelancer[] = [
  {
    first: 'Andrej',
    last: 'L.',
    role: 'Design & Art Direction',
    note: 'Turns blank canvases into things you can’t stop staring at.',
    photo: '/porthomeimages/andrej.jpg',
    card: 'king',
  },
  {
    first: 'Asad',
    last: 'M.',
    role: 'Development & Engineering',
    note: 'Has tested your site on more devices than you knew existed.',
    photo: '/porthomeimages/sadullah.jpg',
    card: 'code',
  },
  {
    first: 'Anonymous',
    last: '',
    role: 'Brand & Strategy',
    note: 'Identity classified. The work speaks loudly enough.',
    photo: '/porthomeimages/anon-1.svg',
  },
  {
    first: 'Anonymous',
    last: '',
    role: 'Motion & 3D',
    note: 'Lives somewhere between keyframes. Please don’t ask for a name.',
    photo: '/porthomeimages/anon-2.svg',
  },
];

const N = FREELANCERS.length;

export default function FreelancersList() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const current = FREELANCERS[active];

  // Mobile: pin the deck and step the active card with scroll (same pattern
  // as Selected Work — CSS sticky pin + ScrollTrigger progress + hysteresis).
  useEffect(() => {
    const w = window as unknown as { gsap?: any; ScrollTrigger?: any; lenis?: any };
    let mm: any;
    let cancelled = false;
    let tries = 0;

    const setup = () => {
      if (cancelled) return;
      const gsap = w.gsap;
      const ScrollTrigger = w.ScrollTrigger;
      // Wait for GSAP/ScrollTrigger AND for AppInitializer to finish its init
      // (window.lenis is created last — after that our trigger won't be killed).
      if (!gsap || !ScrollTrigger || (!w.lenis && tries < 40)) {
        tries += 1;
        setTimeout(setup, 100);
        return;
      }
      mm = gsap.matchMedia();
      mm.add('(max-width: 1199px)', () => {
        const deck = deckRef.current;
        if (!deck) return;

        let st: any = null;
        const create = () => {
          st = ScrollTrigger.create({
            trigger: deck,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self: any) => {
              const f = self.progress * (N - 1);
              const idx = Math.round(f);
              // hysteresis: only commit near the centre of a zone
              if (idx !== activeRef.current && Math.abs(f - idx) < 0.4) {
                activeRef.current = idx;
                setActive(idx);
              }
            },
          });
          requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        create();

        // AppInitializer's killAll() sweeps triggers on re-init — recreate ours.
        const guard = setInterval(() => {
          if (st && !ScrollTrigger.getAll().includes(st)) create();
        }, 1200);

        return () => {
          clearInterval(guard);
          if (st) st.kill();
        };
      });
    };

    setup();
    return () => {
      cancelled = true;
      if (mm) mm.revert();
    };
  }, []);

  const renderVisual = (person: Freelancer) =>
    person.card === 'king' ? (
      <VisorCard />
    ) : person.card === 'code' ? (
      <CodeCard />
    ) : (
      <div className={styles.photoFrame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.photoStatic}
          src={person.photo}
          alt={`${person.first} ${person.last}`.trim()}
          loading="lazy"
        />
      </div>
    );

  return (
    <>
      {/* ---------- desktop: names list + sticky panel ---------- */}
      <div className={styles.wrap}>
        <ul className={styles.list}>
          {FREELANCERS.map((person, i) => (
            <li
              key={`${person.first}-${i}`}
              className={`${styles.item} ${i === active ? styles.itemActive : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
            >
              <p className={styles.name}>
                <span className={styles.first}>{person.first}</span>
                {person.last && <span className={styles.last}> {person.last}</span>}
                <span className={styles.dot} aria-hidden="true" />
              </p>
              <p className={styles.meta}>
                <span className={styles.role}>{person.role},</span>{' '}
                <span className={styles.note}>{person.note}</span>
              </p>
            </li>
          ))}
        </ul>

        {/* Sticky panel — desktop only. Shows the active member's card or photo. */}
        <div className={styles.photoCol}>
          <div key={active} className={styles.reveal}>
            {renderVisual(current)}
          </div>
        </div>
      </div>

      {/* ---------- mobile: pinned card deck — the card stays centred in the
           screen and scrolling steps to the next member ---------- */}
      <div
        ref={deckRef}
        className={styles.deck}
        style={{ ['--fl-h' as string]: `${N * 85}vh` }}
      >
        <div className={styles.deckPin}>
          <div className={styles.deckCards}>
            {FREELANCERS.map((person, i) => (
              <div
                key={`slot-${i}`}
                className={`${styles.deckSlot} ${i === active ? styles.deckSlotActive : ''}`}
              >
                {renderVisual(person)}
              </div>
            ))}
          </div>
          <div className={styles.deckInfo}>
            {FREELANCERS.map((person, i) => (
              <div
                key={`info-${i}`}
                className={`${styles.deckName} ${i === active ? styles.deckNameActive : ''}`}
              >
                <p className={styles.name}>
                  <span className={styles.first}>{person.first}</span>
                  {person.last && <span className={styles.last}> {person.last}</span>}
                </p>
                <p className={styles.deckMeta}>
                  <span className={styles.role}>{person.role}</span>
                </p>
              </div>
            ))}
          </div>
          {/* tile progress dots */}
          <div className={styles.deckDots} aria-hidden="true">
            {FREELANCERS.map((_, i) => (
              <i key={i} className={i === active ? styles.deckDotOn : undefined} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
