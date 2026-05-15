// src/design/sounds.js — Web Audio API synthesized sounds. No asset files.
// Auto-unlocks on first user gesture. Persists mute in localStorage.

let _ctx = null;
let _master = null;
let _volume = 0.25;
let _muted = (() => { try { return localStorage.getItem('triviazo:muted') === '1'; } catch { return false; } })();

function getCtx() {
  if (!_ctx) {
    try {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
      _master = _ctx.createGain();
      _master.gain.value = _muted ? 0 : _volume;
      _master.connect(_ctx.destination);
    } catch (e) { console.warn('Web Audio not supported'); }
  }
  return _ctx;
}

export function unlockAudio() {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function setSoundVolume(v) {
  _volume = Math.max(0, Math.min(1, v));
  if (_master) _master.gain.value = _muted ? 0 : _volume;
}

export function setSoundMuted(m) {
  _muted = m;
  try { localStorage.setItem('triviazo:muted', m ? '1' : '0'); } catch {}
  if (_master) _master.gain.value = _muted ? 0 : _volume;
}

export function isSoundMuted() { return _muted; }

function tone({ freq = 440, duration = 0.15, type = 'sine', gain = 0.3, attack = 0.005, decay = 0.05, sustain = 0.6, sweepTo = null, when = 0 }) {
  const ctx = getCtx(); if (!ctx || _muted) return;
  const t = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (sweepTo !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), t + duration);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.linearRampToValueAtTime(gain * sustain, t + attack + decay);
  g.gain.linearRampToValueAtTime(0.0001, t + duration);
  osc.connect(g).connect(_master);
  osc.start(t); osc.stop(t + duration + 0.08);
}

function noise({ duration = 0.15, gain = 0.2, filterFreq = 1000, type = 'lowpass' }) {
  const ctx = getCtx(); if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buffer;
  const filter = ctx.createBiquadFilter(); filter.type = type; filter.frequency.value = filterFreq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.linearRampToValueAtTime(0.0001, t + duration);
  src.connect(filter).connect(g).connect(_master);
  src.start(t); src.stop(t + duration);
}

const SOUNDS = {
  tap:        () => tone({ freq: 600, duration: 0.05, type: 'sine', gain: 0.18 }),
  pop:        () => tone({ freq: 880, duration: 0.08, type: 'triangle', gain: 0.2 }),
  tick:       () => tone({ freq: 800, duration: 0.06, type: 'square', gain: 0.15 }),
  tickUrgent: () => tone({ freq: 1100, duration: 0.07, type: 'square', gain: 0.22 }),
  go: () => {
    tone({ freq: 523, duration: 0.1, type: 'square', gain: 0.3 });
    tone({ freq: 784, duration: 0.18, type: 'square', gain: 0.3, when: 0.06 });
  },
  correct: () => {
    tone({ freq: 523, duration: 0.12, type: 'triangle', gain: 0.3 });
    tone({ freq: 659, duration: 0.12, type: 'triangle', gain: 0.3, when: 0.08 });
    tone({ freq: 784, duration: 0.12, type: 'triangle', gain: 0.3, when: 0.16 });
    tone({ freq: 1047, duration: 0.25, type: 'triangle', gain: 0.3, when: 0.24 });
  },
  wrong: () => {
    tone({ freq: 220, duration: 0.18, type: 'sawtooth', gain: 0.25, sweepTo: 110 });
    noise({ duration: 0.15, gain: 0.1, filterFreq: 300 });
  },
  freezeCast: () => {
    tone({ freq: 1500, duration: 0.3, type: 'sine', gain: 0.2, sweepTo: 400 });
    tone({ freq: 1800, duration: 0.3, type: 'triangle', gain: 0.1, sweepTo: 600 });
  },
  stickyCast: () => {
    tone({ freq: 200, duration: 0.25, type: 'sawtooth', gain: 0.2, sweepTo: 80 });
    tone({ freq: 300, duration: 0.15, type: 'square', gain: 0.12, when: 0.1 });
  },
  hideCast: () => {
    tone({ freq: 600, duration: 0.35, type: 'sine', gain: 0.2, sweepTo: 100 });
    noise({ duration: 0.3, gain: 0.08, filterFreq: 400 });
  },
  shuffleCast: () => {
    [0, 0.06, 0.12, 0.18].forEach((d, i) => {
      tone({ freq: 400 + i * 150, duration: 0.08, type: 'square', gain: 0.18, when: d });
    });
  },
  attackReceive: () => {
    tone({ freq: 100, duration: 0.2, type: 'sawtooth', gain: 0.3 });
    noise({ duration: 0.18, gain: 0.15, filterFreq: 200 });
  },
  shieldBlock: () => {
    tone({ freq: 1200, duration: 0.25, type: 'triangle', gain: 0.25 });
    tone({ freq: 1800, duration: 0.25, type: 'sine', gain: 0.15, when: 0.02 });
  },
  bombita: () => {
    tone({ freq: 60, duration: 0.4, type: 'sawtooth', gain: 0.4, sweepTo: 30 });
    noise({ duration: 0.35, gain: 0.25, filterFreq: 800 });
  },
  stepUp: () => {
    tone({ freq: 400, duration: 0.3, type: 'triangle', gain: 0.25, sweepTo: 900 });
    tone({ freq: 600, duration: 0.3, type: 'sine', gain: 0.12, sweepTo: 1200, when: 0.05 });
  },
  stepDown: () => {
    tone({ freq: 600, duration: 0.4, type: 'triangle', gain: 0.25, sweepTo: 200 });
  },
  win: () => {
    tone({ freq: 523, duration: 0.18, type: 'square', gain: 0.3 });
    tone({ freq: 659, duration: 0.18, type: 'square', gain: 0.3, when: 0.12 });
    tone({ freq: 784, duration: 0.18, type: 'square', gain: 0.3, when: 0.24 });
    tone({ freq: 1047, duration: 0.5, type: 'square', gain: 0.35, when: 0.36 });
    tone({ freq: 1319, duration: 0.5, type: 'triangle', gain: 0.25, when: 0.36 });
  },
  lose: () => {
    tone({ freq: 392, duration: 0.25, type: 'sawtooth', gain: 0.25, sweepTo: 330 });
    tone({ freq: 330, duration: 0.25, type: 'sawtooth', gain: 0.25, sweepTo: 277, when: 0.2 });
    tone({ freq: 277, duration: 0.4, type: 'sawtooth', gain: 0.25, sweepTo: 220, when: 0.4 });
  },
  join: () => tone({ freq: 880, duration: 0.12, type: 'triangle', gain: 0.2, sweepTo: 1320 }),
  start: () => {
    tone({ freq: 220, duration: 0.08, type: 'square', gain: 0.3 });
    tone({ freq: 440, duration: 0.08, type: 'square', gain: 0.3, when: 0.08 });
    tone({ freq: 880, duration: 0.2, type: 'square', gain: 0.3, when: 0.16 });
  },
};

export function playSound(name) {
  unlockAudio();
  const fn = SOUNDS[name];
  if (fn) try { fn(); } catch (e) { console.warn('Sound error:', name, e); }
}
