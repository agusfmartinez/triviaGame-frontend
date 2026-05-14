import { STATES } from '../game/states';
import { socket } from '../socket/socket';
import CategoryVote from '../components/CategoryVote';
import QuestionIntro from '../components/QuestionIntro';
import QuestionActive from '../components/QuestionActive';
import QuestionResult from '../components/QuestionResult';
import Scoreboard from '../components/Scoreboard';
import PyramidIntro from '../components/PyramidIntro';
import FinalPyramid from '../components/FinalPyramid';
import PyramidResult from '../components/PyramidResult';
import PyramidScoreboard from '../components/PyramidScoreboard';
import GameOver from '../components/GameOver';

const IS_DEV = import.meta.env.DEV;

export default function Game({ game, room, myId, rematch, onVote, onAnswer, onReadyNext, onUseAttack, onUseBombita, onVoteStartPyramid, onReadyPyramid, onVoteRematch, onGoHome }) {
  if (!game) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
        <p style={{ color: '#aaa' }}>Iniciando partida...</p>
      </div>
    );
  }

  function handleSkip() {
    socket.emit('dev_skip', { code: room.code });
  }

  const props = { game, room, myId };

  let content;
  switch (game.phase) {
    case STATES.CATEGORY_VOTE:
      content = <CategoryVote {...props} onVote={onVote} />; break;
    case STATES.QUESTION_INTRO:
      content = <QuestionIntro {...props} />; break;
    case STATES.QUESTION_ACTIVE:
      content = <QuestionActive {...props} onAnswer={onAnswer} onUseBombita={onUseBombita} />; break;
    case STATES.QUESTION_RESULT:
      content = <QuestionResult {...props} />; break;
    case STATES.SCOREBOARD:
      content = <Scoreboard {...props} onReadyNext={onReadyNext} onUseAttack={onUseAttack} />; break;
    case STATES.PYRAMID_INTRO:
      content = <PyramidIntro {...props} onVoteStart={onVoteStartPyramid} />; break;
    case STATES.FINAL_PYRAMID:
      content = <FinalPyramid {...props} onAnswer={onAnswer} onUseBombita={onUseBombita} />; break;
    case STATES.PYRAMID_RESULT:
      content = <PyramidResult {...props} />; break;
    case STATES.PYRAMID_SCOREBOARD:
      content = <PyramidScoreboard {...props} onReadyPyramid={onReadyPyramid} onUseAttack={onUseAttack} />; break;
    case STATES.GAME_OVER:
      content = <GameOver {...props} rematch={rematch} onVoteRematch={onVoteRematch} onGoHome={onGoHome} />; break;
    default:
      content = null;
  }

  const showSkip = IS_DEV && game.phase !== STATES.GAME_OVER;

  return (
    <>
      {content}
      {showSkip && (
        <button
          onClick={handleSkip}
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: '#ff9800',
            color: '#000',
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 6,
            opacity: 0.8,
            zIndex: 9999,
          }}
        >
          ⏭ DEV SKIP
        </button>
      )}
    </>
  );
}
