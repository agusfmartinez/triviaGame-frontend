import { useEffect, useRef } from 'react';
import { CountdownNumber } from '../design/effects';
import { PALETTE } from '../design/theme';
import { playSound } from '../design/sounds';

const CATEGORY_ICONS_BY_NAME = {
  Historia: '🏛️', Ciencia: '🔬', Deportes: '⚽', Cine: '🎬',
  Música: '🎵', Geografía: '🌍', Arte: '🎨', Literatura: '📚',
};

export default function QuestionIntro({ game }) {
  const { questionNumber, totalQuestions, categoryName, timeLeft } = game;
  const lastTick = useRef(null);

  // Trigger tick sounds at each second tick (deduped)
  useEffect(() => {
    if (timeLeft == null) return;
    if (lastTick.current === timeLeft) return;
    lastTick.current = timeLeft;
    if (timeLeft === 0) playSound('go');
    else if (timeLeft <= 3 && timeLeft > 0) playSound('tickUrgent');
    else if (timeLeft > 0) playSound('tick');
  }, [timeLeft]);

  const display = timeLeft === 0 ? 'GO!' : timeLeft;
  const icon = categoryName && CATEGORY_ICONS_BY_NAME[categoryName];

  return (
    <div className="tz-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 1 }} />
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
        letterSpacing: 3, color: PALETTE.textDim, textTransform: 'uppercase',
        textAlign: 'center',
      }}>Pregunta {questionNumber} de {totalQuestions}</div>

      {categoryName && (
        <div style={{
          background: PALETTE.surfaceSolid, border: `2px solid ${PALETTE.border}`,
          borderRadius: 18, padding: '8px 18px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {icon && <span style={{ fontSize: 26 }}>{icon}</span>}
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: PALETTE.accent,
          }}>{categoryName}</span>
        </div>
      )}

      <CountdownNumber value={display} />

      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
        color: PALETTE.textDim,
      }}>¡Preparate!</p>
      <div style={{ flex: 1 }} />
    </div>
  );
}
