import { useEffect, useState, useRef } from 'react';
import { Avatar, ChunkyButton } from '../design/ui';
import { PALETTE } from '../design/theme';
import { playSound } from '../design/sounds';
import { emitFeedback } from '../design/feedback';

const medals = ['🥇', '🥈', '🥉'];
const podiumColors = [PALETTE.accent, '#C0C0C0', '#CD7F32'];

export default function GameOver({ game, myId, rematch, onVoteRematch, onGoHome }) {
  const { scoreboard = [], winner, fromPyramid } = game;
  const { count = 0, totalPlayers = 0, timerStarted, timeLimit, myVoted } = rematch || {};
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!timerStarted) return;
    setTimeLeft(timeLimit);
    const i = setInterval(() => setTimeLeft(t => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(i);
  }, [timerStarted, timeLimit]);

  // Trigger win confetti + sound on mount
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const iWon = winner && winner.id === myId;
    if (iWon) emitFeedback('confetti');
    playSound(iWon ? 'win' : 'lose');
  }, []);

  // Podium reorder: 1st in center, 2nd left, 3rd right
  const top3 = scoreboard.slice(0, 3);
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

  function handleRematch() {
    if (myVoted) return;
    playSound('pop');
    onVoteRematch();
  }

  function handleHome() {
    playSound('tap');
    onGoHome();
  }

  return (
    <div className="tz-container">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
          letterSpacing: 3, color: PALETTE.textDim, textTransform: 'uppercase',
        }}>Partida terminada</div>
        {winner && (
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
            color: PALETTE.accent, marginTop: 4, letterSpacing: -1,
            textShadow: `0 4px 0 ${PALETTE.primaryDark}`,
            animation: 'logoBounce 2s ease-in-out infinite',
          }}>🏆 {fromPyramid ? `${winner.nickname} CONQUISTÓ LA PIRÁMIDE` : `GANÓ ${winner.nickname}`}</div>
        )}
      </div>

      {/* Podium */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10,
        marginTop: 10,
      }}>
        {podium.map(p => {
          if (!p) return null;
          const place = scoreboard.findIndex(s => s.id === p.id) + 1;
          const height = place === 1 ? 120 : place === 2 ? 85 : 65;
          const delay = (place - 1) * 0.2;
          return (
            <PodiumStep key={p.id} player={p} place={place} height={height}
              delay={delay} isMe={p.id === myId} fromPyramid={fromPyramid} />
          );
        })}
      </div>

      {/* Full ranking */}
      {scoreboard.length > 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {scoreboard.slice(3).map((p, i) => (
            <div key={p.id} style={{
              background: p.id === myId ? `${PALETTE.primary}22` : PALETTE.surface,
              border: `1.5px solid ${p.id === myId ? PALETTE.primary : 'transparent'}`,
              borderRadius: 12, padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                color: PALETTE.textDim, minWidth: 26, textAlign: 'center',
              }}>#{i + 4}</span>
              <Avatar nickname={p.nickname} size={28} />
              <span style={{
                flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                color: PALETTE.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                minWidth: 0,
              }}>{p.nickname}</span>
              {!fromPyramid && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                  color: PALETTE.accent,
                }}>{(p.score || 0).toLocaleString()}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 8 }} />

      {/* Rematch panel */}
      <div style={{
        background: PALETTE.surfaceSolid, border: `2px solid ${PALETTE.border}`,
        borderRadius: 20, padding: 14,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: PALETTE.text,
          textAlign: 'center', marginBottom: 4,
        }}>¿Otra ronda?</div>
        {(timerStarted || count > 0) && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12, color: PALETTE.textDim,
            textAlign: 'center', marginBottom: 10, fontWeight: 600,
          }}>{count}/{totalPlayers} votaron{timerStarted ? ` · ${timeLeft}s` : ''}</div>
        )}
        {(timerStarted || count > 0) && (
          <div style={{
            height: 6, background: PALETTE.bg0, borderRadius: 3, overflow: 'hidden', marginBottom: 12,
          }}>
            <div style={{
              width: totalPlayers > 0 ? `${(count / totalPlayers) * 100}%` : '0%',
              height: '100%', background: PALETTE.accent,
              transition: 'width .4s',
            }} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <ChunkyButton color={PALETTE.bg2} shadow="rgba(0,0,0,0.4)" textColor={PALETTE.textDim}
            onClick={handleHome} style={{ flex: 1, fontSize: 13, padding: '12px 8px' }}>
            🏠 Salir
          </ChunkyButton>
          <ChunkyButton color={myVoted ? PALETTE.success : PALETTE.primary}
            shadow={myVoted ? PALETTE.successDark : PALETTE.primaryDark}
            disabled={!!myVoted} onClick={handleRematch}
            style={{ flex: 1.4, fontSize: 13, padding: '12px 8px' }}>
            {myVoted ? '✓ Votado' : '🔁 Revancha'}
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}

function PodiumStep({ player, place, height, delay, isMe, fromPyramid }) {
  const color = podiumColors[place - 1];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1, maxWidth: 100 }}>
      <div style={{
        fontSize: 30, animation: `popIn .6s ${delay}s backwards`,
        filter: place === 1 ? `drop-shadow(0 0 14px ${PALETTE.accent})` : 'none',
      }}>{medals[place - 1]}</div>
      <Avatar nickname={player.nickname} size={place === 1 ? 50 : 40} ring={color} />
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
        color: isMe ? PALETTE.primary : PALETTE.text,
        maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{player.nickname}</div>
      {!fromPyramid && (
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
          color: PALETTE.textDim,
        }}>{(player.score || 0).toLocaleString()} pts</div>
      )}
      <div style={{
        width: '100%', height,
        background: `linear-gradient(180deg, ${color}, ${color}99)`,
        border: `2px solid rgba(0,0,0,0.25)`, borderRadius: 8,
        boxShadow: `0 4px 0 rgba(0,0,0,0.3), inset 0 -3px 0 rgba(0,0,0,0.2)`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4,
        fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: PALETTE.bg0,
        animation: `slideInUp .5s ${delay}s backwards`,
      }}>{place}°</div>
    </div>
  );
}
