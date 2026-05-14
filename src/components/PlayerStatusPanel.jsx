const EFFECT_ICONS = { freeze: '❄️', sticky: '🦠', hide: '👁️', confuse: '🔀' };

export default function PlayerStatusPanel({ players = [], answeredPlayers = [], activeEffects = {}, myId }) {
  const answeredSet = new Set(answeredPlayers);

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
      {players.map(p => {
        const answered = answeredSet.has(p.id);
        const isMe = p.id === myId;
        const effects = activeEffects[p.id] || [];
        const effectStr = effects.map(e => EFFECT_ICONS[e] || '').join('');

        return (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              background: answered ? '#1a3a1a' : '#16213e',
              border: `1px solid ${answered ? '#4CAF50' : isMe ? '#e94560' : '#333'}`,
              color: answered ? '#4CAF50' : '#aaa',
              transition: 'all 0.3s',
            }}
          >
            <span>{answered ? '✅' : '⏳'}{effectStr}</span>
            <span style={{ fontWeight: isMe ? 'bold' : 'normal' }}>{p.nickname}</span>
          </div>
        );
      })}
    </div>
  );
}
