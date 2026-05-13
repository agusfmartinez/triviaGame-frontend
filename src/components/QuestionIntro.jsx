export default function QuestionIntro({ game }) {
  const { questionNumber, totalQuestions, categoryName, question, timeLeft } = game;

  return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
      {categoryName && (
        <p style={{ color: '#aaa', marginBottom: 4, fontSize: 13 }}>
          Categoría: <strong style={{ color: '#eee' }}>{categoryName}</strong>
        </p>
      )}

      <p style={{ color: '#aaa', marginBottom: 24, fontSize: 13 }}>
        Pregunta {questionNumber} de {totalQuestions}
      </p>

      <h2 style={{ fontSize: 22, lineHeight: 1.4, marginBottom: 32, color: '#eee' }}>
        {question}
      </h2>

      <div style={{
        fontSize: 80,
        fontWeight: 'bold',
        color: '#e94560',
        lineHeight: 1,
        marginBottom: 16,
      }}>
        {timeLeft}
      </div>

      <p style={{ color: '#aaa', fontSize: 16 }}>¡Preparate!</p>
    </div>
  );
}
