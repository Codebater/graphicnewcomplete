'use client';

import { useState } from 'react';
import styles from './FreelancersList.module.css';

type Freelancer = {
  first: string;
  last: string;
  role: string;
  note: string;
  photo: string;
};

// NOTE: To use the real headshots, just drop photos named `andrej.jpg` and
// `sadullah.jpg` into /public/porthomeimages/ — they overwrite the placeholders
// and nothing else needs to change.
const FREELANCERS: Freelancer[] = [
  {
    first: 'Andrej',
    last: 'Lisal',
    role: 'Design & Art Direction',
    note: 'Turns blank canvases into things you can’t stop staring at.',
    photo: '/porthomeimages/andrej.jpg',
  },
  {
    first: 'Sadullah',
    last: 'Maliyawala',
    role: 'Development & Engineering',
    note: 'Has tested your site on more devices than you knew existed.',
    photo: '/porthomeimages/sadullah.jpg',
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
            {/* Expanding photo — mobile only, mirrors the desktop swap */}
            <div className={styles.thumbWrap} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.thumb}
                src={person.photo}
                alt={`${person.first} ${person.last}`.trim()}
                loading="lazy"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Sticky photo — desktop only */}
      <div className={styles.photoCol}>
        <div className={styles.photoFrame}>
          {FREELANCERS.map((person, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`photo-${i}`}
              className={`${styles.photo} ${i === active ? styles.photoActive : ''}`}
              src={person.photo}
              alt={`${person.first} ${person.last}`.trim()}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
