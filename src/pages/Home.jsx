import { useState } from 'react';
import { socket } from '../socket/socket';
import { BrandLogo, ChunkyButton, Input } from '../design/ui';
import { PALETTE, BRAND } from '../design/theme';
import { playSound } from '../design/sounds';

export default function Home({ error, onClearError }) {
  const [mode, setMode] = useState(null);
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');

  function handleCreate(e) {
    e.preventDefault();
    if (!nickname.trim()) return;
    onClearError();
    playSound('tap');
    socket.emit('create_room', { nickname: nickname.trim() });
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!nickname.trim() || code.length !== 4) return;
    onClearError();
    playSound('join');
    socket.emit('join_room', { code: code.trim().toUpperCase(), nickname: nickname.trim() });
  }

  return (
    <div className="tz-container" style={{ justifyContent: 'center' }}>
      {/* Floating doodles */}
      <div className="tz-doodle" style={{ top: '6%', left: '8%', fontSize: 28, opacity: 0.6, animation: 'floatY1 4s ease-in-out infinite' }}>✨</div>
      <div className="tz-doodle" style={{ top: '12%', right: '10%', fontSize: 22, opacity: 0.5, animation: 'floatY2 5s ease-in-out infinite' }}>⭐</div>
      <div className="tz-doodle" style={{ bottom: '22%', left: '12%', fontSize: 24, opacity: 0.6, animation: 'floatY3 4.5s ease-in-out infinite' }}>🎈</div>
      <div className="tz-doodle" style={{ bottom: '14%', right: '8%', fontSize: 26, opacity: 0.5, animation: 'floatY1 5.5s ease-in-out infinite' }}>💫</div>

      <div style={{ flex: 1 }} />

      <div style={{ animation: 'logoBounce 2s ease-in-out infinite' }}>
        <BrandLogo text={BRAND.name} />
      </div>
      <div style={{
        textAlign: 'center',
        fontFamily: 'var(--font-body)', fontWeight: 600,
        color: PALETTE.textDim, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
      }}>Multijugador · En vivo</div>

      {error && (
        <div style={{
          background: `${PALETTE.danger}22`, color: PALETTE.danger,
          padding: '10px 14px', borderRadius: 14,
          border: `2px solid ${PALETTE.danger}66`,
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          textAlign: 'center', animation: 'slideInDown .3s',
        }}>{error}</div>
      )}

      {!mode && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          <ChunkyButton fullWidth color={PALETTE.primary} shadow={PALETTE.primaryDark}
            onClick={() => { playSound('pop'); setMode('create'); }}>
            🎉 Crear sala
          </ChunkyButton>
          <ChunkyButton fullWidth color={PALETTE.accent} textColor={PALETTE.bg0} shadow={PALETTE.accentDark}
            onClick={() => { playSound('pop'); setMode('join'); }}>
            🔑 Unirme con código
          </ChunkyButton>
        </div>
      )}

      {mode && (
        <form onSubmit={mode === 'create' ? handleCreate : handleJoin}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'join' && (
            <Input value={code} onChange={v => setCode(v.toUpperCase().slice(0, 4))}
              placeholder="CÓDIGO" big autoFocus />
          )}
          <Input value={nickname} onChange={setNickname}
            placeholder="Tu nickname" maxLength={20}
            autoFocus={mode === 'create'} />
          <ChunkyButton fullWidth type="submit"
            color={PALETTE.success} shadow={PALETTE.successDark}
            disabled={!nickname.trim() || (mode === 'join' && code.length !== 4)}>
            {mode === 'create' ? '¡A jugar!' : 'Unirme'}
          </ChunkyButton>
          <button type="button" onClick={() => setMode(null)} style={{
            background: 'none', border: 'none', color: PALETTE.textDim,
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', padding: 8,
          }}>← Volver</button>
        </form>
      )}

      <div style={{ flex: 1 }} />
    </div>
  );
}
