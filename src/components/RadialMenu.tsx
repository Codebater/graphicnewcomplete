'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import PixelGLogo from '@/components/PixelGLogo';

// Installation menu (all widths): numbered editorial destination list, then
// the ball head sitting on the cloud bank — a real 3D sphere with filled
// white star eyes — and a social block below.

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

// ---- 3D ball: the exact menu-ball artwork projected onto a true WebGL
// sphere (raymarched on a quad — no three.js payload). Gentle idle wobble,
// grab-to-spin with momentum + settle-to-face. The star eyes are windows
// into a white cavity where pixel hearts levitate at depth; head and
// hearts WATCH THE POINTER (hearts dart ahead like pupils), resting on
// the WhatsApp icon when no pointer is around. Falls back to the plain
// <img> when WebGL is unavailable. ----
const BALL_FRAG = `
precision mediump float;
varying vec2 vP;
uniform sampler2D uTex;
uniform vec2 uAng;    // yaw, pitch
uniform float uPx;    // canvas pixel size (min dimension)
uniform float uTime;  // seconds — drives the heartbeat
uniform vec3 uAccent; // brand accent (theme-aware) for the heart pupils
uniform vec2 uGaze;   // where the head is aimed — keeps the hearts framed
uniform vec2 uLook;   // pointer direction — the hearts dart toward it

// the brand's 7x6 pixel heart (the hero-lens bitmap), rows as bitmasks
float heartPx(vec2 p) {
  vec2 g = vec2((p.x + 0.5) * 7.0, (0.5 - p.y) * 6.0);
  if (g.x < 0.0 || g.x >= 7.0 || g.y < 0.0 || g.y >= 6.0) return 0.0;
  float c = floor(g.x), rw = floor(g.y), v;
  if (rw < 0.5) v = 54.0;
  else if (rw < 1.5) v = 127.0;
  else if (rw < 2.5) v = 127.0;
  else if (rw < 3.5) v = 62.0;
  else if (rw < 4.5) v = 28.0;
  else v = 8.0;
  return mod(floor(v / pow(2.0, c)), 2.0);
}
// head space -> view space (inverse of the surface rotation), so objects
// floating INSIDE the head project correctly behind the windows
vec3 h2v(vec3 h, float cy, float sy, float cp, float sp) {
  vec3 a = vec3(cy * h.x + sy * h.z, h.y, -sy * h.x + cy * h.z);
  return vec3(a.x, cp * a.y - sp * a.z, sp * a.y + cp * a.z);
}
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

  // ONE glossy black material for the whole sphere, lit in VIEW space —
  // front and back identical, the studio light stays put while it spins
  float spec = pow(max(dot(n, normalize(vec3(0.25, 0.8, 0.55))), 0.0), 48.0);
  float glow = pow(max(dot(n, normalize(vec3(0.2, 0.75, 0.62))), 0.0), 8.0);
  float spec2 = pow(max(dot(n, normalize(vec3(-0.45, -0.15, 0.6))), 0.0), 26.0);
  float fres = pow(1.0 - n.z, 2.6);
  vec3 col = vec3(0.043, 0.041, 0.04)
    + vec3(0.85, 0.85, 0.84) * spec
    + vec3(0.05, 0.05, 0.05) * glow
    + vec3(0.10, 0.10, 0.10) * spec2
    + vec3(0.085, 0.082, 0.08) * fres;

  // star-eye SHAPE from the artwork's alpha — restricted to the ball
  // INTERIOR so the texture's feathered rim can never bleed at the
  // hemisphere seam
  vec2 xy = q.z < 0.0 ? normalize(q.xy) : q.xy;
  vec2 uv = vec2(0.50125, 0.4975) + vec2(xy.x, -xy.y) * 0.445;
  float interior = 1.0 - smoothstep(0.78, 0.93, length(xy));
  float holes = mix(1.0, texture2D(uTex, uv).a, interior);
  float frontHoles = mix(1.0, holes, smoothstep(0.0, 0.1, q.z));
  // the star eyes are FILLED white, not see-through: the cutout shape
  // becomes a bright plate on the surface (shaded by the same sphere
  // lighting so it reads as part of the ball, not a flat sticker)
  float eye = 1.0 - frontHoles;
  float frontness = smoothstep(0.02, 0.16, q.z);
  float a = 1.0;

  // ---- the stars are WINDOWS into the head: a white cavity with pixel
  //      hearts LEVITATING inside it. The hearts sit at depth in head
  //      space and are projected back to the screen, so they parallax
  //      against the windows as he turns — properly inside, not painted
  //      on the surface. ----
  float o = 0.022;                       // 4 taps -> how deep inside the
  float av = 0.25 * ((1.0 - texture2D(uTex, uv + vec2(o, 0.0)).a)   // window
                   + (1.0 - texture2D(uTex, uv - vec2(o, 0.0)).a)   // we are
                   + (1.0 - texture2D(uTex, uv + vec2(0.0, o)).a)
                   + (1.0 - texture2D(uTex, uv - vec2(0.0, o)).a));
  float ao = smoothstep(0.30, 0.95, av);
  vec3 inner = vec3(0.97, 0.96, 0.945) * mix(0.40, 1.0, ao);   // lit cavity

  float beat = pow(max(sin(uTime * 2.6), 0.0), 5.0)
             + 0.55 * pow(max(sin(uTime * 2.6 - 0.9), 0.0), 5.0);
  float hw = 0.20 * (1.0 + 0.14 * beat);
  vec2 hsz = vec2(hw, hw * 6.0 / 7.0);
  // each heart floats at depth dz behind its star. Because the projection
  // is orthographic, depth shifts the heart against its window as he
  // turns — so anchor it to the RESTING gaze (it stays framed at rest and
  // parallaxes properly whenever he is turned away from it).
  float dz = 0.42;
  float tgy = tan(uGaze.x), tgp = tan(uGaze.y), cgy = cos(uGaze.x);
  vec2 sL = vec2(-0.4165, 0.1276), sR = vec2(0.4834, 0.1287);
  float szL = 0.9001, szR = 0.8659;                   // sqrt(1 - x^2 - y^2)
  vec2 dart = vec2(uLook.x, -uLook.y) * 0.075;   // pupils lead the head
  vec3 hA = h2v(vec3(sL.x + tgy * (szL - dz) + dart.x + 0.02 * sin(uTime * 0.70),
                     sL.y + tgp * (dz - szL) / cgy + dart.y + 0.03 * sin(uTime * 1.10),
                     dz), cy, sy, cp, sp);
  vec3 hB = h2v(vec3(sR.x + tgy * (szR - dz) + dart.x + 0.018 * sin(uTime * 0.62 + 2.1),
                     sR.y + tgp * (dz - szR) / cgy + dart.y + 0.028 * sin(uTime * 1.25 + 1.4),
                     dz), cy, sy, cp, sp);
  float sh = max(heartPx((vP - hA.xy + vec2(0.012, 0.028)) / hsz),
                 heartPx((vP - hB.xy + vec2(0.012, 0.028)) / hsz));
  inner = mix(inner, inner * 0.60, sh * 0.55);          // cast shadow = float
  float hrt = max(heartPx((vP - hA.xy) / hsz), heartPx((vP - hB.xy) / hsz));
  inner = mix(inner, uAccent, hrt);
  col = mix(col, inner, eye);

  // THE SMILE — the hero ball's mouth, carved not pasted: a crescent
  // (lune between two arcs, measured off clay-hero: lower arc centre
  // (0,-0.155) r 0.319, upper (0,0.565) r 0.865 in ball radii) with a
  // bright specular lip hugging its lower edge. Rides the surface, so it
  // curves away as he turns.
  float dL = length(xy - vec2(0.0, -0.155)) - 0.319;   // <0 inside lower disc
  float dU = length(xy - vec2(0.0, 0.565)) - 0.865;    // >0 outside upper disc
  float e = 0.011;
  float mouth = smoothstep(e, -e, dL) * smoothstep(-e, e, dU);
  float taper = smoothstep(0.27, 0.12, abs(xy.x));
  col = mix(col, vec3(0.012, 0.012, 0.013), mouth * frontness);
  float lip = smoothstep(0.030, 0.004, abs(dL)) * smoothstep(-e, e, dU);
  col += vec3(0.23, 0.23, 0.225) * lip * taper * frontness;
  float upperEdge = smoothstep(0.018, 0.002, abs(dU)) * smoothstep(e, -e, dL);
  col += vec3(0.05, 0.05, 0.05) * upperEdge * taper * frontness;

  gl_FragColor = vec4(col, a * aa);
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
    let uTime: WebGLUniformLocation | null = null;
    let uAccent: WebGLUniformLocation | null = null;
    let uGaze: WebGLUniformLocation | null = null;
    let uLook: WebGLUniformLocation | null = null;
    let accent: [number, number, number] = [0.69, 0.42, 0.32];
    let aimYaw = 0, aimPitch = 0, lookX = 0, lookY = 0, wasVisible = false;
    let waX = 0, waY = 0, hasWa = false;      // resting target: WhatsApp icon
    let ptrX = 0, ptrY = 0, ptrAt = -1e9;     // live pointer target

    // heart colour follows the theme accent (clay in light, lime in dark) —
    // resolved via a probe element so any colour syntax lands as rgb()
    const readAccent = () => {
      const probe = document.createElement('span');
      probe.style.cssText = 'display:none;color:var(--accent)';
      cv.appendChild(probe);
      const m = getComputedStyle(probe).color.match(/[\d.]+/g);
      probe.remove();
      if (m && m.length >= 3) {
        accent = [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
      }
    };
    const themeObs = new MutationObserver(readAccent);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['color-scheme', 'class', 'style'],
    });

    // he WATCHES THE POINTER — head turns, hearts dart ahead of it like
    // pupils. With no pointer around he rests looking at the WhatsApp icon.
    const findWhatsApp = () => {
      const wa = document.querySelector('.rm-social');
      if (!wa) { hasWa = false; return; }
      const wr = wa.getBoundingClientRect();
      waX = wr.left + wr.width / 2;
      waY = wr.top + wr.height / 2;
      hasWa = wr.width > 0;
    };
    const onPointer = (e: PointerEvent) => {
      ptrX = e.clientX; ptrY = e.clientY; ptrAt = performance.now();
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    const onResize = () => { wasVisible = false; };
    window.addEventListener('resize', onResize);
    const t0 = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // preload the texture image early (plain fetch, no GL)
    const texImg = new Image();
    texImg.src = '/porthomeimages/menu-ball.webp';

    const onDown = (e: PointerEvent) => {
      dragging = true; spinning = false;
      tYaw = yaw; vel = 0;
      lastX = e.clientX; lastY = e.clientY;
      try { cv.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
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
      uTime = g.getUniformLocation(prog, 'uTime');
      uAccent = g.getUniformLocation(prog, 'uAccent');
      uGaze = g.getUniformLocation(prog, 'uGaze');
      uLook = g.getUniformLocation(prog, 'uLook');
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
      readAccent();
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
      if (!wasVisible) { wasVisible = true; findWhatsApp(); }
      const now = performance.now();
      const t = (now - t0) / 1000;
      // dt-normalised physics (frames of 60Hz) — identical feel on 120Hz
      const dt = lastT ? Math.min((now - lastT) / 16.667, 3) : 1;
      lastT = now;

      // ---- what he is watching: the pointer while it is around, else
      //      back to the WhatsApp icon ----
      const rect = cv.getBoundingClientRect();
      const R = Math.max(rect.width / 2, 1);
      const live = now - ptrAt < 2600;
      const tx = live ? ptrX : hasWa ? waX : rect.left + rect.width / 2;
      const ty = live ? ptrY : hasWa ? waY : rect.top + rect.height / 2;
      const ddx = tx - (rect.left + rect.width / 2);
      const ddy = ty - (rect.top + rect.height / 2);
      const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
      const ease = 1 - Math.pow(0.88, dt);
      aimYaw += (cl((0.28 * ddx) / R, 0.34) - aimYaw) * ease;
      aimPitch += (cl((0.28 * ddy) / R, 0.22) - aimPitch) * ease;
      lookX += (cl(ddx / (R * 2.4), 1) - lookX) * ease;
      lookY += (cl(ddy / (R * 2.4), 1) - lookY) * ease;
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
        tYaw = yawBase + aimYaw + (reduced ? 0 : 0.05 * Math.sin(t * 0.55));
        yaw += (tYaw - yaw) * (1 - Math.pow(0.9, dt));
      }
      if (!dragging) {
        tPitch = aimPitch + (reduced ? 0 : 0.03 * Math.sin(t * 0.8 + 1.3));
      }
      pitch += (tPitch - pitch) * (1 - Math.pow(0.9, dt));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(rect.width * dpr));
      if (cv.width !== w) { cv.width = w; cv.height = w; }
      gl.viewport(0, 0, w, w);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uAng, yaw, pitch);
      gl.uniform1f(uPx, w);
      gl.uniform1f(uTime, t);
      gl.uniform3f(uAccent, accent[0], accent[1], accent[2]);
      gl.uniform2f(uGaze, aimYaw, aimPitch);
      gl.uniform2f(uLook, lookX, lookY);
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
      themeObs.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onUp);
      cv.removeEventListener('webglcontextlost', onLost);
      img.style.visibility = '';
    };
  }, [canvasRef, imgRef]);
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
