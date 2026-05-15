// src/design/Pyramid.jsx — Reusable pyramid visualization
import { PALETTE } from './theme';
import { avatarFor } from './ui';

// Render an inverted-stack pyramid with players on their step.
// - positions: { [playerId]: { nickname, position, justMoved? } }  position 1..pyramidHeight, top = pyramidHeight
// - pyramidHeight: total steps
// - highlightId: optional, marks "you"
// - compact: small variant for inline use
// - animate: cascade-in animation on first render
export default function PyramidViz({
  positions = {}, pyramidHeight = 7, highlightId, animate, compact,
}) {
  const players = Object.entries(positions).map(([id, data]) => ({ id, ...data }));

  // Build steps from TOP (narrow) to BOTTOM (wide)
  const steps = [];
  for (let s = pyramidHeight; s >= 1; s--) {
    steps.push({ position: s, players: players.filter(p => p.position === s) });
  }

  return (
    <div style={{
      width: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: compact ? 4 : 6, padding: compact ? 8 : 14,
    }}>
      {steps.map((step, idx) => {
        // idx 0 = top (narrow), idx pyramidHeight-1 = base (wide)
        const widthPct = 45 + (idx / Math.max(1, pyramidHeight - 1)) * 50;
        const isTop = step.position === pyramidHeight;
        const ratio = idx / Math.max(1, pyramidHeight - 1);
        const accent = isTop ? PALETTE.accent
                    : ratio < 0.25 ? PALETTE.primary
                    : ratio < 0.6 ? PALETTE.info
                    : PALETTE.success;
        return (
          <div key={step.position} style={{
            position: 'relative',
            width: `${widthPct}%`,
            minHeight: compact ? 24 : 38,
            background: `linear-gradient(180deg, ${accent}, ${accent}99)`,
            border: `2px solid rgba(0,0,0,0.25)`,
            borderRadius: 8,
            boxShadow: `0 3px 0 rgba(0,0,0,0.3), inset 0 -3px 0 rgba(0,0,0,0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: compact ? '0 6px' : '0 10px',
            animation: animate ? `pyramidPop .4s ${idx * 0.06}s backwards` : undefined,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: compact ? 10 : 13, color: PALETTE.bg0,
              letterSpacing: 0.5,
            }}>{isTop ? '👑 Esc. 1' : `Esc. ${pyramidHeight - step.position + 1}`}</div>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {step.players.map(p => (
                <PlayerChip key={p.id} player={p}
                  highlight={p.id === highlightId} compact={compact} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlayerChip({ player, highlight, compact }) {
  const sz = compact ? 26 : 34;
  const emoji = avatarFor(player.nickname);
  return (
    <div style={{
      position: 'relative',
      width: sz, height: sz,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${PALETTE.bg2}, ${PALETTE.bg1})`,
      border: `2px solid ${highlight ? PALETTE.accent : 'rgba(255,255,255,0.2)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: compact ? 14 : 18,
      boxShadow: highlight ? `0 0 0 3px ${PALETTE.accent}66, 0 3px 0 rgba(0,0,0,0.3)` : '0 3px 0 rgba(0,0,0,0.3)',
      animation: player.justMoved === 'up'
        ? 'avatarRiseUp .8s cubic-bezier(.34,1.56,.64,1) backwards'
        : player.justMoved === 'down'
        ? 'avatarSinkDown .7s cubic-bezier(.34,1.56,.64,1) backwards'
        : (highlight ? 'avatarBounce 1.2s ease infinite' : undefined),
    }}
    title={player.nickname}>
      {emoji}
      {player.justMoved && (
        <div style={{
          position: 'absolute',
          top: player.justMoved === 'up' ? -14 : 'auto',
          bottom: player.justMoved === 'down' ? -14 : 'auto',
          left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, fontWeight: 700,
          color: player.justMoved === 'up' ? PALETTE.success : PALETTE.danger,
          animation: 'moveIndicator 1.6s ease-out forwards',
          pointerEvents: 'none',
        }}>{player.justMoved === 'up' ? '▲' : '▼'}</div>
      )}
    </div>
  );
}
