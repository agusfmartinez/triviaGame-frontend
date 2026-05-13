import { socket } from '../socket/socket';
import PlayerList from '../components/PlayerList';

export default function Lobby({ room, myId, error, onClearError }) {
  const isHost = room.hostId === myId;

  function handleStart() {
    onClearError();
    socket.emit('start_game', { code: room.code });
  }

  function handleLeave() {
    socket.emit('leave_room');
  }

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <p style={{ textAlign: 'center', color: '#aaa', marginBottom: 4 }}>Código de sala</p>
      <div
        style={{
          textAlign: 'center',
          fontSize: 52,
          fontWeight: 'bold',
          letterSpacing: 12,
          color: '#e94560',
          marginBottom: 4,
        }}
      >
        {room.code}
      </div>
      <p style={{ textAlign: 'center', color: '#555', fontSize: 13, marginBottom: 32 }}>
        Compartí este código con tus amigos
      </p>

      {error && (
        <p style={{ color: '#ff5555', textAlign: 'center', marginBottom: 16, background: '#2a1a1a', padding: 10, borderRadius: 8 }}>
          {error}
        </p>
      )}

      <PlayerList players={room.players} myId={myId} />

      <div style={{ marginTop: 32 }}>
        <button
          onClick={handleLeave}
          style={{ width: '100%', background: '#333', marginBottom: 12 }}
        >
          ← Salir de la sala
        </button>

        {isHost ? (
          <>
            {room.players.length < 2 && (
              <p style={{ textAlign: 'center', color: '#aaa', marginBottom: 12, fontSize: 14 }}>
                Esperando más jugadores...
              </p>
            )}
            <button
              onClick={handleStart}
              disabled={room.players.length < 2}
              style={{ width: '100%', fontSize: 18, padding: 16 }}
            >
              ¡Iniciar partida!
            </button>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#aaa' }}>
            Esperando que el host inicie la partida...
          </p>
        )}
      </div>
    </div>
  );
}
