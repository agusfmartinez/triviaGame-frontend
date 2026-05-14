const ATTACK_LABELS = {
  freeze: '❄️ congeló',
  sticky: '🦠 sticky a',
  confuse: '🔀 confundió',
  hide: '👁️ ocultó a',
};

export default function AttackLog({ attackLog = [] }) {
  if (!attackLog.length) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      {attackLog.map((entry, i) => {
        let text, color;
        if (entry.blocked) {
          text = `🛡️ ${entry.attackerNickname} atacó a ${entry.targetNickname} — ¡bloqueado por escudo!`;
          color = '#4CAF50';
        } else if (entry.wasted) {
          text = `💨 ${entry.attackerNickname} perdió su ataque contra ${entry.targetNickname}`;
          color = '#666';
        } else {
          text = `${entry.attackerNickname} ${ATTACK_LABELS[entry.type] || 'atacó a'} ${entry.targetNickname}`;
          color = '#e8a838';
        }

        return (
          <div
            key={i}
            style={{
              padding: '5px 10px',
              marginBottom: 4,
              borderRadius: 6,
              fontSize: 12,
              background: '#1a1a2e',
              border: `1px solid ${color}33`,
              color,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}
