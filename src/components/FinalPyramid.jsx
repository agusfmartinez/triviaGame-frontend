import { useState, useEffect } from 'react';
import PlayerStatusPanel from './PlayerStatusPanel';

const OPTION_COLORS = ['#e94560', '#0f3460', '#533483', '#e8a838'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function FinalPyramid({ game, room, myId, onAnswer, onUseBombita }) {
  const {
    question,
    options = [],
    questionNumber,
    timeLeft,
    timeLimit,
    myAnswer,
    answeredCount = 0,
    answeredPlayers = [],
    activeEffects = {},
    attackLog = [],
    defenses = {},
    bombitaHide = [],
  } = game;

  const totalPlayers = game.totalPlayers || 0;
  const myEffects = activeEffects[myId] || [];
  const isFrozen = myEffects.includes('freeze');
  const isHidden = myEffects.includes('hide');
  const isSticky = myEffects.includes('sticky');
  const isConfused = myEffects.includes('confuse');
  const myDefense = defenses[myId];
  const pct = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 0;
  const canAnswer = myAnswer === null || myAnswer === undefined;
  const isDisabled = !canAnswer || isFrozen;

  const [displayOrder, setDisplayOrder] = useState([0, 1, 2, 3]);

  useEffect(() => {
    if (!isConfused) { setDisplayOrder([0, 1, 2, 3]); return; }
    const interval = setInterval(() => {
      setDisplayOrder(prev => {
        const a = [...prev];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isConfused]);

  function handleAnswer(originalIdx) {
    if (isDisabled) return;
    onAnswer(originalIdx);
  }

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#aaa', marginBottom: 6 }}>
          <span style={{ color: '#e8a838', fontWeight: 'bold' }}>🏆 Pirámide · Pregunta {questionNumber}</span>
          <span>{answeredCount}/{totalPlayers || '?'} respondieron</span>
        </div>
        <div style={{ height: 6, background: '#333', borderRadius: 3 }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: timeLeft <= 5 ? '#e94560' : '#e8a838',
            borderRadius: 3,
            transition: 'width 1s linear',
          }} />
        </div>
        <div style={{ textAlign: 'right', marginTop: 4, fontSize: 13, color: timeLeft <= 5 ? '#e94560' : '#aaa' }}>
          {timeLeft}s
        </div>
      </div>

      <h2 style={{ fontSize: 20, lineHeight: 1.4, marginBottom: 16 }}>{question}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {displayOrder.map((originalIdx, displayPos) => {
          const isMyAnswer = myAnswer === originalIdx;
          if (bombitaHide.includes(originalIdx)) return null;
          const fullyHidden = isHidden && canAnswer;

          return (
            <div key={originalIdx} style={{ position: 'relative' }}>
              <button
                onClick={() => handleAnswer(originalIdx)}
                disabled={isDisabled}
                style={{
                  width: '100%',
                  background: OPTION_COLORS[displayPos % 4],
                  opacity: (!canAnswer && !isMyAnswer) ? 0.4 : fullyHidden ? 0.15 : 1,
                  border: isMyAnswer ? '3px solid white' : '3px solid transparent',
                  borderRadius: 10,
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', flexShrink: 0,
                }}>
                  {isMyAnswer ? '✓' : OPTION_LABELS[displayPos]}
                </span>
                {fullyHidden ? '???' : options[originalIdx]}
              </button>
              {isSticky && canAnswer && (
                <div style={{
                  position: 'absolute', top: '25%', left: '20%',
                  width: '55%', height: '50%',
                  background: 'rgba(80,180,40,0.35)', borderRadius: 4, pointerEvents: 'none',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {myEffects.length > 0 && (
        <div style={{ padding: '8px 12px', borderRadius: 8, background: '#1a1020', border: '1px solid #e94560', marginBottom: 8, fontSize: 13, color: '#e94560', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {isFrozen   && <span>❄️ Congelado — no podés responder</span>}
          {isHidden   && <span>👁️ Opciones ocultas</span>}
          {isSticky   && <span>🦠 Sticky activo</span>}
          {isConfused && <span>🔀 Opciones mezcladas</span>}
        </div>
      )}

      {myDefense === 'bombita' && canAnswer && (
        <button onClick={onUseBombita} style={{ width: '100%', background: '#e8a838', color: '#000', fontSize: 13, padding: '8px', marginBottom: 8 }}>
          💣 Usar Bombita
        </button>
      )}

      <PlayerStatusPanel players={room?.players} answeredPlayers={answeredPlayers} activeEffects={activeEffects} myId={myId} />
    </div>
  );
}
