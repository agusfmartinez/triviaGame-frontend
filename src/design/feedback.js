// src/design/feedback.js — Global feedback event bus
// Decouples App-level visual effects (confetti, shake) from deep components.

const listeners = new Set();

export function emitFeedback(type) {
  listeners.forEach(fn => { try { fn(type); } catch {} });
}

export function onFeedback(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
