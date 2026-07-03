// src/helpers/muscles.ts
// Dados de divisao muscular por categoria - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

interface MuscleSplit {
  name: string;
  pct: number;
  color: string;
}

const SPLITS: Record<string, MuscleSplit[]> = {
  chest: [
    { name: 'Peitoral Maior 🏋️', pct: 70, color: COLORS.primary },
    { name: 'Tríceps 💪', pct: 20, color: COLORS.secondary },
    { name: 'Deltoides (Ombros) 🎯', pct: 10, color: COLORS.info },
  ],
  back: [
    { name: 'Latíssimo do Dorso 🏋️', pct: 60, color: COLORS.primary },
    { name: 'Bíceps 💪', pct: 25, color: COLORS.secondary },
    { name: 'Trapézio 🎯', pct: 15, color: COLORS.info },
  ],
  legs: [
    { name: 'Quadríceps 🏋️', pct: 50, color: COLORS.primary },
    { name: 'Posteriores de Coxa 💪', pct: 30, color: COLORS.secondary },
    { name: 'Panturrilhas 🎯', pct: 20, color: COLORS.info },
  ],
  default: [
    { name: 'Músculos Primários 🏋️', pct: 60, color: COLORS.primary },
    { name: 'Músculos Secundários 💪', pct: 40, color: COLORS.secondary },
  ],
};

const CATEGORY_MAP: Record<string, string> = {
  peito: 'chest', chest: 'chest', empurrar: 'chest', push: 'chest',
  costa: 'back', back: 'back', puxar: 'back', pull: 'back',
  perna: 'legs', leg: 'legs', coxa: 'legs', glúteo: 'legs',
};

export function getMuscleSplit(category: string): MuscleSplit[] {
  const cat = (category || '').toLowerCase();
  for (const [keyword, splitKey] of Object.entries(CATEGORY_MAP)) {
    if (cat.includes(keyword)) return SPLITS[splitKey];
  }
  return SPLITS.default;
}
