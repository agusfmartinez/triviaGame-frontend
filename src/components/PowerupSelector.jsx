import { useState } from 'react';

const ATTACK_META = {
  freeze:  { label: '❄️ Congelar',  desc: 'No puede responder 3s' },
  sticky:  { label: '🦠 Sticky',    desc: 'Slime tapa la pantalla 3s' },
  confuse: { label: '🔀 Confusión', desc: 'Opciones se mezclan 3s' },
  hide:    { label: '👁️ Ocultar',   desc: 'Opciones invisibles 3s' },
};

const DEFENSE_META = {
  shield:  { label: '🛡️ Escudo',    desc: 'Bloquea 1 ataque entrante' },
  no_drop: { label: '📌 No bajar',  desc: 'No pierde escalón en pirámide' },
  bombita: { label: '💣 Bombita',   desc: 'Elimina 2 opciones incorrectas' },
};

export default function PowerupSelector({ players = [], myId, availableAttacks = [], myDefense, myAttackUsed, onUseAttack }) {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  if (!availableAttacks.length && !myDefense) return null;

  const otherPlayers = players.filter(p => p.id !== myId);

  function handleConfirm() {
    if (!selectedTarget || !selectedType) return;
    onUseAttack(selectedTarget, selectedType);
  }

  return (
    <div style={{
      marginTop: 16,
      padding: '12px 14px',
      borderRadius: 10,
      background: '#0f0f1e',
      border: '1px solid #333',
    }}>
      <p style={{ color: '#aaa', fontSize: 12, marginBottom: 8 }}>⚔️ Tus poderes</p>

      {myDefense && (
        <div style={{
          padding: '6px 10px',
          borderRadius: 6,
          background: '#1a2a1a',
          border: '1px solid #4CAF50',
          fontSize: 12,
          color: '#4CAF50',
          marginBottom: 10,
        }}>
          {DEFENSE_META[myDefense]?.label} — {DEFENSE_META[myDefense]?.desc} (auto-activa)
        </div>
      )}

      {availableAttacks.length > 0 && !myAttackUsed && (
        <>
          <p style={{ color: '#aaa', fontSize: 11, marginBottom: 6 }}>Elegí ataque:</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {availableAttacks.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  background: selectedType === type ? '#e94560' : '#222',
                  border: `1px solid ${selectedType === type ? '#e94560' : '#444'}`,
                  borderRadius: 20,
                  color: '#eee',
                }}
              >
                {ATTACK_META[type]?.label}
              </button>
            ))}
          </div>

          <p style={{ color: '#aaa', fontSize: 11, marginBottom: 6 }}>Elegí target:</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {otherPlayers.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedTarget(p.id)}
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  background: selectedTarget === p.id ? '#533483' : '#222',
                  border: `1px solid ${selectedTarget === p.id ? '#8b5cf6' : '#444'}`,
                  borderRadius: 20,
                  color: '#eee',
                }}
              >
                {p.nickname}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleConfirm}
              disabled={!selectedTarget || !selectedType}
              style={{
                flex: 1,
                fontSize: 13,
                padding: '8px',
                background: (!selectedTarget || !selectedType) ? '#333' : '#e94560',
              }}
            >
              ⚔️ Atacar
            </button>
            <button
              onClick={() => onUseAttack(null, null)}
              style={{ fontSize: 13, padding: '8px 12px', background: '#222' }}
            >
              Saltar
            </button>
          </div>
        </>
      )}

      {myAttackUsed && availableAttacks.length > 0 && (
        <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>✓ Ataque enviado</p>
      )}
    </div>
  );
}
