import { PALETTE, ATTACK_META } from '../design/theme';

export default function PlayerStatusPanel({ players = [], answeredPlayers = [], activeEffects = {}, myId }) {
  const answeredSet = new Set(answeredPlayers);
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {players.map(p => {
        const answered = answeredSet.has(p.id);
        const isMe = p.id === myId;
        const effects = activeEffects[p.id] || [];
        return (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20,
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
            background: answered ? `${PALETTE.success}22` : PALETTE.surface,
            border: `1.5px solid ${answered ? PALETTE.success : isMe ? PALETTE.primary : PALETTE.border}`,
            color: answered ? PALETTE.success : PALETTE.textDim,
            transition: 'all 0.3s',
          }}>
            <span>{answered ? '✅' : '⏳'}</span>
            {effects.map(e => (
              <span key={e} title={ATTACK_META[e]?.label}>{ATTACK_META[e]?.icon}</span>
            ))}
            <span style={{ fontWeight: isMe ? 800 : 600, color: isMe ? PALETTE.text : 'inherit' }}>{p.nickname}</span>
          </div>
        );
      })}
    </div>
  );
}
