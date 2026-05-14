function PyramidStep({ step, pyramidHeight, players, isTop }) {
  const displayStep = pyramidHeight - step + 1;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '5px 10px',
      borderRadius: 6,
      background: isTop ? '#1a3a1a' : '#16213e',
      border: `1px solid ${isTop ? '#e8a838' : '#222'}`,
      minHeight: 34,
    }}>
      <span style={{ fontSize: 11, color: isTop ? '#e8a838' : '#555', minWidth: 52, textAlign: 'right' }}>
        {isTop ? '👑 Esc.1' : `Esc. ${displayStep}`}
      </span>
      <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {players.map(p => (
          <span key={p.id} style={{
            background: '#e94560',
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 13,
            fontWeight: 'bold',
          }}>
            {p.nickname}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PyramidIntro({ game, myId, onVoteStart }) {
  const { positions = {}, pyramidHeight, readyCount = 0, totalPlayers = 0, timeLeft, myVotedStart } = game;

  const players = Object.entries(positions).map(([id, data]) => ({ id, ...data }));

  const steps = [];
  for (let s = pyramidHeight; s >= 1; s--) {
    steps.push({ step: s, players: players.filter(p => p.position === s) });
  }

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{ color: '#e8a838', fontWeight: 'bold', fontSize: 16 }}>🏆 RONDA FINAL — Pirámide</p>
        <p style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>
          Cima: escalón {pyramidHeight} · Posiciones iniciales según ranking
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
        {steps.map(({ step, players: here }) => (
          <PyramidStep
            key={step}
            step={step}
            pyramidHeight={pyramidHeight}
            players={here}
            isTop={step === pyramidHeight}
          />
        ))}
      </div>

      <button
        onClick={onVoteStart}
        disabled={!!myVotedStart}
        style={{
          width: '100%',
          fontSize: 18,
          padding: 16,
          background: myVotedStart ? '#333' : '#e8a838',
          color: myVotedStart ? '#aaa' : '#000',
        }}
      >
        {myVotedStart ? '✓ Listo para arrancar' : '🏆 ¡Arrancar pirámide!'}
      </button>

      {(readyCount > 0 || myVotedStart) && (
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#aaa' }}>
          {readyCount}/{totalPlayers} listos
          {readyCount > 0 && timeLeft > 0 && ` · arranca en ${timeLeft}s`}
        </p>
      )}
    </div>
  );
}
