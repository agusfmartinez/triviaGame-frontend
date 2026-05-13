import CategoryVote from '../components/CategoryVote';
import QuestionActive from '../components/QuestionActive';
import QuestionResult from '../components/QuestionResult';
import GameOver from '../components/GameOver';

export default function Game({ game, room, myId, onVote, onAnswer, onGoHome }) {
  if (!game) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
        <p style={{ color: '#aaa' }}>Iniciando partida...</p>
      </div>
    );
  }

  const props = { game, room, myId };

  switch (game.phase) {
    case 'CATEGORY_VOTE':
      return <CategoryVote {...props} onVote={onVote} />;
    case 'QUESTION_ACTIVE':
      return <QuestionActive {...props} onAnswer={onAnswer} />;
    case 'QUESTION_RESULT':
      return <QuestionResult {...props} />;
    case 'GAME_OVER':
      return <GameOver {...props} onGoHome={onGoHome} />;
    default:
      return null;
  }
}
