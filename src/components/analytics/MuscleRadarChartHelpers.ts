// src/components/analytics/MuscleRadarChartHelpers.js
// Funções de cálculo e constantes do gráfico radar - NOVAIX FITNESS

import { COLORS } from '../../constants/colors';

export const GROUPS = [
  { key: 'chest', label: 'Peito', short: 'PEI', icon: 'body' },
  { key: 'back', label: 'Costas', short: 'COS', icon: 'body' },
  { key: 'legs', label: 'Pernas', short: 'PER', icon: 'walk' },
  { key: 'shoulders', label: 'Ombros', short: 'OMB', icon: 'body' },
  { key: 'arms', label: 'Braços', short: 'BRA', icon: 'barbell' },
  { key: 'core', label: 'Abdômen', short: 'ABD', icon: 'fitness' },
];

export const SIZE = 220, CENTER = 110, RADIUS = 75, LEVELS = 5;

export function polarToCartesian(index, value, total) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + (value / 100) * RADIUS * Math.cos(angle),
    y: CENTER + (value / 100) * RADIUS * Math.sin(angle),
  };
}

export function getTrend(current, previous) {
  if (!previous) return null;
  const diff = current - previous;
  if (diff > 10) return { icon: '↑', color: COLORS.success, text: `+${diff}%` };
  if (diff < -10) return { icon: '↓', color: COLORS.error, text: `${diff}%` };
  return { icon: '→', color: COLORS.textMuted, text: '~0' };
}

export function getBalanceScore(values) {
  const avg = values.reduce((s, v) => s + v.current, 0) / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v.current - avg, 2), 0) / values.length;
  return Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance))));
}

export function getInsight(values) {
  const sorted = [...values].sort((a, b) => a.current - b.current);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  if (strongest.current - weakest.current > 40) {
    return `${weakest.label} precisa de mais atenção`;
  }
  return 'Equilíbrio adequado';
}
