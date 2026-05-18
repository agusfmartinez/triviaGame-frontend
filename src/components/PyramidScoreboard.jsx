import { useState } from 'react';
import PowerupSelector from './PowerupSelector';
import AttackLog from './AttackLog';
import PyramidViz from '../design/Pyramid';
import { ChunkyButton } from '../design/ui';
import { PALETTE, DEFENSE_META } from '../design/theme';
import { playSound } from '../design/sounds';

export default function PyramidScoreboard({ game, room, myId, onReadyPyramid, onUseAttack, activatedDefense, onActivateDefense }) {
  const {
    positions = {}, pyramidHeight,
    questionNumber, readyCount = 0, totalPlayers = 0, timeLeft,
    availableAttacks = [], defenses = {}, myAttackUsed, myReadyPyramid,
    attackLog = [], movements = {},
  } = game;

  const decoratedPositions = Object.fromEntries(
    Object.entries(positions).map(([id, data]) => {
      const mov = movements[id];
      return [id, { ...data, justMoved: mov > 0 ? 'up' : mov < 0 ? 'down' : null }];
    })
  );

  const myDefense = defenses[myId] || null;
  const hasAttack = availableAttacks.length > 0 && !myAttackUsed;
  const canActivateDefense = myDefense && myDefense !== 'bombita' && !activatedDefense;
  const [showAttackModal, setShowAttackModal] = useState(false);

  function handleReady() {
    if (myReadyPyramid) return;
    playSound('pop');
    onReadyPyramid();
  }

  return (
    <div className="tz-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            color: PALETTE.accent, letterSpacing: -0.5,
          }}>🏆 Pirámide</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12, color: PALETTE.textDim, marginTop: 2,
          }}>Tras pregunta {questionNumber}</div>
        </div>
      </div>

      <div style={{
        background: PALETTE.surfaceSolid, border: `2px solid ${PALETTE.border}`,
        borderRadius: 18, padding: 8,
      }}>
        <PyramidViz positions={decoratedPositions} pyramidHeight={pyramidHeight}
          highlightId={myId} />
      </div>

      <AttackLog attackLog={attackLog} />

      {/* Defense section */}
      {myDefense && myDefense !== 'bombita' && (
        <>
          <DefenseBadge type={myDefense} />
          {canActivateDefense ? (
            <ChunkyButton
              color={DEFENSE_META[myDefense]?.color || PALETTE.primary}
              textColor="#fff"
              shadow="rgba(0,0,0,0.4)"
              onClick={() => { playSound('pop'); onActivateDefense(); }}
              style={{ fontSize: 14 }}>
              🛡️ Usar defensa esta ronda
            </ChunkyButton>
          ) : activatedDefense && (
            <div style={{
              textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 13, color: PALETTE.success,
            }}>✓ Defensa activada para la próxima pregunta</div>
          )}
        </>
      )}

      <div style={{ flex: 1, minHeight: 8 }} />

      <div style={{ display: 'flex', gap: 10 }}>
        {hasAttack && (
          <ChunkyButton color={PALETTE.accent} textColor={PALETTE.bg0} shadow={PALETTE.accentDark}
            onClick={() => { playSound('pop'); setShowAttackModal(true); }}
            style={{ flex: 1, fontSize: 15 }}>
            ⚡ Atacar
          </ChunkyButton>
        )}
        <ChunkyButton color={myReadyPyramid ? PALETTE.bg2 : PALETTE.success}
          shadow={myReadyPyramid ? 'rgba(0,0,0,0.4)' : PALETTE.successDark}
          textColor={myReadyPyramid ? PALETTE.textDim : '#fff'}
          disabled={!!myReadyPyramid} onClick={handleReady}
          style={{ flex: 1.4, fontSize: 15 }}>
          {myReadyPyramid ? '✓ Listo' : 'Siguiente →'}
        </ChunkyButton>
      </div>

      <div style={{
        textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12,
        color: PALETTE.textDim, fontWeight: 600,
      }}>{readyCount}/{totalPlayers} listos · auto en {timeLeft}s</div>

      {showAttackModal && (
        <PowerupSelector
          players={room?.players}
          myId={myId}
          availableAttacks={availableAttacks}
          onClose={() => setShowAttackModal(false)}
          onUseAttack={(targetId, type) => {
            setShowAttackModal(false);
            onUseAttack(targetId, type);
          }}
        />
      )}
    </div>
  );
}

function DefenseBadge({ type }) {
  const meta = DEFENSE_META[type];
  if (!meta) return null;
  return (
    <div style={{
      background: `${meta.color}22`, border: `2px solid ${meta.color}66`,
      borderRadius: 14, padding: '8px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 22 }}>{meta.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: meta.color,
        }}>{meta.label}</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: PALETTE.textDim,
        }}>{meta.desc}</div>
      </div>
    </div>
  );
}
