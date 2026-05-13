const OPTION_COLORS = ['#e94560', '#0f3460', '#533483', '#e8a838'];

export default function QuestionResult({ game, myId }) {
  const {
    question,
    options = [],
    correctIndex,
    playerAnswers = {},
    scoreboard = [],
    questionNumber,
    totalQuestions,
    timeLeft,
  } = game;

  const myResult = playerAnswers[myId];

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: '#aaa' }}>
        <span>Pregunta {questionNumber}/{totalQuestions}</span>
        <span style={{ color: timeLeft <= 2 ? '#e94560' : '#aaa' }}>Siguiente en {timeLeft}s</span>
      </div>

      {myResult && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: myResult.correct ? '#1a3a1a' : '#3a1a1a',
          border: `2px solid ${myResult.correct ? '#4CAF50' : '#e94560'}`,
          marginBottom: 16,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 18,
        }}>
          {myResult.correct ? `✓ ¡Correcto! +${myResult.points} pts` : '✗ Incorrecto'}
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

      <h3 style={{ marginBottom: 10, color: '#aaa', fontWeight: 'normal' }}>Scoreboard</h3>
      {scoreboard.map((p, i) => (
        <div
          key={p.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 12px',
            marginBottom: 6,
            borderRadius: 8,
            background: p.id === myId ? '#1e1e3a' : '#16213e',
            border: p.id === myId ? '1px solid #e94560' : '1px solid transparent',
          }}
        >
          <span>
            <span style={{ color: '#aaa', marginRight: 8 }}>#{i + 1}</span>
            {p.nickname}
          </span>
          <span style={{ fontWeight: 'bold' }}>{p.score.toLocaleString()} pts</span>
        </div>
      ))}
    </div>
  );
}
