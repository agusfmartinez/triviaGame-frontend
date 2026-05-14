import { useState, useEffect } from 'react';
import { socket } from './socket/socket';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

const REMATCH_INITIAL = { count: 0, totalPlayers: 0, timerStarted: false, timeLimit: 30, myVoted: false };

export default function App() {
  const [page, setPage] = useState('home');
  const [room, setRoom] = useState(null);
  const [myId, setMyId] = useState(null);
  const [error, setError] = useState('');
  const [game, setGame] = useState(null);
  const [rematch, setRematch] = useState(REMATCH_INITIAL);

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
      setRematch(REMATCH_INITIAL);
      setPage('game');
    });

    socket.on('pyramid_intro_update', ({ readyCount, totalPlayers }) => {
      setGame(prev => prev ? { ...prev, readyCount, totalPlayers } : prev);
    });

    socket.on('pyramid_ready_update', ({ readyCount, totalPlayers }) => {
      setGame(prev => prev ? { ...prev, readyCount, totalPlayers } : prev);
    });

    socket.on('phase_changed', (data) => {
      setGame({ ...data, answeredCount: 0, timeLeft: data.timeLimit || 0 });
      if (data.phase === 'GAME_OVER') setRematch(REMATCH_INITIAL);
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

    socket.on('ready_update', ({ readyCount, totalPlayers }) => {
      setGame(prev => prev ? { ...prev, readyCount, totalPlayers } : prev);
    });

    socket.on('rematch_update', ({ count, totalPlayers }) => {
      setRematch(prev => ({ ...prev, count, totalPlayers }));
    });

    socket.on('rematch_timer_started', ({ timeLimit }) => {
      setRematch(prev => ({ ...prev, timerStarted: true, timeLimit }));
    });

    socket.on('rematch_start', ({ room }) => {
      setRoom(room);
      setGame(null);
      setRematch(REMATCH_INITIAL);
      setPage('lobby');
    });

    socket.on('go_home', () => {
      setPage('home');
      setRoom(null);
      setGame(null);
      setRematch(REMATCH_INITIAL);
    });

    socket.on('left_room', () => {
      setPage('home');
      setRoom(null);
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
      socket.off('ready_update');
      socket.off('pyramid_intro_update');
      socket.off('pyramid_ready_update');
      socket.off('rematch_update');
      socket.off('rematch_timer_started');
      socket.off('rematch_start');
      socket.off('go_home');
      socket.off('left_room');
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

  function handleReadyNext() {
    socket.emit('ready_next', { code: room.code });
    setGame(prev => prev ? { ...prev, myReady: true } : prev);
  }

  function handleVoteStartPyramid() {
    socket.emit('vote_start_pyramid', { code: room.code });
    setGame(prev => prev ? { ...prev, myVotedStart: true } : prev);
  }

  function handleReadyPyramid() {
    socket.emit('ready_pyramid', { code: room.code });
    setGame(prev => prev ? { ...prev, myReadyPyramid: true } : prev);
  }

  function handleVoteRematch() {
    socket.emit('vote_rematch', { code: room.code });
    setRematch(prev => ({ ...prev, myVoted: true }));
  }

  function handleGoHome() {
    setPage('home');
    setRoom(null);
    setGame(null);
    setRematch(REMATCH_INITIAL);
    setError('');
  }

  if (page === 'game') {
    return (
      <Game
        game={game}
        room={room}
        myId={myId}
        rematch={rematch}
        onVote={handleVote}
        onAnswer={handleAnswer}
        onReadyNext={handleReadyNext}
        onVoteStartPyramid={handleVoteStartPyramid}
        onReadyPyramid={handleReadyPyramid}
        onVoteRematch={handleVoteRematch}
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
