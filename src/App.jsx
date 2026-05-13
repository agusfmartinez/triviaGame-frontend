import { useState, useEffect } from 'react';
import { socket } from './socket/socket';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

export default function App() {
  const [page, setPage] = useState('home');
  const [room, setRoom] = useState(null);
  const [myId, setMyId] = useState(null);
  const [error, setError] = useState('');
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (socket.connected) setMyId(socket.id);

    socket.on('connect', () => setMyId(socket.id));

    socket.on('room_created', ({ room }) => {
      setError('');
      setRoom(room);
      setPage('lobby');
    });

    socket.on('room_joined', ({ room }) => {
      setError('');
      setRoom(room);
      setPage('lobby');
    });

    socket.on('room_updated', ({ room }) => setRoom(room));

    socket.on('game_started', ({ room }) => {
      setRoom(room);
      setGame(null);
      setPage('game');
    });

    socket.on('phase_changed', (data) => {
      setGame({ ...data, answeredCount: 0, timeLeft: data.timeLimit || 0 });
    });

    socket.on('timer_tick', ({ timeLeft }) => {
      setGame(prev => prev ? { ...prev, timeLeft } : prev);
    });

    socket.on('vote_update', ({ votes }) => {
      setGame(prev => prev ? { ...prev, votes } : prev);
    });

    socket.on('answer_submitted', ({ count }) => {
      setGame(prev => prev ? { ...prev, answeredCount: count } : prev);
    });

    socket.on('error', ({ message }) => setError(message));

    return () => {
      socket.off('connect');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('room_updated');
      socket.off('game_started');
      socket.off('phase_changed');
      socket.off('timer_tick');
      socket.off('vote_update');
      socket.off('answer_submitted');
      socket.off('error');
    };
  }, []);

  function handleVote(categoryIndex) {
    socket.emit('vote_category', { code: room.code, categoryIndex });
    setGame(prev => prev ? { ...prev, myVote: categoryIndex } : prev);
  }

  function handleAnswer(answerIndex) {
    socket.emit('submit_answer', { code: room.code, answerIndex });
    setGame(prev => prev ? { ...prev, myAnswer: answerIndex } : prev);
  }

  function handleGoHome() {
    setPage('home');
    setRoom(null);
    setGame(null);
    setError('');
  }

  if (page === 'game') {
    return (
      <Game
        game={game}
        room={room}
        myId={myId}
        onVote={handleVote}
        onAnswer={handleAnswer}
        onGoHome={handleGoHome}
      />
    );
  }

  if (page === 'lobby' && room) {
    return (
      <Lobby
        room={room}
        myId={myId}
        error={error}
        onClearError={() => setError('')}
      />
    );
  }

  return <Home error={error} onClearError={() => setError('')} />;
}
