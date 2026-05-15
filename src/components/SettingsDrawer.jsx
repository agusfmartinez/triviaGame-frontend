import { useState } from 'react';
import { PALETTE } from '../design/theme';
import { avatarFor } from '../design/ui';
import { isSoundMuted, setSoundMuted } from '../design/sounds';
import { socket } from '../socket/socket';

export default function SettingsDrawer({ room, myId, onLeave }) {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());

  function toggleSound() {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  }

  function handleLeave() {
    setOpen(false);
    socket.emit('leave_room');
    onLeave();
  }

  const players = room?.players || [];

  return (
    <>
      {/* Gear button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Configuración"
        style={{
          position: 'fixed',
          bottom: 'calc(16px + var(--safe-bottom, 0px))',
          left: 12,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${PALETTE.border}`,
          color: PALETTE.text, fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 100,
        }}
      >⚙️</button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 200,
            animation: 'fadeIn .2s',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: 280,
        background: PALETTE.bg1,
        borderRight: `1px solid ${PALETTE.border}`,
        zIndex: 201,
        display: 'flex', flexDirection: 'column',
        padding: '48px 16px 32px',
        gap: 8,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
            color: PALETTE.text,
          }}>Configuración</span>
          <button onClick={() => setOpen(false)} style={{
            background: 'none', border: 'none', color: PALETTE.textDim,
            fontSize: 20, cursor: 'pointer', padding: 4,
          }}>✕</button>
        </div>

        {/* Players list */}
        {players.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
              color: PALETTE.textDim, letterSpacing: 1, textTransform: 'uppercase',
              marginBottom: 4,
            }}>Jugadores ({players.length})</div>
            {players.map(p => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 12,
                background: p.id === myId ? `${PALETTE.primary}22` : PALETTE.surface,
                border: `1.5px solid ${p.id === myId ? PALETTE.primary : 'transparent'}`,
              }}>
                <span style={{ fontSize: 22 }}>{avatarFor(p.nickname)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                    color: PALETTE.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{p.nickname}{p.id === myId && (
                    <span style={{ color: PALETTE.primary, fontSize: 11, marginLeft: 6 }}>· vos</span>
                  )}</div>
                  {p.isHost && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: PALETTE.accent }}>
                      👑 Host
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ height: 1, background: PALETTE.border, margin: '8px 0' }} />
          </>
        )}

        {/* Sound toggle */}
        <button onClick={toggleSound} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 12,
          background: PALETTE.surface,
          border: `1.5px solid ${PALETTE.border}`,
          cursor: 'pointer', textAlign: 'left',
        }}>
          <span style={{ fontSize: 22 }}>{muted ? '🔇' : '🔊'}</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
            color: PALETTE.text,
          }}>{muted ? 'Sonido desactivado' : 'Sonido activado'}</span>
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Abandon room */}
        {room && (
          <button onClick={handleLeave} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12,
            background: `${PALETTE.danger}18`,
            border: `1.5px solid ${PALETTE.danger}55`,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <span style={{ fontSize: 20 }}>🚪</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              color: PALETTE.danger,
            }}>Abandonar sala</span>
          </button>
        )}
      </div>
    </>
  );
}
