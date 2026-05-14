import PowerupSelector from './PowerupSelector';

const medals = ['🥇', '🥈', '🥉'];

export default function Scoreboard({ game, room, myId, onReadyNext, onUseAttack }) {
  const {
    scoreboard = [], currentRound, totalRounds, isEndOfRound, isLast,
    timeLeft, readyCount = 0, totalPlayers = 0, myReady,
    availableAttacks = [], defenses = {}, myAttackUsed,
  } = game;

  const myDefense = defenses[myId] || null;

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Scoreboard</h2>
        <span style={{ color: '#aaa', fontSize: 13 }}>
          {isLast ? 'Ronda final' : `Ronda ${currentRound}/${totalRounds}`}
        </span>
      </div>

      {scoreboard.map((p, i) => {
        const isMe = p.id === myId;
        return (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              marginBottom: 8,
              borderRadius: 10,
              background: isMe ? '#1e1e3a' : '#16213e',
              border: `2px solid ${isMe ? '#e94560' : 'transparent'}`,
            }}
          >
            <span style={{ fontSize: 22, width: 32, textAlign: 'center' }}>
              {medals[i] || `#${i + 1}`}
            </span>
            <span style={{ flex: 1, fontWeight: isMe ? 'bold' : 'normal' }}>
              {p.nickname}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: 18 }}>
              {p.score.toLocaleString()} pts
            </span>
          </div>
        );
      })}

      <PowerupSelector
        players={room?.players}
        myId={myId}
        availableAttacks={availableAttacks}
        myDefense={myDefense}
        myAttackUsed={myAttackUsed}
        onUseAttack={(targetId, type) => {
          if (onUseAttack) onUseAttack(targetId, type);
        }}
      />

      <div style={{ marginTop: 16 }}>
        <button
          onClick={onReadyNext}
          disabled={!!myReady}
          style={{
            width: '100%',
            fontSize: 18,
            padding: 16,
            background: myReady ? '#333' : '#e94560',
          }}
        >
          {myReady ? '✓ Listo' : isLast ? 'Ver resultado final' : isEndOfRound ? 'Siguiente ronda →' : 'Siguiente pregunta →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#aaa' }}>
          {readyCount}/{totalPlayers} listos · auto en {timeLeft}s
        </div>
      </div>
    </div>
  );
}
