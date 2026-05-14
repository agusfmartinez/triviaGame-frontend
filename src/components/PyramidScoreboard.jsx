function PyramidStep({ step, pyramidHeight, players, myId }) {
  const isTop = step === pyramidHeight;
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
      minHeight: 32,
    }}>
      <span style={{ fontSize: 11, color: isTop ? '#e8a838' : '#555', minWidth: 52, textAlign: 'right' }}>
        {isTop ? '👑 Esc.1' : `Esc. ${displayStep}`}
      </span>
      <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {players.map(p => (
          <span key={p.id} style={{
            background: p.id === myId ? '#e94560' : '#333',
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 13,
            fontWeight: p.id === myId ? 'bold' : 'normal',
          }}>
            {p.nickname}
          </span>
        ))}
      </div>
    </div>
  );
}

import PowerupSelector from './PowerupSelector';

export default function PyramidScoreboard({ game, room, myId, onReadyPyramid, onUseAttack }) {
  const {
    positions = {},
    pyramidHeight,
    questionNumber,
    readyCount = 0,
    totalPlayers = 0,
    timeLeft,
    availableAttacks = [],
    defenses = {},
    myAttackUsed,
    myReadyPyramid,
  } = game;

  const players = Object.entries(positions).map(([id, data]) => ({ id, ...data }));

  const steps = [];
  for (let s = pyramidHeight; s >= 1; s--) {
    steps.push({ step: s, players: players.filter(p => p.position === s) });
  }

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <p style={{ color: '#e8a838', fontWeight: 'bold', fontSize: 14 }}>🏆 Pirámide</p>
          <p style={{ color: '#aaa', fontSize: 12 }}>Tras pregunta {questionNumber}</p>
        </div>
        <span style={{ color: '#aaa', fontSize: 13 }}>{timeLeft}s</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 16 }}>
        {steps.map(({ step, players: here }) => (
          <PyramidStep
            key={step}
            step={step}
            pyramidHeight={pyramidHeight}
            players={here}
            myId={myId}
          />
        ))}
      </div>

      <PowerupSelector
        players={room?.players}
        myId={myId}
        availableAttacks={availableAttacks}
        myDefense={defenses[myId] || null}
        myAttackUsed={myAttackUsed}
        onUseAttack={(targetId, type) => { if (onUseAttack) onUseAttack(targetId, type); }}
      />

      <button
        onClick={onReadyPyramid}
        disabled={!!myReadyPyramid}
        style={{
          width: '100%',
          fontSize: 16,
          padding: 14,
          background: myReadyPyramid ? '#333' : '#e94560',
        }}
      >
        {myReadyPyramid ? '✓ Listo' : 'Siguiente pregunta →'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#aaa' }}>
        {readyCount}/{totalPlayers} listos · auto en {timeLeft}s
      </p>
    </div>
  );
}
