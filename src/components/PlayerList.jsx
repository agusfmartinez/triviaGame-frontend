import { Avatar } from '../design/ui';
import { PALETTE } from '../design/theme';

export default function PlayerList({ players, myId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        paddingBottom: 4,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
          color: PALETTE.text,
        }}>Jugadores</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
          color: PALETTE.success, padding: '3px 10px',
          background: `${PALETTE.success}22`, borderRadius: 10,
        }}>{players.length}/10</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {players.map((p, i) => (
          <div key={p.id} style={{
            background: PALETTE.surface,
            border: `2px solid ${p.id === myId ? PALETTE.primary : PALETTE.border}`,
            borderRadius: 18, padding: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            animation: `slideInUp .4s ${i * 0.08}s backwards`,
          }}>
            <Avatar nickname={p.nickname} size={40}
              ring={p.isHost ? PALETTE.accent : null} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                color: PALETTE.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.nickname}{p.id === myId && (
                <span style={{ color: PALETTE.primary, marginLeft: 6, fontSize: 11 }}>· VOS</span>
              )}</div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                color: p.isHost ? PALETTE.accent : PALETTE.textDim,
              }}>{p.isHost ? '👑 Host' : 'Listo'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
