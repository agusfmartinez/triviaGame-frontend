// src/design/ui.jsx — Shared UI primitives for TRIVIAZO
import { useState } from 'react';
import { PALETTE } from './theme';

// ─── ChunkyButton ────────────────────────────────────────────────────────
// Big offset-shadow button. `color` controls bg, `shadow` controls 3D depth.
export function ChunkyButton({
  children, onClick, color = PALETTE.primary, shadow,
  textColor = '#fff', disabled, fullWidth, style, type = 'button', ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const sh = shadow || PALETTE.primaryDark;
  return (
    <button
      type={type}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="tz-btn"
      style={{
        width: fullWidth ? '100%' : undefined,
        background: color, color: textColor,
        boxShadow: pressed || disabled ? `0 2px 0 ${sh}` : `0 6px 0 ${sh}`,
        transform: pressed && !disabled ? 'translateY(4px)' : 'translateY(0)',
        ...style,
      }}
      {...rest}
    >{children}</button>
  );
}

// ─── BrandLogo ───────────────────────────────────────────────────────────
export function BrandLogo({ text = 'TRIVIAZO', size = 'lg' }) {
  const big = size === 'lg';
  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{
        display: 'inline-block', position: 'relative',
        fontFamily: 'var(--font-display)',
        fontSize: big ? 48 : 28, fontWeight: 700, lineHeight: 0.95,
        color: PALETTE.accent, letterSpacing: -1,
        textShadow: `0 ${big ? 5 : 3}px 0 ${PALETTE.primaryDark}, 0 ${big ? 6 : 4}px 0 ${PALETTE.primaryDark}`,
        WebkitTextStroke: big ? '2px ' + PALETTE.primaryDark : '1.5px ' + PALETTE.primaryDark,
        transform: 'rotate(-2deg)',
      }}>
        {text}
        <span style={{
          display: 'inline-block', color: PALETTE.primary, marginLeft: 4,
          transform: 'rotate(8deg) translateY(-4px)',
          WebkitTextStroke: big ? '2px #fff' : '1.5px #fff',
        }}>!</span>
      </div>
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────
// Deterministic emoji avatar derived from nickname.
const AVATAR_EMOJIS = ['🦊', '🐼', '🦁', '🐸', '🐧', '🦄', '🐯', '🐨', '🐵', '🐰', '🐮', '🐶', '🐱', '🐻', '🐹', '🐺'];
export function avatarFor(nickname) {
  if (!nickname) return '🎮';
  let h = 0;
  for (let i = 0; i < nickname.length; i++) h = (h * 31 + nickname.charCodeAt(i)) >>> 0;
  return AVATAR_EMOJIS[h % AVATAR_EMOJIS.length];
}

export function Avatar({ nickname, size = 44, ring, label, dim }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: dim ? 0.5 : 1 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${PALETTE.bg2}, ${PALETTE.bg1})`,
        border: `3px solid ${ring || PALETTE.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.55, boxShadow: `0 4px 0 ${ring || 'rgba(0,0,0,0.3)'}`,
        flexShrink: 0,
      }}>{avatarFor(nickname)}</div>
      {label !== undefined && <div style={{
        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
        color: PALETTE.textDim,
      }}>{label}</div>}
    </div>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, big, maxLength, autoFocus }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className={`tz-input${big ? ' big' : ''}`}
    />
  );
}

// ─── TimerRing ───────────────────────────────────────────────────────────
export function TimerRing({ value, max, size = 48, urgentAt = 5 }) {
  const pct = max > 0 ? value / max : 0;
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const color = value <= 3 ? PALETTE.danger : value <= urgentAt ? PALETTE.accent : PALETTE.success;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={PALETTE.border} strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${c * pct} ${c * (1 - pct)}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s linear, stroke .3s' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color,
      }}>{value}</div>
    </div>
  );
}

// ─── PhaseHeader — title + optional timer ────────────────────────────────
export function PhaseHeader({ title, subtitle, timer, timerMax }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
          color: PALETTE.text, letterSpacing: -0.5,
        }}>{title}</div>
        {subtitle && <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: PALETTE.textDim, marginTop: 2,
        }}>{subtitle}</div>}
      </div>
      {timer !== undefined && timer !== null && <TimerRing value={timer} max={timerMax || 10} />}
    </div>
  );
}

// ─── Pill / Badge ────────────────────────────────────────────────────────
export function Pill({ children, color = PALETTE.accent, dark }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 10,
      background: dark ? `${color}33` : color,
      color: dark ? color : PALETTE.bg0,
      fontFamily: 'var(--font-display)',
      fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
      border: dark ? `1px solid ${color}66` : 'none',
    }}>{children}</span>
  );
}

// ─── Sound toggle (top-right corner) ─────────────────────────────────────
import { isSoundMuted, setSoundMuted } from './sounds';
import { useEffect } from 'react';

export function SoundToggle() {
  const [muted, setMuted] = useState(isSoundMuted());
  function toggle() {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  }
  return (
    <button onClick={toggle} aria-label={muted ? 'Activar sonido' : 'Silenciar'} style={{
      position: 'fixed', top: 'calc(10px + var(--safe-top))', right: 12,
      width: 40, height: 40, borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: `1px solid ${PALETTE.border}`,
      color: PALETTE.text, fontSize: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', zIndex: 100,
    }}>{muted ? '🔇' : '🔊'}</button>
  );
}
