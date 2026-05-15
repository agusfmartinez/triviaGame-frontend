import { useState, useEffect } from 'react';
import { PALETTE } from '../design/theme';

const FAST_MESSAGES = [
  { icon: '🎲', text: 'Mezclando preguntas...' },
  { icon: '🎉', text: 'Preparando confeti...' },
  { icon: '⚡', text: 'Cargando velocidad...' },
  { icon: '🏆', text: 'Puliendo la pirámide...' },
  { icon: '🦊', text: 'Despertando a los jugadores...' },
];

const SLOW_MESSAGES = [
  { icon: '🥱', text: 'Despertando el servidor...' },
  { icon: '🦠', text: 'Preparando el slime...' },
  { icon: '❄️', text: 'Descongelando preguntas...' },
  { icon: '🎮', text: 'Iniciando modo gaming...' },
  { icon: '🧠', text: 'Generando preguntas difíciles...' },
  { icon: '🔀', text: 'Barajando categorías...' },
];

export default function WakeupLoader({ slowWakeup }) {
  const messages = slowWakeup ? SLOW_MESSAGES : FAST_MESSAGES;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % messages.length);
    }, slowWakeup ? 2200 : 1400);
    return () => clearInterval(interval);
  }, [slowWakeup, messages.length]);

  const { icon, text } = messages[idx];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <div key={icon} style={{
        fontSize: 56,
        animation: 'popIn .4s cubic-bezier(.34,1.56,.64,1)',
      }}>
        {icon}
      </div>

      <div key={text} style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
        color: PALETTE.text, textAlign: 'center', padding: '0 40px',
        animation: 'slideInDown .35s cubic-bezier(.34,1.56,.64,1)',
      }}>
        {text}
      </div>

      {slowWakeup && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: PALETTE.textDim,
          textAlign: 'center', padding: '0 40px', marginTop: -8,
        }}>
          El servidor estaba durmiendo. Ya vuelve.
        </div>
      )}

      <div style={{
        display: 'flex', gap: 6, marginTop: 8,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: PALETTE.primary,
            animation: `bounce .9s ${i * 0.15}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
