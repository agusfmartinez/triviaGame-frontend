import { useState } from 'react';
import { socket } from '../socket/socket';
import PlayerList from '../components/PlayerList';
import { BrandLogo, ChunkyButton, Avatar } from '../design/ui';
import { PALETTE, BRAND } from '../design/theme';
import { playSound } from '../design/sounds';

export default function Lobby({ room, myId, error, onClearError }) {
  const isHost = room.hostId === myId;
  const [copied, setCopied] = useState(false);

  function handleStart() {
    onClearError();
    playSound('start');
    socket.emit('start_game', { code: room.code });
  }

  function handleLeave() {
    playSound('tap');
    socket.emit('leave_room');
  }

  async function copyCode() {
    try { await navigator.clipboard.writeText(room.code); } catch {}
    playSound('pop');
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="tz-container">
      <div style={{ animation: 'logoBounce 2s ease-in-out infinite' }}>
        <BrandLogo text={BRAND.name} size="sm" />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
          letterSpacing: 2, color: PALETTE.textDim, textTransform: 'uppercase',
        }}>Tu código secreto</div>
      </div>

      <div onClick={copyCode} style={{
        background: PALETTE.surfaceSolid,
        border: `3px dashed ${PALETTE.accent}`,
        borderRadius: 24, padding: '14px 20px', textAlign: 'center',
        cursor: 'pointer',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 56, letterSpacing: 10, color: PALETTE.accent, lineHeight: 1,
          textShadow: `0 4px 0 ${PALETTE.primaryDark}`,
        }}>{room.code}</div>
        <div style={{
          marginTop: 8, fontFamily: 'var(--font-body)', fontSize: 12,
          color: copied ? PALETTE.success : PALETTE.textDim, fontWeight: 600,
        }}>{copied ? '✓ ¡Copiado!' : '📋 Tocá para copiar'}</div>
      </div>

      {error && (
        <div style={{
          background: `${PALETTE.danger}22`, color: PALETTE.danger,
          padding: '10px 14px', borderRadius: 14,
          border: `2px solid ${PALETTE.danger}66`,
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          textAlign: 'center',
        }}>{error}</div>
      )}

      <PlayerList players={room.players} myId={myId} />

      <div style={{ flex: 1 }} />

      <ChunkyButton fullWidth color={PALETTE.bg2} shadow="rgba(0,0,0,0.4)"
        textColor={PALETTE.textDim} onClick={handleLeave}
        style={{ fontSize: 15 }}>
        ← Salir de la sala
      </ChunkyButton>

      {isHost ? (
        <>
          {room.players.length < 2 && (
            <p style={{
              textAlign: 'center', color: PALETTE.textDim,
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
            }}>Esperando más jugadores...</p>
          )}
          <ChunkyButton fullWidth color={PALETTE.primary} shadow={PALETTE.primaryDark}
            disabled={room.players.length < 2}
            onClick={handleStart}>
            ▶ ¡Iniciar partida!
          </ChunkyButton>
        </>
      ) : (
        <p style={{
          textAlign: 'center', color: PALETTE.textDim,
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
        }}>Esperando que el host inicie la partida...</p>
      )}
    </div>
  );
}
