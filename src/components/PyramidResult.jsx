import AttackLog from './AttackLog';

export default function PyramidResult({ game, myId }) {
  const {
    movements = {},
    correctIndex,
    options = [],
    playerAnswers = {},
    questionNumber,
    winnerId,
    winnerNickname,
    timeLeft,
    attackLog = [],
  } = game;

  const myAnswer = playerAnswers[myId];
  const myMovement = movements[myId] ?? 0;

  const players = Object.entries(playerAnswers).sort((a, b) => {
    const ma = movements[a[0]] ?? 0;
    const mb = movements[b[0]] ?? 0;
    return mb - ma;
  });

  const movLabel = (mov) => mov > 0 ? '↑ +1' : mov < 0 ? '↓ -1' : '→ igual';
  const movColor = (mov) => mov > 0 ? '#4CAF50' : mov < 0 ? '#e94560' : '#aaa';

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <p style={{ color: '#e8a838', fontWeight: 'bold', fontSize: 14 }}>🏆 Pirámide · Resultado {questionNumber}</p>
      </div>

      {winnerId && (
        <div style={{
          padding: '14px',
          borderRadius: 10,
          background: '#1a3a1a',
          border: '2px solid #e8a838',
          textAlign: 'center',
          marginBottom: 14,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#e8a838',
        }}>
          🏆 ¡{winnerNickname} llegó a la cima y ganó!
        </div>
      )}

      {myAnswer && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: myAnswer.correct ? '#1a3a1a' : '#3a1a1a',
          border: `1px solid ${myAnswer.correct ? '#4CAF50' : '#e94560'}`,
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 15 }}>
            {myAnswer.correct ? '✓ Correcto' : myAnswer.answerIndex !== null ? '✗ Incorrecto' : '✗ No respondiste'}
          </span>
          <span style={{ fontWeight: 'bold', color: movColor(myMovement) }}>
            {movLabel(myMovement)}
          </span>
        </div>
      )}

      <div style={{
        padding: '10px 14px',
        borderRadius: 8,
        background: '#1a3a1a',
        border: '1px solid #4CAF50',
        marginBottom: 16,
        fontSize: 14,
        color: '#4CAF50',
      }}>
        ✓ Respuesta correcta: <strong>{options[correctIndex]}</strong>
      </div>

      <AttackLog attackLog={attackLog} />

      <div style={{ marginBottom: 12 }}>
        {players.map(([id, p]) => {
          const mov = movements[id] ?? 0;
          const isMe = id === myId;
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                marginBottom: 5,
                borderRadius: 8,
                background: isMe ? '#1e1e3a' : '#16213e',
                border: `1px solid ${isMe ? '#e94560' : '#222'}`,
              }}
            >
              <span style={{ fontWeight: isMe ? 'bold' : 'normal', fontSize: 14 }}>{p.nickname}</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: p.correct ? '#4CAF50' : p.answerIndex !== null ? '#e94560' : '#555' }}>
                  {p.correct ? '✓' : p.answerIndex !== null ? '✗' : '—'}
                </span>
                <span style={{ fontWeight: 'bold', color: movColor(mov), minWidth: 40, textAlign: 'right' }}>
                  {movLabel(mov)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!winnerId && (
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: 13 }}>
          Ver posiciones en {timeLeft}s...
        </p>
      )}
    </div>
  );
}
