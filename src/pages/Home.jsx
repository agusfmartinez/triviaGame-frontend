import { useState } from 'react';
import { socket } from '../socket/socket';

export default function Home({ error, onClearError }) {
  const [mode, setMode] = useState(null);
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');

  function handleCreate(e) {
    e.preventDefault();
    if (!nickname.trim()) return;
    onClearError();
    socket.emit('create_room', { nickname: nickname.trim() });
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!nickname.trim() || code.length !== 4) return;
    onClearError();
    socket.emit('join_room', { code: code.trim().toUpperCase(), nickname: nickname.trim() });
  }

  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 8, fontSize: 36 }}>🎮 Trivia Party</h1>
      <p style={{ textAlign: 'center', color: '#aaa', marginBottom: 40 }}>Multijugador en tiempo real</p>

      {error && (
        <p style={{ color: '#ff5555', textAlign: 'center', marginBottom: 16, background: '#2a1a1a', padding: 10, borderRadius: 8 }}>
          {error}
        </p>
      )}

      {!mode && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => setMode('create')}>Crear sala</button>
          <button onClick={() => setMode('join')} style={{ background: '#0f3460' }}>
            Unirse a sala
          </button>
        </div>
      )}

      {mode === 'create' && (
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ marginBottom: 4 }}>Nueva sala</h2>
          <input
            placeholder="Tu nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <button type="submit" disabled={!nickname.trim()}>Crear</button>
          <button type="button" onClick={() => setMode(null)} style={{ background: '#333' }}>
            Volver
          </button>
        </form>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ marginBottom: 4 }}>Unirse a sala</h2>
          <input
            placeholder="Código de sala (ej: AB3X)"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            maxLength={4}
            autoFocus
            style={{ letterSpacing: 6, textAlign: 'center', fontSize: 20 }}
          />
          <input
            placeholder="Tu nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
          />
          <button type="submit" disabled={!nickname.trim() || code.length !== 4}>
            Unirse
          </button>
          <button type="button" onClick={() => setMode(null)} style={{ background: '#333' }}>
            Volver
          </button>
        </form>
      )}
    </div>
  );
}
