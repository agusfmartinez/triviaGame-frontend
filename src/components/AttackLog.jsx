import { PALETTE, ATTACK_META } from '../design/theme';

export default function AttackLog({ attackLog = [] }) {
  if (!attackLog.length) return null;
  return (
    <div style={{
      background: PALETTE.surfaceSolid,
      border: `2px solid ${PALETTE.border}`,
      borderRadius: 18, padding: 12,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, paddingLeft: 2,
      }}>
        <span style={{ fontSize: 16 }}>💥</span>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
          color: PALETTE.text, letterSpacing: 0.5,
        }}>Esta ronda</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
          color: PALETTE.textDim, marginLeft: 'auto',
          background: PALETTE.surface, padding: '2px 8px', borderRadius: 8,
        }}>{attackLog.length} {attackLog.length === 1 ? 'ataque' : 'ataques'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
        {attackLog.map((entry, i) => <AttackLogRow key={i} entry={entry} delay={i * 0.06} />)}
      </div>
    </div>
  );
}

function AttackLogRow({ entry, delay }) {
  const meta = ATTACK_META[entry.type];
  const blocked = !!entry.blocked;
  const wasted = !!entry.wasted;
  const color = meta?.color || PALETTE.accent;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      padding: '6px 8px', borderRadius: 12,
      background: blocked ? 'rgba(255,209,102,0.1)'
                  : wasted ? 'rgba(255,255,255,0.03)'
                  : `${color}1a`,
      border: `1.5px solid ${blocked ? `${PALETTE.accent}55` : wasted ? 'transparent' : `${color}44`}`,
      animation: `slideInLeft .35s ${delay}s backwards`,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
        color: PALETTE.text, whiteSpace: 'nowrap',
      }}>{entry.attackerNickname}</span>

      <span style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 8,
        background: `${color}33`, border: `1px solid ${color}66`,
      }}>
        <span style={{ fontSize: 13 }}>{meta?.icon || '⚡'}</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
          color, letterSpacing: 0.5,
        }}>→</span>
      </span>

      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
        color: PALETTE.text, whiteSpace: 'nowrap',
        opacity: blocked || wasted ? 0.7 : 1,
      }}>{entry.targetNickname}</span>

      <div style={{ flex: 1, textAlign: 'right' }}>
        {blocked && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
            color: PALETTE.accent, letterSpacing: 0.5,
          }}>🛡️ BLOQUEADO</span>
        )}
        {wasted && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
            color: PALETTE.textDimmer, letterSpacing: 0.5,
          }}>💨 FALLÓ</span>
        )}
      </div>
    </div>
  );
}
