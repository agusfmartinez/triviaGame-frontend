import { useState, useEffect, useRef } from 'react';
import { FreezeOverlay, StickyOverlay, HideOverlay } from '../design/effects';
import { TimerRing, ChunkyButton } from '../design/ui';
import { PALETTE, OPTION_COLORS, OPTION_SHADOWS, DEFENSE_META } from '../design/theme';
import { playSound } from '../design/sounds';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// IDENTICAL layout to QuestionActive — only the header pill changes to "🏆 PIRÁMIDE".
export default function FinalPyramid({ game, room, myId, onAnswer, onUseBombita, activatedDefense }) {
  const {
    question, options = [], timeLeft, timeLimit,
    questionNumber, myAnswer,
    answeredCount = 0, answeredPlayers = [],
    activeEffects = {}, defenses = {}, bombitaHide = [],
  } = game;
  const totalPlayers = game.totalPlayers || room?.players?.length || 0;

  const myEffects = activeEffects[myId] || [];
  const isFrozen = myEffects.includes('freeze');
  const isHidden = myEffects.includes('hide');
  const isSticky = myEffects.includes('sticky');
  const isConfused = myEffects.includes('confuse');
  const myDefense = defenses[myId];
  const canAnswer = myAnswer === null || myAnswer === undefined;
  const isDisabled = !canAnswer || isFrozen;

  const [displayOrder, setDisplayOrder] = useState([0, 1, 2, 3]);
  useEffect(() => {
    if (!isConfused) { setDisplayOrder([0, 1, 2, 3]); return; }
    const i = setInterval(() => {
      setDisplayOrder(prev => {
        const a = [...prev];
        for (let k = a.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [a[k], a[j]] = [a[j], a[k]];
        }
        return a;
      });
    }, 800);
    return () => clearInterval(i);
  }, [isConfused]);

  const lastTick = useRef(timeLeft);
  useEffect(() => {
    if (timeLeft == null || timeLeft === lastTick.current) return;
    lastTick.current = timeLeft;
    if (timeLeft > 0 && canAnswer) {
      if (timeLeft <= 3) playSound('tickUrgent');
      else if (timeLeft % 2 === 0) playSound('tick');
    }
  }, [timeLeft, canAnswer]);

  const lastEffects = useRef(myEffects.join(','));
  useEffect(() => {
    const key = myEffects.join(',');
    if (key && key !== lastEffects.current) playSound('attackReceive');
    lastEffects.current = key;
  }, [myEffects]);

  function handleAnswer(originalIdx) {
    if (isDisabled) return;
    playSound('pop');
    onAnswer(originalIdx);
  }

  return (
    <div className="tz-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          background: `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.primary})`,
          color: PALETTE.bg0,
          borderRadius: 14, padding: '6px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, letterSpacing: 1,
          boxShadow: `0 3px 0 ${PALETTE.primaryDark}`,
        }}><span style={{ fontSize: 16 }}>🏆</span>PIRÁMIDE</div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
          color: PALETTE.textDim,
        }}>{answeredCount}/{totalPlayers || '?'} ✓</div>
        <TimerRing value={timeLeft || 0} max={timeLimit || 10} />
      </div>

      <div style={{
        background: PALETTE.surfaceSolid, borderRadius: 22,
        border: `2px solid ${PALETTE.border}`,
        padding: 18, boxShadow: `0 6px 0 rgba(0,0,0,0.3)`,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600,
          color: PALETTE.text, lineHeight: 1.3, textWrap: 'pretty',
        }}>{question}</div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displayOrder.map((originalIdx, displayPos) => {
          const isMyAnswer = myAnswer === originalIdx;
          if (bombitaHide.includes(originalIdx)) return null;
          const color = OPTION_COLORS[displayPos % 4];
          const shadow = OPTION_SHADOWS[displayPos % 4];
          return (
            <button key={originalIdx} onClick={() => handleAnswer(originalIdx)} disabled={isDisabled}
              style={{
                position: 'relative',
                appearance: 'none', border: 'none', textAlign: 'left',
                background: color, color: '#fff',
                fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
                padding: '16px 16px', borderRadius: 20,
                boxShadow: isMyAnswer
                  ? `0 0 0 3px #fff, 0 5px 0 ${shadow}`
                  : `0 5px 0 ${shadow}`,
                opacity: (!canAnswer && !isMyAnswer) ? 0.45 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'opacity .2s',
                minHeight: 60,
                animation: isConfused ? `shuffleSwap .4s ease` : undefined,
              }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(0,0,0,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
                flexShrink: 0,
              }}>{isMyAnswer ? '✓' : OPTION_LABELS[displayPos]}</div>
              <div style={{ flex: 1, textWrap: 'pretty' }}>{options[originalIdx]}</div>
            </button>
          );
        })}
        <FreezeOverlay active={isFrozen} />
        <StickyOverlay active={isSticky} />
        <HideOverlay active={isHidden} />
      </div>

      {myEffects.length > 0 && <ActiveEffectBanner effects={myEffects} />}
      {activatedDefense && <UsedDefenseBanner type={activatedDefense} />}

      {myDefense === 'bombita' && canAnswer && bombitaHide.length === 0 && (
        <ChunkyButton fullWidth color={PALETTE.accent} textColor={PALETTE.bg0} shadow={PALETTE.accentDark}
          onClick={() => { playSound('bombita'); onUseBombita(); }}
          style={{ fontSize: 16 }}>
          💣 Usar Bombita
        </ChunkyButton>
      )}

    </div>
  );
}

import { ATTACK_META } from '../design/theme';

function UsedDefenseBanner({ type }) {
  const meta = DEFENSE_META[type];
  if (!meta) return null;
  return (
    <div style={{
      background: `${meta.color}22`, border: `2px solid ${meta.color}`,
      borderRadius: 14, padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideInDown .35s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <div style={{ fontSize: 26 }}>{meta.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: meta.color,
        }}>Usaste {meta.label}</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: PALETTE.textDim, marginTop: 1,
        }}>{meta.desc}</div>
      </div>
    </div>
  );
}

function ActiveEffectBanner({ effects }) {
  const e = effects.includes('freeze') ? 'freeze'
          : effects.includes('hide')   ? 'hide'
          : effects.includes('sticky') ? 'sticky'
          : effects.includes('confuse') ? 'confuse' : null;
  if (!e) return null;
  const meta = ATTACK_META[e];
  const text = {
    freeze:  '¡Te congelaron las opciones!',
    sticky:  '¡Te lanzaron slime!',
    hide:    '¡Apagaron las luces!',
    confuse: '¡Te mezclaron las opciones!',
  }[e];
  return (
    <div style={{
      background: `${meta.color}22`, border: `2px solid ${meta.color}`,
      borderRadius: 14, padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideInDown .35s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <div style={{ fontSize: 26, animation: 'wiggle .8s ease-in-out infinite' }}>{meta.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: meta.color,
        }}>{text}</div>
      </div>
    </div>
  );
}
