// src/design/effects.jsx — Visual effects: confetti, bg, shake, powerup overlays
import { useState, useEffect, useMemo, useRef } from 'react';
import { PALETTE } from './theme';

// ─── Confetti burst ──────────────────────────────────────────────────────
const CONFETTI_COLORS = [PALETTE.primary, PALETTE.accent, PALETTE.success, PALETTE.info, '#fff'];

export function Confetti({ trigger, count = 60 }) {
  const [parts, setParts] = useState([]);
  useEffect(() => {
    if (!trigger) return;
    const next = Array.from({ length: count }, (_, i) => ({
      id: trigger + '-' + i,
      x: 50 + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 140,
      vy: -80 - Math.random() * 110,
      rot: Math.random() * 360,
      rotE: Math.random() * 360 + (Math.random() - 0.5) * 720,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      size: 6 + Math.random() * 8,
      delay: Math.random() * 120,
    }));
    setParts(next);
    const t = setTimeout(() => setParts([]), 2500);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (!parts.length) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none',
      overflow: 'hidden', zIndex: 1000,
    }}>
      {parts.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: '40%',
          width: p.size, height: p.shape === 'rect' ? p.size * 0.6 : p.size,
          background: p.color,
          borderRadius: p.shape === 'circle' ? '50%' : 2,
          animation: `confettiFall 2.2s ${p.delay}ms cubic-bezier(.2,.6,.4,1) forwards`,
          '--vx': `${p.vx}px`, '--vy': `${p.vy}px`,
          '--rot': `${p.rot}deg`, '--rotE': `${p.rotE}deg`,
        }} />
      ))}
    </div>
  );
}

// ─── Screen shake hook ───────────────────────────────────────────────────
export function useScreenShake() {
  const [nonce, setNonce] = useState(0);
  const trigger = () => setNonce(n => n + 1);
  return [nonce, trigger];
}

// ─── Animated background (renders the 3 blobs; CSS handles the rest) ─────
export function AnimatedBg() {
  return (
    <div className="tz-bg" aria-hidden="true">
      <div className="tz-bg-blob tz-bg-blob-1" />
      <div className="tz-bg-blob tz-bg-blob-2" />
      <div className="tz-bg-blob tz-bg-blob-3" />
    </div>
  );
}

// ─── FreezeOverlay — scoped to options container ─────────────────────────
export function FreezeOverlay({ active }) {
  const flakes = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 2, size: 12 + Math.random() * 10,
  })), []);
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30, borderRadius: 20, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(76,201,240,0.22), rgba(76,201,240,0.08))',
        backdropFilter: 'blur(2.5px)', WebkitBackdropFilter: 'blur(2.5px)',
        animation: 'freezeIn .5s ease-out',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 20,
        border: '3px solid rgba(180,230,255,0.75)',
        boxShadow: '0 0 30px rgba(76,201,240,0.6), inset 0 0 25px rgba(180,230,255,0.5)',
        animation: 'iceBorder 2s ease-in-out infinite',
      }} />
      {['0 0 auto auto', 'auto 0 0 auto', '0 auto auto 0', 'auto auto 0 0'].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', inset: pos, padding: 4,
          fontSize: 18, color: '#B4E6FF',
          textShadow: '0 0 10px rgba(180,230,255,0.9)',
          animation: `iceShimmer 2s ${i * 0.3}s ease-in-out infinite`,
        }}>❄</div>
      ))}
      {flakes.map(f => (
        <div key={f.id} style={{
          position: 'absolute', top: -20, left: `${f.x}%`,
          color: '#B4E6FF', fontSize: f.size,
          animation: `snowFallShort 3s ${f.delay}s linear infinite`,
          textShadow: '0 0 8px rgba(180,230,255,0.8)',
        }}>❄</div>
      ))}
    </div>
  );
}

// ─── StickyOverlay — opaque green slime ──────────────────────────────────
export function StickyOverlay({ active }) {
  const blobs = useMemo(() => Array.from({ length: 9 }, (_, i) => ({
    id: i, x: 5 + Math.random() * 90, y: 5 + Math.random() * 90,
    size: 55 + Math.random() * 50, delay: Math.random() * 1.5,
    rot: Math.random() * 360,
  })), []);
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30, borderRadius: 20, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(75,200,30,0.08)',
        animation: 'freezeIn .3s ease-out',
      }} />
      {blobs.map(b => (
        <div key={b.id} style={{
          position: 'absolute', left: `${b.x}%`, top: `${b.y}%`,
          width: b.size, height: b.size, '--r': `${b.rot}deg`,
          transform: `translate(-50%,-50%) rotate(${b.rot}deg)`,
          background: 'radial-gradient(circle at 38% 32%, #B6FF82 0%, #65D427 40%, #2E7B12 100%)',
          borderRadius: '60% 40% 50% 50% / 60% 50% 50% 40%',
          boxShadow: '0 0 18px rgba(75,200,30,0.5), inset -6px -8px 18px rgba(0,40,0,0.45), inset 4px 4px 10px rgba(255,255,255,0.25)',
          animation: `stickyBlob 3s ${b.delay}s ease-in-out infinite`,
          opacity: 0.96,
        }} />
      ))}
      <div style={{
        position: 'absolute', top: -20, left: '30%', width: 12, height: 28,
        background: 'linear-gradient(180deg, #9BFF6B, #4FA82B)',
        borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
        animation: 'slimeDrip 4s 0.2s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: -20, right: '20%', width: 10, height: 22,
        background: 'linear-gradient(180deg, #9BFF6B, #4FA82B)',
        borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
        animation: 'slimeDrip 5s 1s ease-in-out infinite',
      }} />
    </div>
  );
}

// ─── HideOverlay — darkness over options ─────────────────────────────────
export function HideOverlay({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30, borderRadius: 20, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.92) 100%)',
        backdropFilter: 'blur(3px) brightness(0.3)',
        WebkitBackdropFilter: 'blur(3px) brightness(0.3)',
        animation: 'freezeIn .4s ease-out',
      }} />
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          width: 140, height: 140,
          left: `${(i * 30 - 10) % 100}%`,
          top: `${(i * 25 + 10) % 100}%`,
          background: 'radial-gradient(circle, rgba(20,15,40,0.95) 0%, rgba(20,15,40,0) 70%)',
          animation: `darkCloud 6s ${i * 0.7}s ease-in-out infinite`,
        }} />
      ))}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 40, opacity: 0.5,
        filter: 'drop-shadow(0 0 12px rgba(138,123,255,0.8))',
        animation: 'eyeBlink 3s ease-in-out infinite',
      }}>🙈</div>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 20,
        border: '3px solid rgba(138,123,255,0.5)',
        boxShadow: 'inset 0 0 30px rgba(138,123,255,0.3)',
        animation: 'iceBorder 2s ease-in-out infinite',
      }} />
    </div>
  );
}

// ─── CountdownNumber — for QuestionIntro ─────────────────────────────────
export function CountdownNumber({ value }) {
  return (
    <div key={value} style={{
      fontFamily: 'var(--font-display)',
      fontSize: 180, lineHeight: 1, fontWeight: 700,
      color: value === 'GO!' ? PALETTE.success : PALETTE.accent,
      textShadow: `0 6px 0 ${PALETTE.primaryDark}, 0 12px 40px rgba(0,0,0,0.6)`,
      animation: 'countdownPop .9s cubic-bezier(.34,1.56,.64,1) forwards',
      WebkitTextStroke: '3px ' + (value === 'GO!' ? PALETTE.successDark : PALETTE.primaryDark),
    }}>{value}</div>
  );
}

// ─── ScreenShake wrapper — apply around your root content ────────────────
export function ScreenShake({ nonce, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!nonce || !ref.current) return;
    const el = ref.current;
    el.style.animation = 'none';
    el.offsetHeight; // force reflow to restart animation
    el.style.animation = 'shake .4s';
  }, [nonce]);
  return <div ref={ref}>{children}</div>;
}
