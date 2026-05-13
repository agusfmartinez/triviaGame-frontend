export default function PlayerList({ players, myId }) {
  return (
    <div>
      <h3 style={{ marginBottom: 12, color: '#aaa', fontWeight: 'normal' }}>
        Jugadores ({players.length}/10)
      </h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {players.map(player => (
          <li
            key={player.id}
            style={{
              padding: '12px 16px',
              background: '#16213e',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${player.id === myId ? '#e94560' : '#222'}`,
            }}
          >
            <span style={{ fontWeight: player.id === myId ? 'bold' : 'normal' }}>
              {player.nickname}
            </span>
            <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
              {player.isHost && <span style={{ color: '#f5a623' }}>👑 Host</span>}
              {player.id === myId && <span style={{ color: '#e94560' }}>Tú</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
