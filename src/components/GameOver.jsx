export default function GameOver({ game, myId, onGoHome }) {
  const { scoreboard = [], winner } = game;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      <h1 style={{ marginBottom: 8 }}>¡Juego terminado!</h1>

      {winner && (
        <p style={{ color: '#e8a838', fontSize: 20, marginBottom: 32 }}>
          🏆 Ganó {winner.nickname} con {winner.score.toLocaleString()} pts
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
            <span style={{ fontSize: 20 }}>
              {medals[i] || `#${i + 1}`}
            </span>
            <span style={{ flex: 1, textAlign: 'left', marginLeft: 12, fontWeight: p.id === myId ? 'bold' : 'normal' }}>
              {p.nickname}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: 18 }}>
              {p.score.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>

      <button onClick={onGoHome} style={{ width: '100%' }}>
        Volver al inicio
      </button>
    </div>
  );
}
