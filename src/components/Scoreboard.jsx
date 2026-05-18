import { useState } from 'react';
import PowerupSelector from './PowerupSelector';
import AttackLog from './AttackLog';
import { Avatar, ChunkyButton } from '../design/ui';
import { PALETTE, DEFENSE_META } from '../design/theme';
import { playSound } from '../design/sounds';

const medals = ['🥇', '🥈', '🥉'];
const podiumColors = [PALETTE.accent, '#C0C0C0', '#CD7F32'];

export default function Scoreboard({ game, room, myId, onReadyNext, onUseAttack, activatedDefense, onActivateDefense }) {
  const {
    scoreboard = [], currentRound, totalRounds, isEndOfRound, isLast,
    timeLeft, readyCount = 0, totalPlayers = 0, myReady,
    availableAttacks = [], defenses = {}, myAttackUsed,
    attackLog = [], lastRoundAnswers = {},
  } = game;
  const myDefense = defenses[myId] || null;
  const [showAttackModal, setShowAttackModal] = useState(false);
  const hasAttack = availableAttacks.length > 0 && !myAttackUsed;
  const canActivateDefense = myDefense && myDefense !== 'bombita' && !activatedDefense;

  function handleReady() {
    if (myReady) return;
    playSound('pop');
    onReadyNext();
  }

  return (
    <div className="tz-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            color: PALETTE.text, letterSpacing: -0.5,
          }}>Marcador</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12, color: PALETTE.textDim, marginTop: 2,
          }}>{isLast ? 'Ronda final' : `Ronda ${currentRound}/${totalRounds}`}</div>
        </div>
      </div>

      {/* Ranking */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {scoreboard.map((p, i) => {
          const isMe = p.id === myId;
          return (
            <div key={p.id} style={{
              background: isMe ? `${PALETTE.primary}22` : PALETTE.surfaceSolid,
              border: `2px solid ${isMe ? PALETTE.primary : PALETTE.border}`,
              borderRadius: 18, padding: 12,
              display: 'flex', alignItems: 'center', gap: 10,
              animation: `slideInLeft .4s ${i * 0.06}s backwards`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: podiumColors[i] || PALETTE.bg2,
                color: i < 3 ? PALETTE.bg0 : PALETTE.text,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{medals[i] || `#${i + 1}`}</div>
              <Avatar nickname={p.nickname} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                  color: PALETTE.text,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{p.nickname}{isMe && (
                  <span style={{ color: PALETTE.primary, marginLeft: 6, fontSize: 11 }}>· VOS</span>
                )}</div>
                {lastRoundAnswers[p.id] && (
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                    color: lastRoundAnswers[p.id].correct ? PALETTE.success : PALETTE.textDim,
                    marginTop: 1,
                  }}>
                    {lastRoundAnswers[p.id].points > 0 ? `+${lastRoundAnswers[p.id].points} pts` : '0 pts'}
                    {lastRoundAnswers[p.id].timeSpent != null && ` · ${lastRoundAnswers[p.id].timeSpent}s`}
                  </div>
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                color: PALETTE.accent, flexShrink: 0,
              }}>{(p.score || 0).toLocaleString()}</div>
            </div>
          );
        })}
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
        <ChunkyButton color={myReady ? PALETTE.bg2 : PALETTE.success}
          shadow={myReady ? 'rgba(0,0,0,0.4)' : PALETTE.successDark}
          textColor={myReady ? PALETTE.textDim : '#fff'}
          disabled={!!myReady} onClick={handleReady}
          style={{ flex: 1.4, fontSize: 15 }}>
          {myReady ? '✓ Listo' : isLast ? 'Resultado final' : isEndOfRound ? 'Siguiente ronda →' : 'Siguiente →'}
        </ChunkyButton>
      </div>

      <div style={{
        textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12,
        color: PALETTE.textDim, fontWeight: 600,
      }}>
        {readyCount}/{totalPlayers} listos · auto en {timeLeft}s
      </div>

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
        }}>{meta.label} activo</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: PALETTE.textDim,
        }}>{meta.desc}</div>
      </div>
    </div>
  );
}
