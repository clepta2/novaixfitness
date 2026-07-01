import { COLORS } from '../constants/colors';

export const STEPS = ['Info', 'Exercícios', 'Configurar', 'Preview'];

export const LEVELS = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf' },
  { id: 'intermediate', label: 'Intermediário', icon: 'flame' },
  { id: 'advanced', label: 'Avançado', icon: 'flash' },
];

export const LEVEL_COLORS = {
  beginner: COLORS.success,
  intermediate: COLORS.attention,
  advanced: COLORS.error,
};
