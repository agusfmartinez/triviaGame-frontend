import { ChunkyButton, TimerRing, Pill } from '../design/ui';
import { PALETTE, OPTION_COLORS, OPTION_SHADOWS } from '../design/theme';
import { playSound } from '../design/sounds';

const CATEGORY_ICONS = ['🏛️', '🔬', '⚽', '🎬', '🎵', '🌍', '🎨', '📚'];

export default function CategoryVote({ game, room, myId, onVote }) {
  const { categories = [], votes = [], timeLeft, myVote, currentRound, totalRounds } = game;
  const hasVoted = myVote !== undefined && myVote !== null;

  function handleVote(idx) {
    if (hasVoted) return;
    playSound('pop');
    onVote(idx);
  }

  return (
    <div className="tz-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
            letterSpacing: 1.5, color: PALETTE.textDim, textTransform: 'uppercase',
          }}>Ronda {currentRound}/{totalRounds}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            color: PALETTE.text,
          }}>Vota la categoría</div>
        </div>
        <TimerRing value={timeLeft} max={10} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
        {categories.map((cat, idx) => {
          const isMine = myVote === idx;
          const v = votes[idx] || 0;
          const color = OPTION_COLORS[idx % 4];
          const shadow = OPTION_SHADOWS[idx % 4];
          return (
            <button key={idx} onClick={() => handleVote(idx)} disabled={hasVoted && !isMine}
              style={{
                appearance: 'none', border: 'none', textAlign: 'left',
                background: color, color: PALETTE.bg0,
                fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
                padding: '16px 18px', borderRadius: 22,
                boxShadow: isMine
                  ? `0 0 0 4px ${PALETTE.bg0}, 0 0 0 7px ${color}, 0 6px 0 ${shadow}`
                  : `0 6px 0 ${shadow}`,
                transform: isMine ? 'scale(1.02)' : 'scale(1)',
                opacity: hasVoted && !isMine ? 0.5 : 1,
                transition: 'transform .15s, box-shadow .15s, opacity .2s',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: hasVoted ? 'default' : 'pointer',
                animation: `slideInUp .35s ${idx * 0.06}s backwards`,
                minHeight: 60,
              }}>
              <span style={{ fontSize: 32 }}>{CATEGORY_ICONS[idx % CATEGORY_ICONS.length]}</span>
              <span style={{ flex: 1 }}>{cat}</span>
              <span style={{
                background: 'rgba(0,0,0,0.18)', color: '#fff',
                borderRadius: 12, padding: '4px 12px',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
                minWidth: 32, textAlign: 'center',
              }}>{v}</span>
            </button>
          );
        })}
      </div>

      <p style={{
        textAlign: 'center', color: PALETTE.textDim,
        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
      }}>{hasVoted ? '✓ Voto registrado. Esperando resultados...' : 'Elegí una categoría'}</p>
    </div>
  );
}
