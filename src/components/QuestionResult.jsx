import { useEffect, useRef } from 'react';
import { Pill } from '../design/ui';
import { PALETTE, OPTION_COLORS } from '../design/theme';
import { playSound } from '../design/sounds';
import { emitFeedback } from '../design/feedback';

export default function QuestionResult({ game, myId }) {
  const {
    options = [], correctIndex,
    playerAnswers = {},
    questionNumber, totalQuestions,
    timeLeft, attackLog = [],
  } = game;

  const myResult = playerAnswers[myId];
  const firedFor = useRef(null);

  useEffect(() => {
    if (!myResult || firedFor.current === questionNumber) return;
    firedFor.current = questionNumber;
    playSound(myResult.correct ? 'correct' : 'wrong');
    emitFeedback(myResult.correct ? 'confetti' : 'shake');
  }, [questionNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const players = Object.entries(playerAnswers).sort((a, b) => b[1].points - a[1].points);

  return (
    <div className="tz-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill color={PALETTE.accent} dark>Pregunta {questionNumber}/{totalQuestions}</Pill>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
          color: timeLeft <= 2 ? PALETTE.danger : PALETTE.textDim,
        }}>Marcador en {timeLeft}s</span>
      </div>

      {/* Hero feedback */}
      {myResult && (
        <div style={{ textAlign: 'center', animation: 'popIn .5s cubic-bezier(.34,1.56,.64,1)' }}>
          <div style={{
            fontSize: 90, lineHeight: 1, filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.4))',
          }}>{myResult.correct ? '🎉' : '💔'}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
            color: myResult.correct ? PALETTE.success : PALETTE.danger,
            marginTop: 8, letterSpacing: -1,
            textShadow: `0 4px 0 ${myResult.correct ? PALETTE.successDark : PALETTE.dangerDark}`,
          }}>{myResult.correct ? '¡Correcto!' : myResult.answerIndex !== null ? 'Casi...' : 'Sin tiempo'}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
            color: PALETTE.accent, marginTop: 4,
          }}>{myResult.correct ? `+${myResult.points} pts` : '+0 pts'}
            {myResult.timeSpent !== null && myResult.timeSpent !== undefined && (
              <span style={{
                color: PALETTE.textDim, fontSize: 13, marginLeft: 8, fontWeight: 600,
                fontFamily: 'var(--font-body)',
              }}>{myResult.timeSpent}s</span>
            )}
          </div>
        </div>
      )}

      {/* Correct answer card */}
      <div style={{
        background: PALETTE.surfaceSolid, borderRadius: 18,
        border: `2px solid ${PALETTE.success}`,
        padding: 14, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: PALETTE.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: '#fff', flexShrink: 0,
        }}>✓</div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11, color: PALETTE.textDim,
            fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          }}>Respuesta correcta</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 17, color: PALETTE.text, fontWeight: 700,
            textWrap: 'pretty',
          }}>{options[correctIndex]}</div>
        </div>
      </div>

      {/* Vote distribution */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {options.map((opt, idx) => {
          const voters = Object.values(playerAnswers).filter(p => p.answerIndex === idx);
          const isCorrect = idx === correctIndex;
          return (
            <div key={idx} style={{
              padding: '10px 14px', borderRadius: 12,
              background: isCorrect ? `${PALETTE.success}22` : PALETTE.surface,
              border: `1.5px solid ${isCorrect ? PALETTE.success : PALETTE.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                color: isCorrect ? PALETTE.success : PALETTE.textDim,
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                flex: 1, minWidth: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',
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

    </div>
  );
}
