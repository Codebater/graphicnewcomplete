'use client';

import { useState } from 'react';
import styles from './FreelancersList.module.css';
import KingCard from './KingCard';
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

export default function FreelancersList() {
  const [active, setActive] = useState(0);
  const current = FREELANCERS[active];

  const renderVisual = (person: Freelancer) =>
    person.card === 'king' ? (
      <KingCard />
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
    <div className={styles.wrap}>
      {/* Names list */}
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
            {/* Expanding visual — mobile only, mirrors the desktop panel */}
            <div className={styles.thumbWrap} aria-hidden="true">
              {renderVisual(person)}
            </div>
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
  );
}
