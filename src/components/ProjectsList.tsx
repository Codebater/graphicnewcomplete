'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ProjectsList.module.css';

export type ProjectListItem = {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  desc?: string;
  image?: string;
  video?: string;
};

export default function ProjectsList({ projects }: { projects: ProjectListItem[] }) {
  const [active, setActive] = useState(0);

  if (!projects || projects.length === 0) return null;

  const renderMedia = (p: ProjectListItem, className: string) =>
    p.video ? (
      <video
        className={className}
        src={p.video}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={className} src={p.image} alt={p.title} loading="lazy" />
    );

  return (
    <div className={styles.wrap}>
      {/* Project names list */}
      <ul className={styles.list}>
        {projects.map((p, i) => (
          <li
            key={p.id}
            className={`${styles.item} ${i === active ? styles.itemActive : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <Link className={styles.link} href={`/project-details/${p.id}`}>
              <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.name}>
                <span className={styles.title}>{p.title}</span>
                <span className={styles.dot} aria-hidden="true" />
              </p>
              {p.subtitle && <p className={styles.meta}>{p.subtitle}</p>}
              {/* Expanding media — mobile only */}
              <div className={styles.thumbWrap} aria-hidden="true">
                {renderMedia(p, styles.thumb)}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Hover media panel — desktop only */}
      <div className={styles.photoCol}>
        <div className={styles.photoFrame}>
          {projects.map((p, i) => (
            <div
              key={p.id}
              className={`${styles.photo} ${i === active ? styles.photoActive : ''}`}
            >
              {renderMedia(p, styles.media)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
