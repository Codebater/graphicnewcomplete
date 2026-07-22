'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
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

// ---- 3D ball: the exact menu-ball artwork projected onto a true WebGL
// sphere (raymarched on a quad — no three.js payload). Gentle idle wobble,
// grab-to-spin with clamped angles + spring-back so the face and the
// star-hole eye windows stay aligned. Falls back to the plain <img> when
// WebGL is unavailable or the context is lost. ----
const BALL_FRAG = `
precision mediump float;
varying vec2 vP;
uniform sampler2D uTex;
uniform vec2 uAng;   // yaw, pitch
uniform float uPx;   // canvas pixel size (min dimension)
void main() {
  float r2 = dot(vP, vP);
  float r = sqrt(r2);
  float aa = 1.0 - smoothstep(1.0 - 3.0 / uPx, 1.0, r);
  if (aa <= 0.0) { gl_FragColor = vec4(0.0); return; }
  vec3 n = vec3(vP, sqrt(max(1.0 - r2, 0.0)));   // view-space normal
  float cp = cos(uAng.y), sp = sin(uAng.y);
  vec3 q = vec3(n.x, cp * n.y + sp * n.z, -sp * n.y + cp * n.z);
  float cy = cos(uAng.x), sy = sin(uAng.x);
  q = vec3(cy * q.x - sy * q.z, q.y, sy * q.x + cy * q.z);

  // front hemisphere: the photographed artwork, planar-projected
  vec2 xy = q.z < 0.0 ? normalize(q.xy) : q.xy;
  vec2 uv = vec2(0.50125, 0.4975) + vec2(xy.x, -xy.y) * 0.445;
  vec4 face = texture2D(uTex, uv);

  // back hemisphere: procedural glossy black, lit in VIEW space (the
  // studio light stays put while the ball spins — matches the photo's
  // top sheen language)
  float spec = pow(max(dot(n, normalize(vec3(0.25, 0.8, 0.55))), 0.0), 48.0);
  float spec2 = pow(max(dot(n, normalize(vec3(-0.45, -0.15, 0.6))), 0.0), 26.0);
  float fres = pow(1.0 - n.z, 2.6);
  vec3 backCol = vec3(0.043, 0.041, 0.04)
    + vec3(0.85, 0.85, 0.84) * spec
    + vec3(0.10, 0.10, 0.10) * spec2
    + vec3(0.085, 0.082, 0.08) * fres;
  vec4 back = vec4(backCol, 1.0);

  vec4 col = mix(back, face, smoothstep(0.0, 0.14, q.z));
  gl_FragColor = vec4(col.rgb, col.a * aa);
}`;

function useBall3D(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  imgRef: React.RefObject<HTMLImageElement | null>
) {
  useEffect(() => {
    const cv = canvasRef.current;
    const img = imgRef.current;
    if (!cv || !img) return;

    // LAZY: creating a WebGL context at page load interfered with the menu
    // open timeline — nothing GL happens until the menu is first opened
    // (canvas gains an offsetParent). Until then this is a idle rAF poll.
    let dead = false, inited = false, shown = false, raf = 0;
    let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0;
    let dragging = false, lastX = 0, lastY = 0;
    let vel = 0, spinning = false, yawBase = 0, lastT = 0;
    let texReady = false;
    let gl: WebGLRenderingContext | null = null;
    let uAng: WebGLUniformLocation | null = null;
    let uPx: WebGLUniformLocation | null = null;
    const t0 = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // preload the texture image early (plain fetch, no GL)
    const texImg = new Image();
    texImg.src = '/porthomeimages/menu-ball.webp';

    const onDown = (e: PointerEvent) => {
      dragging = true; spinning = false;
      tYaw = yaw; vel = 0;
      lastX = e.clientX; lastY = e.clientY;
      cv.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const d = (e.clientX - lastX) * 0.009;
      tYaw += d;                       // yaw is FREE — full spins allowed
      vel = d;
      tPitch = Math.max(-0.35, Math.min(0.35, tPitch + (e.clientY - lastY) * 0.008));
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
      vel = Math.max(-0.3, Math.min(0.3, vel * 1.4));
      spinning = Math.abs(vel) > 0.01;
      if (!spinning) yawBase = Math.round(yaw / (Math.PI * 2)) * Math.PI * 2;
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      dead = true;
      img.style.visibility = '';
      cv.style.display = 'none';
    };

    const initGL = (): boolean => {
      gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true });
      if (!gl) return false;
      const g = gl;
      const sh = (type: number, src: string) => {
        const s = g.createShader(type)!;
        g.shaderSource(s, src);
        g.compileShader(s);
        return s;
      };
      const prog = g.createProgram()!;
      g.attachShader(prog, sh(g.VERTEX_SHADER,
        'attribute vec2 aPos; varying vec2 vP; void main(){ vP = aPos; gl_Position = vec4(aPos, 0.0, 1.0); }'));
      g.attachShader(prog, sh(g.FRAGMENT_SHADER, BALL_FRAG));
      g.linkProgram(prog);
      if (!g.getProgramParameter(prog, g.LINK_STATUS)) return false;
      g.useProgram(prog);
      g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
      const loc = g.getAttribLocation(prog, 'aPos');
      g.enableVertexAttribArray(loc);
      g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
      uAng = g.getUniformLocation(prog, 'uAng');
      uPx = g.getUniformLocation(prog, 'uPx');
      g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
      g.enable(g.BLEND);
      const upload = () => {
        g.bindTexture(g.TEXTURE_2D, g.createTexture());
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, texImg);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        texReady = true;
      };
      if (texImg.complete && texImg.naturalWidth) upload();
      else texImg.onload = () => { if (!dead) upload(); };
      cv.addEventListener('pointerdown', onDown);
      cv.addEventListener('pointermove', onMove);
      cv.addEventListener('pointerup', onUp);
      cv.addEventListener('pointercancel', onUp);
      cv.addEventListener('webglcontextlost', onLost);
      return true;
    };

    const tick = () => {
      if (dead) return;
      raf = requestAnimationFrame(tick);
      if (!cv.offsetParent) return;          // menu closed — stay idle
      if (!inited) {
        inited = true;
        if (!initGL()) { dead = true; return; }   // img fallback stays
      }
      if (!gl || !texReady) return;
      const now = performance.now();
      const t = (now - t0) / 1000;
      // dt-normalised physics (frames of 60Hz) — identical feel on 120Hz
      const dt = lastT ? Math.min((now - lastT) / 16.667, 3) : 1;
      lastT = now;
      if (dragging) {
        yaw += (tYaw - yaw) * (1 - Math.pow(0.65, dt));
      } else if (spinning) {
        yaw += vel * dt;              // flick momentum, then settle to face
        vel *= Math.pow(0.945, dt);
        if (Math.abs(vel) < 0.004) {
          spinning = false;
          yawBase = Math.round(yaw / (Math.PI * 2)) * Math.PI * 2;
        }
      } else {
        tYaw = yawBase + (reduced ? 0 : 0.26 * Math.sin(t * 0.55));
        yaw += (tYaw - yaw) * (1 - Math.pow(0.9, dt));
      }
      if (!dragging) {
        tPitch = reduced ? 0 : 0.10 * Math.sin(t * 0.8 + 1.3) - 0.02;
      }
      pitch += (tPitch - pitch) * (1 - Math.pow(0.9, dt));
      const rect = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(rect.width * dpr));
      if (cv.width !== w) { cv.width = w; cv.height = w; }
      gl.viewport(0, 0, w, w);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uAng, yaw, pitch);
      gl.uniform1f(uPx, w);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        img.style.visibility = 'hidden'; // keeps the layout box
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onUp);
      cv.removeEventListener('webglcontextlost', onLost);
      img.style.visibility = '';
    };
  }, [canvasRef, imgRef]);
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
  const ballCanvas = useRef<HTMLCanvasElement | null>(null);
  const ballImg = useRef<HTMLImageElement | null>(null);
  useBall3D(ballCanvas, ballImg);
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
          <img ref={ballImg} src="/porthomeimages/menu-ball.webp" alt="" />
          <canvas ref={ballCanvas} className="rm-ball__gl" aria-hidden="true" />
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
