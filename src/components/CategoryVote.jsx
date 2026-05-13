const COLORS = ['#e94560', '#0f3460', '#533483', '#e8a838'];

export default function CategoryVote({ game, room, myId, onVote }) {
  const { categories = [], votes = [0, 0, 0, 0], timeLeft, myVote, currentRound, totalRounds } = game;
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  function handleVote(idx) {
    if (myVote !== undefined && myVote !== null) return;
    onVote(idx);
  }

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ color: '#aaa', marginBottom: 2, fontSize: 13 }}>
          Ronda {currentRound}/{totalRounds} · Votación de categoría
        </p>
        <div style={{ fontSize: 48, fontWeight: 'bold', color: timeLeft <= 5 ? '#e94560' : '#eee' }}>
          {timeLeft}s
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {categories.map((cat, idx) => {
          const voteCount = votes[idx] || 0;
          const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isMyVote = myVote === idx;

          return (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              disabled={myVote !== undefined && myVote !== null}
              style={{
                background: COLORS[idx],
                opacity: (myVote !== undefined && myVote !== null && !isMyVote) ? 0.5 : 1,
                border: isMyVote ? '3px solid white' : '3px solid transparent',
                borderRadius: 10,
                padding: '14px 16px',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                cursor: (myVote !== undefined && myVote !== null) ? 'default' : 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${pct}%`,
                  background: 'rgba(255,255,255,0.15)',
                  transition: 'width 0.3s',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <span style={{ fontWeight: 'bold', fontSize: 18 }}>
                  {isMyVote ? '✓ ' : ''}{cat}
                </span>
                <span style={{ fontSize: 14, opacity: 0.9 }}>
                  {voteCount} {voteCount === 1 ? 'voto' : 'votos'} ({pct}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {myVote === null || myVote === undefined ? (
        <p style={{ textAlign: 'center', color: '#aaa', marginTop: 16, fontSize: 14 }}>
          Elegí una categoría
        </p>
      ) : (
        <p style={{ textAlign: 'center', color: '#aaa', marginTop: 16, fontSize: 14 }}>
          Voto registrado. Esperando resultados...
        </p>
      )}
    </div>
  );
}
