import AttackLog from './AttackLog';

const OPTION_COLORS = ['#e94560', '#0f3460', '#533483', '#e8a838'];

export default function QuestionResult({ game, myId }) {
  const {
    options = [],
    correctIndex,
    playerAnswers = {},
    questionNumber,
    totalQuestions,
    timeLeft,
    attackLog = [],
  } = game;

  const myResult = playerAnswers[myId];
  const players = Object.entries(playerAnswers).sort((a, b) => b[1].points - a[1].points);

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: '#aaa' }}>
        <span>Pregunta {questionNumber}/{totalQuestions}</span>
        <span style={{ color: timeLeft <= 2 ? '#e94560' : '#aaa' }}>Scoreboard en {timeLeft}s</span>
      </div>

      {myResult && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: myResult.correct ? '#1a3a1a' : '#3a1a1a',
          border: `2px solid ${myResult.correct ? '#4CAF50' : '#e94560'}`,
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>
            {myResult.correct ? `✓ ¡Correcto! +${myResult.points} pts` : '✗ Incorrecto'}
          </div>
          <div style={{ fontSize: 13, color: '#aaa' }}>
            {myResult.timeSpent !== null ? `Respondiste en ${myResult.timeSpent}s` : 'No respondiste'}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        {options.map((opt, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px 16px',
              marginBottom: 8,
              borderRadius: 10,
              background: idx === correctIndex ? '#1a3a1a' : '#111',
              border: `2px solid ${idx === correctIndex ? '#4CAF50' : '#333'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: idx === correctIndex ? '#4CAF50' : '#aaa' }}>
              {idx === correctIndex ? '✓ ' : ''}{opt}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {Object.values(playerAnswers)
                .filter(p => p.answerIndex === idx)
                .map(p => (
                  <span
                    key={p.nickname}
                    title={p.nickname}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: OPTION_COLORS[idx],
                      display: 'inline-block',
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <AttackLog attackLog={attackLog} />

      <h3 style={{ marginBottom: 10, color: '#aaa', fontWeight: 'normal' }}>Esta pregunta</h3>
      {players.map(([id, p]) => (
        <div
          key={id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            marginBottom: 6,
            borderRadius: 8,
            background: id === myId ? '#1e1e3a' : '#16213e',
            border: `1px solid ${id === myId ? '#e94560' : 'transparent'}`,
          }}
        >
          <span style={{ fontWeight: id === myId ? 'bold' : 'normal' }}>{p.nickname}</span>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, alignItems: 'center' }}>
            {p.timeSpent !== null ? (
              <span style={{ color: '#aaa' }}>{p.timeSpent}s</span>
            ) : (
              <span style={{ color: '#555' }}>—</span>
            )}
            <span style={{
              fontWeight: 'bold',
              color: p.correct ? '#4CAF50' : p.timeSpent !== null ? '#e94560' : '#555',
            }}>
              {p.points > 0 ? `+${p.points}` : p.timeSpent !== null ? '0' : 'no respondió'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
