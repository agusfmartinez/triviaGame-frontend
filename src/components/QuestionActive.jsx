const OPTION_COLORS = ['#e94560', '#0f3460', '#533483', '#e8a838'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionActive({ game, room, myId, onAnswer }) {
  const {
    question,
    options = [],
    timeLeft,
    timeLimit,
    questionNumber,
    totalQuestions,
    myAnswer,
    answeredCount = 0,
  } = game;

  const totalPlayers = room?.players?.length || 0;
  const pct = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 0;

  function handleAnswer(idx) {
    if (myAnswer !== undefined && myAnswer !== null) return;
    onAnswer(idx);
  }

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#aaa' }}>
          <span>Pregunta {questionNumber}/{totalQuestions}</span>
          <span>{answeredCount}/{totalPlayers} respondieron</span>
        </div>
        <div style={{ height: 6, background: '#333', borderRadius: 3 }}>
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: timeLeft <= 5 ? '#e94560' : '#4CAF50',
              borderRadius: 3,
              transition: 'width 1s linear',
            }}
          />
        </div>
        <div style={{ textAlign: 'right', marginTop: 4, fontSize: 13, color: timeLeft <= 5 ? '#e94560' : '#aaa' }}>
          {timeLeft}s
        </div>
      </div>

      <h2 style={{ marginBottom: 24, lineHeight: 1.4, fontSize: 20 }}>{question}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt, idx) => {
          const isMyAnswer = myAnswer === idx;
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={myAnswer !== undefined && myAnswer !== null}
              style={{
                background: OPTION_COLORS[idx],
                opacity: (myAnswer !== undefined && myAnswer !== null && !isMyAnswer) ? 0.4 : 1,
                border: isMyAnswer ? '3px solid white' : '3px solid transparent',
                borderRadius: 10,
                padding: '14px 16px',
                textAlign: 'left',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: (myAnswer !== undefined && myAnswer !== null) ? 'default' : 'pointer',
              }}
            >
              <span style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                {isMyAnswer ? '✓' : OPTION_LABELS[idx]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
