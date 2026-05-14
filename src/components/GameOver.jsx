import { useState, useEffect } from 'react';

const medals = ['🥇', '🥈', '🥉'];

export default function GameOver({ game, myId, rematch, onVoteRematch, onGoHome }) {
  const { scoreboard = [], winner, fromPyramid } = game;
  const { count, totalPlayers, timerStarted, timeLimit, myVoted } = rematch;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!timerStarted) return;
    setTimeLeft(timeLimit);
    const interval = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStarted, timeLimit]);

  return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <h1 style={{ marginBottom: 8 }}>¡Juego terminado!</h1>

      {winner && (
        <p style={{ color: '#e8a838', fontSize: 20, marginBottom: 32 }}>
          {fromPyramid ? `🏆 ¡${winner.nickname} conquistó la pirámide!` : `🏆 Ganó ${winner.nickname} con ${(winner.score || 0).toLocaleString()} pts`}
        </p>
      )}

      <div style={{ marginBottom: 32 }}>
        {scoreboard.map((p, i) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              marginBottom: 8,
              borderRadius: 10,
              background: p.id === myId ? '#1e1e3a' : '#16213e',
              border: p.id === myId ? '2px solid #e94560' : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: 20 }}>{medals[i] || `#${i + 1}`}</span>
            <span style={{ flex: 1, textAlign: 'left', marginLeft: 12, fontWeight: p.id === myId ? 'bold' : 'normal' }}>
              {p.nickname}
            </span>
            {!fromPyramid && (
              <span style={{ fontWeight: 'bold', fontSize: 18 }}>
                {(p.score || 0).toLocaleString()} pts
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onVoteRematch}
          disabled={myVoted}
          style={{
            width: '100%',
            fontSize: 18,
            padding: 16,
            background: myVoted ? '#333' : '#4CAF50',
          }}
        >
          {myVoted ? '✓ Votaste volver a jugar' : '🔄 Volver a jugar'}
        </button>

        {(timerStarted || count > 0) && (
          <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
            {count}/{totalPlayers} quieren jugar de nuevo
            {timerStarted && ` · empieza en ${timeLeft}s`}
          </p>
        )}

        <button
          onClick={onGoHome}
          style={{ width: '100%', background: '#333', fontSize: 16 }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
