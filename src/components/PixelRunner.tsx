'use client';

import { useEffect, useRef } from 'react';

// ─── GRAPHIQ Pixel Runner ────────────────────────────────────────────────────
// A one-file, click-to-jump mini game (Chrome-dino style) in the brand's
// pixel-tile language: the pixel-G logo (with its traveling accent pixel)
// runs and jumps over tile-stack obstacles.
//   · Floaty, forgiving physics: apex hang-time, hold-to-jump-higher,
//     DOUBLE JUMP (click again mid-air).
//   · Juice: squash & stretch, dust bursts, parallax cloud-tiles, shake.
//   · STAR pickup (Mario-style): ~6s invincibility — the G flashes and
//     SMASHES obstacles into tile shrapnel for bonus points.
// Score + hi-score persist in localStorage. Theme-aware colors.

const G = ['.###.', '#....', '#..##', '#...#', '.###.'];
const G_PATH: Array<[number, number]> = [
  [0, 3], [0, 2], [0, 1], [1, 0], [2, 0], [3, 0],
  [4, 1], [4, 2], [4, 3], [3, 4], [2, 4], [2, 3],
];
const STAR = ['..#..', '.###.', '#####', '.###.', '.#.#.'];

// 3x5 tile font (subset) — same shapes as the PixelText headline component.
const FONT: Record<string, string[]> = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  C: ['###', '#..', '#..', '#..', '###'],
  E: ['###', '#..', '###', '#..', '###'],
  G: ['###', '#..', '#.#', '#.#', '###'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'],
  K: ['#.#', '##.', '#..', '##.', '#.#'],
  L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  O: ['###', '#.#', '#.#', '#.#', '###'],
  P: ['###', '#.#', '###', '#..', '#..'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '1': ['.#.', '##.', '.#.', '.#.', '###'],
  '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '###', '..#', '###'],
  '4': ['#.#', '#.#', '###', '..#', '..#'],
  '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'],
  '7': ['###', '..#', '..#', '..#', '..#'],
  '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'],
};

type Obstacle = { x: number; cols: number; rows: number; accent: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; accent: boolean };
type StarItem = { x: number; y: number };
type Cloud = { x: number; y: number; speed: number; size: number };
type Wave = { x: number; t: number; power: number };

export default function PixelRunner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;

    const S = {
      mode: 'idle' as 'idle' | 'run' | 'dead',
      t: 0,
      score: 0,
      hi: 0,
      py: 0,
      vy: 0,
      jumps: 0, // remaining air jumps
      held: false,
      stretch: 1, // squash & stretch factor
      speed: 0,
      spawnIn: 1,
      starSpawnIn: 6,
      star: 0, // star-mode seconds remaining
      accent: 8,
      accentT: 0,
      flash: 0,
      shake: 0,
      groundOff: 0,
      last: performance.now(),
    };
    try {
      S.hi = Number(localStorage.getItem('graphiq-runner-hi') || 0);
    } catch {}
    let obstacles: Obstacle[] = [];
    let particles: Particle[] = [];
    let stars: StarItem[] = [];
    let clouds: Cloud[] = [];
    let waves: Wave[] = []; // gravitational impact waves rippling the floor

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // (re)seed background clouds
      clouds = Array.from({ length: 7 }, (_, i) => ({
        x: (i / 7) * W + Math.random() * W * 0.1,
        y: H * (0.08 + Math.random() * 0.42),
        speed: 0.06 + Math.random() * 0.1, // fraction of game speed
        size: 1 + Math.random() * 1.4,
      }));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const colors = () => {
      const cs = getComputedStyle(canvas);
      return {
        ink: cs.getPropertyValue('--base').trim() || '#161616',
        accent: '#ddf160',
      };
    };

    const tile = (x: number, y: number, s: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, s * 0.92, s * 0.92, s * 0.24);
      ctx.fill();
    };

    const text = (str: string, cx: number, cy: number, u: number, color: string, align = 0) => {
      const widths = [...str].map((ch) => (ch === ' ' ? 2 : (FONT[ch] ? FONT[ch][0].length : 0)));
      const totalCols = widths.reduce((a, w) => a + w + 1, -1);
      let x = cx - totalCols * u * align;
      [...str].forEach((ch, i) => {
        const g = FONT[ch];
        if (g) {
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < widths[i]; c++) {
              if (g[r][c] === '#') tile(x + c * u, cy + r * u, u, color);
            }
          }
        }
        x += (widths[i] + 1) * u;
      });
      return totalCols * u;
    };

    const burst = (x: number, y: number, n: number, accent: boolean, size: number, spread: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = spread * (0.4 + Math.random() * 0.8);
        particles.push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - spread * 0.5,
          life: 0.5 + Math.random() * 0.35,
          max: 0.85,
          size: size * (0.5 + Math.random() * 0.7),
          accent: accent ? Math.random() < 0.7 : Math.random() < 0.15,
        });
      }
    };

    const reset = () => {
      S.score = 0;
      S.py = 0;
      S.vy = 0;
      S.jumps = 0;
      S.speed = 0;
      S.spawnIn = 1.2;
      S.starSpawnIn = 5;
      S.star = 0;
      S.stretch = 1;
      obstacles = [];
      particles = [];
      stars = [];
      waves = [];
    };

    const die = () => {
      S.mode = 'dead';
      S.flash = 0.5;
      S.shake = 0.5;
      if (S.score > S.hi) {
        S.hi = Math.floor(S.score);
        try {
          localStorage.setItem('graphiq-runner-hi', String(S.hi));
        } catch {}
      }
      canvas.dataset.state = 'dead';
    };

    const jump = () => {
      const u = H / 16;
      const groundY = H - 2.2 * u;
      if (S.py <= 0.5) {
        S.vy = 2.35 * H;
        S.jumps = 1; // one air jump available
        S.stretch = 1.3;
        burst(2.2 * u + 1.6 * u, groundY, 6, false, u * 0.32, H * 0.35);
        waves.push({ x: 2.2 * u + 1.6 * u, t: 0, power: u * 0.55 });
      } else if (S.jumps > 0) {
        S.jumps = 0;
        S.vy = 2.15 * H;
        S.stretch = 1.26;
        burst(2.2 * u + 1.6 * u, groundY - S.py, 8, true, u * 0.3, H * 0.3);
      }
    };

    const act = () => {
      if (!running) {
        running = true;
        S.last = performance.now();
        raf = requestAnimationFrame(loop);
      }
      if (S.mode === 'idle') {
        reset();
        S.mode = 'run';
        canvas.dataset.state = 'run';
        jump();
      } else if (S.mode === 'dead') {
        if (S.flash <= 0) {
          reset();
          S.mode = 'run';
          canvas.dataset.state = 'run';
        }
      } else {
        jump();
      }
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      S.held = true;
      act();
    };
    const onUp = () => {
      S.held = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !e.repeat) {
        e.preventDefault();
        S.held = true;
        act();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') S.held = false;
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('keydown', onKey);
    canvas.addEventListener('keyup', onKeyUp);

    const io = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        S.last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    // Pause outright when the tab is hidden.
    const onVis = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!document.hidden && !running) {
        running = true;
        S.last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    let lastIdleDraw = 0;
    const loop = (now: number) => {
      if (!running) return;
      // While idle (nobody playing), ~24fps is plenty — keeps the card alive
      // without competing with the page's scroll animations.
      if (S.mode === 'idle' && now - lastIdleDraw < 40) {
        raf = requestAnimationFrame(loop);
        return;
      }
      lastIdleDraw = now;
      const dt = Math.min(0.05, (now - S.last) / 1000);
      S.last = now;
      S.t += dt;

      const u = H / 16;
      const groundY = H - 2.2 * u;
      const px = 2.2 * u;
      const pSize = 5 * u * 0.62;
      const pCell = pSize / 5;

      // ── update ──
      if (S.mode === 'run') {
        S.speed = W * (0.4 + Math.min(0.42, S.score * 0.0035));
        S.score += dt * 10;

        // Floaty gravity: lighter while rising & held, extra hang at apex.
        let g = 7.0 * H;
        if (S.held && S.vy > 0) g *= 0.58;
        if (S.py > 0 && Math.abs(S.vy) < 0.34 * H) g *= 0.5;
        S.vy -= g * dt;
        const wasAir = S.py > 0.5;
        S.py = Math.max(0, S.py + S.vy * dt);
        if (S.py === 0) {
          if (wasAir && S.vy < -0.4 * H) {
            // landing: squash + dust + gravitational impact wave (scaled by
            // how hard the G comes down)
            S.stretch = 0.72;
            burst(px + pSize / 2, groundY, 5, false, u * 0.3, H * 0.28);
            waves.push({
              x: px + pSize / 2,
              t: 0,
              power: u * Math.min(1.8, 0.7 + (-S.vy / H) * 0.5),
            });
          }
          S.vy = 0;
        }
        S.groundOff = (S.groundOff + S.speed * dt) % (u * 1.5);

        // obstacles
        S.spawnIn -= dt;
        if (S.spawnIn <= 0) {
          obstacles.push({
            x: W + 2 * u,
            cols: Math.random() < 0.3 ? 2 : 1,
            rows: 2 + Math.floor(Math.random() * 2.4),
            accent: Math.random() < 0.35,
          });
          S.spawnIn = (0.95 + Math.random() * 0.8) * Math.max(0.6, 1 - S.score / 600);
        }
        obstacles.forEach((o) => (o.x -= S.speed * dt));
        obstacles = obstacles.filter((o) => o.x > -3 * u);

        // star pickups
        S.starSpawnIn -= dt;
        if (S.starSpawnIn <= 0 && stars.length === 0 && S.star <= 0) {
          stars.push({ x: W + 2 * u, y: groundY - (3.2 + Math.random() * 2.2) * u });
          S.starSpawnIn = 8 + Math.random() * 6;
        }
        stars.forEach((st) => (st.x -= S.speed * dt));
        stars = stars.filter((st) => st.x > -3 * u);
        if (S.star > 0) S.star -= dt;

        // collisions
        const pL = px + pSize * 0.12;
        const pR = px + pSize * 0.88;
        const pB = groundY - S.py;
        const pT = pB - pSize * 0.8;

        // star collect (generous box)
        for (let i = stars.length - 1; i >= 0; i--) {
          const st = stars[i];
          const sSize = 2.4 * u;
          if (pR > st.x - sSize * 0.3 && pL < st.x + sSize && pB > st.y - sSize * 0.3 && pT < st.y + sSize) {
            stars.splice(i, 1);
            S.star = 6;
            S.shake = 0.25;
            burst(st.x + sSize / 2, st.y + sSize / 2, 16, true, u * 0.4, H * 0.5);
          }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          const o = obstacles[i];
          const oL = o.x + u * 0.15;
          const oR = o.x + o.cols * u - u * 0.15;
          const oT = groundY - o.rows * u + u * 0.15;
          if (pR > oL && pL < oR && pB > oT && pT < groundY) {
            if (S.star > 0) {
              // SMASH: obstacle shatters into tile shrapnel
              for (let c = 0; c < o.cols; c++) {
                for (let r = 0; r < o.rows; r++) {
                  particles.push({
                    x: o.x + c * u,
                    y: groundY - (r + 1) * u,
                    vx: W * (0.15 + Math.random() * 0.3),
                    vy: -H * (0.3 + Math.random() * 0.7),
                    life: 0.6 + Math.random() * 0.3,
                    max: 0.9,
                    size: u * 0.8,
                    accent: Math.random() < 0.4,
                  });
                }
              }
              obstacles.splice(i, 1);
              S.score += 25;
              S.shake = 0.35;
              waves.push({ x: oL, t: 0, power: u * 1.5 });
            } else {
              die();
              break;
            }
          }
        }
        canvas.dataset.score = String(Math.floor(S.score));
      }

      // particles
      particles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 5.5 * H * dt;
        p.life -= dt;
      });
      particles = particles.filter((p) => p.life > 0);

      // star-mode trail
      if (S.star > 0 && S.mode === 'run' && Math.random() < 0.6) {
        particles.push({
          x: px + Math.random() * pSize,
          y: groundY - S.py - Math.random() * pSize,
          vx: -W * 0.12,
          vy: 0,
          life: 0.3,
          max: 0.3,
          size: u * 0.35,
          accent: true,
        });
      }

      if (S.flash > 0) S.flash -= dt;
      if (S.shake > 0) S.shake -= dt * 2;
      S.stretch += (1 - S.stretch) * Math.min(1, dt * 9);

      S.accentT += dt;
      if (S.accentT > 0.13) {
        S.accentT = 0;
        S.accent = (S.accent + 1) % G_PATH.length;
      }

      // ── draw ──
      const { ink, accent } = colors();
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (S.shake > 0) {
        ctx.translate((Math.random() - 0.5) * S.shake * u, (Math.random() - 0.5) * S.shake * u);
      }

      // parallax cloud-tiles
      ctx.globalAlpha = 0.13;
      clouds.forEach((cl) => {
        if (S.mode === 'run') cl.x -= S.speed * cl.speed * dt;
        if (cl.x < -4 * u) {
          cl.x = W + 2 * u;
          cl.y = H * (0.08 + Math.random() * 0.42);
        }
        const cs2 = u * 0.9 * cl.size;
        tile(cl.x, cl.y, cs2, ink);
        tile(cl.x + cs2 * 1.05, cl.y + cs2 * 0.25, cs2 * 0.7, ink);
      });
      ctx.globalAlpha = 1;

      // gravitational impact waves: age + cull
      waves.forEach((w) => (w.t += dt));
      waves = waves.filter((w) => w.t < 1.1);

      // ground (tiles lift + swell as a wave crest travels through them)
      const waveSpeed = W * 0.85;
      for (let gx = -S.groundOff; gx < W; gx += u * 1.5) {
        let dy = 0;
        let ds = 1;
        for (const w of waves) {
          const front = w.t * waveSpeed;
          const d = Math.abs(gx - w.x) - front; // distance to the crest
          const bump = Math.exp(-(d * d) / (2 * (u * 1.6) * (u * 1.6))) * Math.exp(-w.t * 3.2);
          dy += w.power * bump;
          ds += bump * 0.9;
        }
        const s = u * 0.5 * Math.min(2.2, ds);
        tile(gx - (s - u * 0.5) / 2, groundY + u * 0.55 - dy - (s - u * 0.5) / 2, s, ink);
      }

      // obstacles
      for (const o of obstacles) {
        for (let c = 0; c < o.cols; c++) {
          for (let r = 0; r < o.rows; r++) {
            const top = r === o.rows - 1;
            tile(o.x + c * u, groundY - (r + 1) * u, u, top && o.accent && c === 0 ? accent : ink);
          }
        }
      }

      // star pickups (bob + pulse)
      stars.forEach((st) => {
        const bobY = st.y + Math.sin(S.t * 4 + st.x * 0.01) * u * 0.35;
        const cell = (2.4 * u) / 5 * (1 + Math.sin(S.t * 6) * 0.08);
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            if (STAR[r][c] === '#') tile(st.x + c * cell, bobY + r * cell, cell, accent);
          }
        }
      });

      // particles
      particles.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.9;
        tile(p.x, p.y, p.size, p.accent ? accent : ink);
      });
      ctx.globalAlpha = 1;

      // player (squash & stretch around the feet; star mode flashes)
      const bob = S.mode === 'idle' ? Math.sin(S.t * 2.4) * u * 0.35 : 0;
      const feetY = groundY - S.py + bob;
      const flashFreq = S.star > 0 && S.star < 1.4 ? 14 : 8;
      const starFlash = S.star > 0 && Math.floor(S.t * flashFreq) % 2 === 0;
      const bodyC = starFlash ? accent : ink;
      const accCell = starFlash ? ink : accent;
      const [ar, ac] = G_PATH[S.accent];
      ctx.save();
      ctx.translate(px + pSize / 2, feetY);
      const sy = S.stretch;
      ctx.scale(1 + (1 - sy) * 0.55, sy);
      ctx.translate(-pSize / 2, -pSize);
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const isAccent = S.mode !== 'dead' && r === ar && c === ac;
          if (G[r][c] === '#' || isAccent) {
            tile(c * pCell, r * pCell, pCell, isAccent ? accCell : bodyC);
          }
        }
      }
      ctx.restore();

      // HUD
      const hud = Math.max(2.5, Math.min(u * 0.34, (W * 0.85) / 52));
      text(String(Math.floor(S.score)).padStart(5, '0'), W - u, u * 0.8, hud, ink, 1);
      text(`HI ${S.hi}`, u, u * 0.8, hud, ink, 0);
      // star-mode timer: shrinking row of accent tiles top-center
      if (S.star > 0) {
        const n = Math.ceil((S.star / 6) * 12);
        const ts = hud * 1.1;
        for (let i = 0; i < n; i++) {
          tile(W / 2 - 6 * ts * 1.25 + i * ts * 1.25, u * 0.8, ts, accent);
        }
      }

      // overlays
      const big = Math.max(3, Math.min(u * 0.62, (W * 0.9) / 36));
      if (S.mode === 'idle' && Math.floor(S.t * 1.6) % 2 === 0) {
        text('CLICK TO PLAY', W / 2, H * 0.34, big * 0.6, ink, 0.5);
      }
      if (S.mode === 'dead') {
        text('GAME OVER', W / 2, H * 0.28, big, ink, 0.5);
        if (Math.floor(S.t * 1.6) % 2 === 0) {
          text('CLICK TO RETRY', W / 2, H * 0.28 + big * 8, big * 0.55, ink, 0.5);
        }
        if (S.flash > 0) {
          const fs = u * 1.2;
          for (let fy = 0; fy < H; fy += fs) {
            for (let fx = 0; fx < W; fx += fs) {
              if ((Math.floor(fx / fs) + Math.floor(fy / fs)) % 2 === 0) {
                ctx.globalAlpha = Math.max(0, S.flash) * 1.6;
                tile(fx, fy, fs, accent);
                ctx.globalAlpha = 1;
              }
            }
          }
        }
      }

      ctx.restore();
      raf = requestAnimationFrame(loop);
    };
    canvas.dataset.state = 'idle';
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('keydown', onKey);
      canvas.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: 'clamp(280px, 34vw, 500px)', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        role="application"
        tabIndex={0}
        aria-label="GRAPHIQ pixel runner — click or press space to jump; grab the star to smash obstacles"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'manipulation',
          cursor: 'pointer',
          outline: 'none',
        }}
      />
    </div>
  );
}
