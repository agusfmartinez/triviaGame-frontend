import { useState } from 'react';
import { ChunkyButton, Avatar } from '../design/ui';
import { PALETTE, ATTACK_META } from '../design/theme';
import { playSound } from '../design/sounds';

// Bottom-sheet modal for picking attack target + type.
// Used by Scoreboard and PyramidScoreboard.
export default function PowerupSelector({
  players = [], myId, availableAttacks = [], onClose, onUseAttack,
}) {
  const [target, setTarget] = useState(null);
  const [type, setType] = useState(null);
  const others = players.filter(p => p.id !== myId);

  function confirm() {
    if (!target || !type) return;
    playSound(ATTACK_META[type]?.cast || 'pop');
    onUseAttack(target, type);
  }

  function skip() {
    playSound('tap');
    onUseAttack(null, null);
    onClose?.();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn .25s',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: PALETTE.bg1,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        border: `2px solid ${PALETTE.border}`, borderBottom: 'none',
        padding: '16px 20px calc(28px + var(--safe-bottom))',
        animation: 'slideUpSheet .35s cubic-bezier(.34,1.56,.64,1)',
        maxHeight: '85vh', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: PALETTE.border, borderRadius: 2, margin: '0 auto 16px' }} />
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
          color: PALETTE.text, marginBottom: 4,
        }}>⚡ Lanzá un ataque</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: PALETTE.textDim, marginBottom: 16,
        }}>Elegí a un rival y un powerup</div>

        <Section label="1. Objetivo">
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginLeft: -4, paddingLeft: 4 }}>
            {others.map(p => (
              <button key={p.id} onClick={() => { playSound('tap'); setTarget(p.id); }} style={{
                flexShrink: 0, appearance: 'none', border: 'none',
                padding: 6, background: 'transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <Avatar nickname={p.nickname} size={52}
                  ring={target === p.id ? PALETTE.primary : PALETTE.border} />
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                  color: target === p.id ? PALETTE.primary : PALETTE.text,
                  maxWidth: 70, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{p.nickname}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section label="2. Powerup">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {availableAttacks.map(t => {
              const meta = ATTACK_META[t];
              if (!meta) return null;
              const active = type === t;
              return (
                <button key={t} onClick={() => { playSound('tap'); setType(t); }} style={{
                  appearance: 'none', border: `2.5px solid ${active ? meta.color : PALETTE.border}`,
                  background: active ? `${meta.color}22` : PALETTE.surfaceSolid,
                  padding: 12, borderRadius: 16, textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  transition: 'all .15s',
                }}>
                  <div style={{ fontSize: 26 }}>{meta.icon}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                    color: active ? meta.color : PALETTE.text,
                  }}>{meta.label}</div>
                </button>
              );
            })}
          </div>
        </Section>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <ChunkyButton color={PALETTE.bg2} shadow="rgba(0,0,0,0.4)" textColor={PALETTE.textDim}
            onClick={skip} style={{ flex: 1, fontSize: 14 }}>
            Saltar
          </ChunkyButton>
          <ChunkyButton color={PALETTE.primary} shadow={PALETTE.primaryDark}
            disabled={!target || !type} onClick={confirm}
            style={{ flex: 1.5, fontSize: 14 }}>
            🚀 Atacar
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
        letterSpacing: 1.5, color: PALETTE.textDim, textTransform: 'uppercase',
        marginBottom: 8,
      }}>{label}</div>
      {children}
    </div>
  );
}
