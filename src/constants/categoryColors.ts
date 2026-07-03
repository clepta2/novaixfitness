// src/constants/categoryColors.ts
// Cores centralizadas para categorias - NOVAIX FITNESS

import { COLORS } from './colors';

export const CATEGORY_COLORS: Record<string, string> = {
  hiit: COLORS.secondary,
  HIIT: COLORS.secondary,
  'hiit/calistenia': COLORS.secondary,
  calistenia: COLORS.secondary,
  Calistenia: COLORS.secondary,
  força: COLORS.info,
  'força/hipertrofia': COLORS.info,
  hipertrofia: COLORS.info,
  Musculação: COLORS.primary,
  cardio: COLORS.error,
  Cardio: COLORS.error,
  funcional: COLORS.purple,
  mobilidade: COLORS.cyan,
  yoga: COLORS.info,
  alongamento: COLORS.cyan,
  Flexibilidade: COLORS.attention,
  plyometria: COLORS.amber,
  crossfit: COLORS.rose,
  natação: COLORS.info,
  Natação: COLORS.info,
  corrida: COLORS.error,
  ciclismo: COLORS.info,
  artes_marciais: COLORS.fuchsia,
  dança: COLORS.pink,
  pilates: COLORS.slateBlue,
  ginástica: COLORS.purple,
  flexibilidade: COLORS.cyan,
  resistência: COLORS.amber,
  powerlifting: COLORS.error,
  halterofilismo: COLORS.secondary,
  // Blog categories
  nutricao: COLORS.primary,
  treino: COLORS.secondary,
  saude: COLORS.success,
  mindset: COLORS.info,
  // Uppercase keys (weekPlan data)
  MUSCULAÇÃO: COLORS.primary,
  CARDIO: COLORS.error,
  CALISTENIA: COLORS.secondary,
  FLEXIBILIDADE: COLORS.attention,
};

export const LEVEL_COLORS: Record<string, string> = {
  Iniciante: COLORS.success,
  Intermediate: COLORS.attention,
  Intermediário: COLORS.attention,
  Advanced: COLORS.error,
  Avançado: COLORS.error,
  beginner: COLORS.success,
  intermediate: COLORS.attention,
  advanced: COLORS.error,
};

export const MUSCLE_COLORS: Record<string, string> = {
  peito: COLORS.error,
  costas: COLORS.info,
  ombros: COLORS.purple,
  bíceps: COLORS.secondary,
  tríceps: COLORS.pink,
  pernas: COLORS.success,
  quadríceps: COLORS.success,
  posterior: COLORS.cyan,
  glúteos: COLORS.rose,
  panturrilha: COLORS.amber,
  abdominal: COLORS.warning,
  core: COLORS.warning,
  antebraço: COLORS.slateBlue,
  trapézio: COLORS.fuchsia,
  deltóide: COLORS.purple,
};
