import PyramidViz from '../design/Pyramid';
import { ChunkyButton } from '../design/ui';
import { PALETTE } from '../design/theme';
import { playSound } from '../design/sounds';

export default function PyramidIntro({ game, myId, onVoteStart }) {
  const {
    positions = {}, pyramidHeight,
    readyCount = 0, totalPlayers = 0,
    timeLeft, myVotedStart,
  } = game;

  function handleStart() {
    if (myVotedStart) return;
    playSound('pop');
    onVoteStart();
  }

  return (
    <div className="tz-container">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
          color: PALETTE.accent, letterSpacing: -1,
          textShadow: `0 4px 0 ${PALETTE.primaryDark}`,
          animation: 'logoBounce 2s ease-in-out infinite',
        }}>🏆 PIRÁMIDE FINAL 🏆</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, color: PALETTE.textDim,
          marginTop: 8, textWrap: 'pretty',
        }}>Acertás → subís. Errás → bajás. El primero en llegar a la <b style={{ color: PALETTE.accent }}>cima</b> gana.</div>
      </div>

      <div style={{
        background: PALETTE.surfaceSolid, border: `2px solid ${PALETTE.border}`,
        borderRadius: 18, padding: 8,
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <PyramidViz positions={positions} pyramidHeight={pyramidHeight}
          highlightId={myId} animate />
      </div>

      <div style={{
        background: PALETTE.surfaceSolid, border: `2px solid ${PALETTE.border}`,
        borderRadius: 16, padding: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ fontSize: 26 }}>👥</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 13, color: PALETTE.text, fontWeight: 700,
          }}>{readyCount}/{totalPlayers} listos</div>
          <div style={{
            marginTop: 4, height: 5, background: PALETTE.bg0, borderRadius: 3, overflow: 'hidden',
          }}>
            <div style={{
              width: totalPlayers > 0 ? `${(readyCount / totalPlayers) * 100}%` : '0%',
              height: '100%', background: PALETTE.success,
              transition: 'width .5s',
            }} />
          </div>
        </div>
        {(readyCount > 0 && timeLeft > 0) && (
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, color: PALETTE.accent, fontSize: 14,
          }}>{timeLeft}s</div>
        )}
      </div>

      <ChunkyButton fullWidth color={myVotedStart ? PALETTE.bg2 : PALETTE.accent}
        shadow={myVotedStart ? 'rgba(0,0,0,0.4)' : PALETTE.accentDark}
        textColor={myVotedStart ? PALETTE.textDim : PALETTE.bg0}
        disabled={!!myVotedStart} onClick={handleStart}>
        {myVotedStart ? '✓ Listo para iniciar' : '🏆 ¡Iniciar pirámide!'}
      </ChunkyButton>
    </div>
  );
}
