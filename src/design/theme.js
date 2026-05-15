// src/design/theme.js — Berry Pop palette + brand tokens
// Single source of truth for visual tokens. Consumed via CSS variables set in App.

export const PALETTE = {
  bg0: '#180a2e',
  bg1: '#2a1454',
  bg2: '#3d1f6e',
  surface: 'rgba(255,255,255,0.07)',
  surfaceSolid: '#251049',
  border: 'rgba(255,255,255,0.14)',
  text: '#FFF5E6',
  textDim: 'rgba(255,245,230,0.65)',
  textDimmer: 'rgba(255,245,230,0.4)',
  primary: '#FF3D8A',
  primaryDark: '#C81E66',
  accent: '#FFD166',
  accentDark: '#E6B33A',
  success: '#06D6A0',
  successDark: '#04A57A',
  info: '#4CC9F0',
  infoDark: '#0E8FB8',
  danger: '#FF5C5C',
  dangerDark: '#B33B3B',
};

export const FONTS = {
  display: '"Fredoka", system-ui, sans-serif',
  body: '"Plus Jakarta Sans", system-ui, sans-serif',
};

export const BRAND = {
  name: 'TRIVIAZO',
};

// Option colors for category vote + question answers
export const OPTION_COLORS = [PALETTE.primary, PALETTE.info, PALETTE.accent, PALETTE.success];
export const OPTION_SHADOWS = [PALETTE.primaryDark, PALETTE.infoDark, PALETTE.accentDark, PALETTE.successDark];

// Maps backend attack/effect types to UI metadata
export const ATTACK_META = {
  freeze:  { icon: '❄️', label: 'Freeze',    color: PALETTE.info,    verb: 'congeló a',        cast: 'freezeCast' },
  sticky:  { icon: '🦠', label: 'Sticky',    color: PALETTE.success, verb: 'manchó con slime', cast: 'stickyCast' },
  hide:    { icon: '🙈', label: 'Apagar',    color: '#8A7BFF',       verb: 'apagó las luces',  cast: 'hideCast' },
  confuse: { icon: '🔀', label: 'Confusión', color: PALETTE.accent,  verb: 'confundió a',      cast: 'shuffleCast' },
};

export const DEFENSE_META = {
  shield:  { icon: '🛡️', label: 'Escudo',   color: PALETTE.primary, desc: 'Bloquea 1 ataque entrante' },
  no_drop: { icon: '📌', label: 'No bajar', color: PALETTE.info,    desc: 'No pierde escalón en pirámide' },
  bombita: { icon: '💣', label: 'Bombita',  color: PALETTE.accent,  desc: 'Elimina 2 opciones incorrectas' },
};
