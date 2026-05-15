import { useEffect, useRef } from 'react';
import PyramidViz from '../design/Pyramid';
import { PALETTE, OPTION_COLORS } from '../design/theme';
import { playSound } from '../design/sounds';
import { emitFeedback } from '../design/feedback';

export default function PyramidResult({ game, myId }) {
  const {
    movements = {}, correctIndex, options = [],
    playerAnswers = {}, questionNumber,
    positions = {}, pyramidHeight,
    winnerId, winnerNickname, timeLeft,
  } = game;

  const myAnswer = playerAnswers[myId];
  const myMovement = movements[myId] ?? 0;
  const direction = myMovement > 0 ? 'up' : myMovement < 0 ? 'down' : 'stay';

  const played = useRef(false);
  useEffect(() => {
    if (played.current) return; played.current = true;
    if (winnerId) { playSound('win'); emitFeedback('confetti'); }
    else if (direction === 'up') { playSound('stepUp'); emitFeedback('confetti'); }
    else if (direction === 'down') { playSound('stepDown'); emitFeedback('shake'); }
    else playSound('pop');
  }, []);

  // Decorate positions with movement for animation
  const decoratedPositions = Object.fromEntries(
    Object.entries(positions).map(([id, data]) => {
      const mov = movements[id] ?? 0;
      return [id, { ...data, justMoved: mov > 0 ? 'up' : mov < 0 ? 'down' : null }];
    })
  );

  return (
    <div className="tz-container">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: PALETTE.accent, letterSpacing: 2, textTransform: 'uppercase',
        }}>🏆 Pirámide · Resultado {questionNumber}</div>
      </div>

      {winnerId ? (
        <div style={{
          padding: 16, borderRadius: 18,
          background: `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.primary})`,
          color: PALETTE.bg0, textAlign: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
          boxShadow: `0 6px 0 ${PALETTE.primaryDark}`,
          animation: 'popIn .5s cubic-bezier(.34,1.56,.64,1)',
        }}>
          🏆 ¡{winnerNickname} llegó a la cima y ganó!
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
            color: direction === 'up' ? PALETTE.success : direction === 'down' ? PALETTE.danger : PALETTE.textDim,
            letterSpacing: -1,
            textShadow: direction !== 'stay'
              ? `0 4px 0 ${direction === 'up' ? PALETTE.successDark : PALETTE.dangerDark}` : 'none',
          }}>{direction === 'up' ? '¡SUBÍS!' : direction === 'down' ? 'BAJÁS...' : 'Quedás igual'}</div>
        </div>
      )}

      {/* Animated pyramid */}
      {pyramidHeight > 0 && (
        <PyramidViz
          positions={decoratedPositions}
          pyramidHeight={pyramidHeight}
          highlightId={myId}
          animate
          compact
        />
      )}

      {/* Correct answer */}
      <div style={{
        background: PALETTE.surfaceSolid, borderRadius: 16,
        border: `2px solid ${PALETTE.success}`,
        padding: 12, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: PALETTE.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: '#fff', flexShrink: 0,
        }}>✓</div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 10, color: PALETTE.textDim,
            fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          }}>Respuesta correcta</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 15, color: PALETTE.text, fontWeight: 700,
            textWrap: 'pretty',
          }}>{options[correctIndex]}</div>
        </div>
      </div>

      {/* Vote distribution */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {options.map((opt, idx) => {
          const voters = Object.values(playerAnswers).filter(p => p.answerIndex === idx);
          const isCorrect = idx === correctIndex;
          return (
            <div key={idx} style={{
              padding: '8px 12px', borderRadius: 12,
              background: isCorrect ? `${PALETTE.success}22` : PALETTE.surface,
              border: `1.5px solid ${isCorrect ? PALETTE.success : PALETTE.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                color: isCorrect ? PALETTE.success : PALETTE.textDim,
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                flex: 1, minWidth: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{isCorrect ? '✓ ' : ''}{opt}</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {voters.map((p, i) => (
                  <span key={i} title={p.nickname} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: OPTION_COLORS[idx % 4],
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {!winnerId && (
        <p style={{
          textAlign: 'center', color: PALETTE.textDim,
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
        }}>Posiciones en {timeLeft}s...</p>
      )}
    </div>
  );
}
