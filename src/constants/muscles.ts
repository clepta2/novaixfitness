import { COLORS } from './colors';

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'abs' | 'cardio';

export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest: COLORS.success,
  back: COLORS.info,
  legs: COLORS.secondary,
  shoulders: COLORS.attention,
  arms: COLORS.primary,
  abs: COLORS.success,
  cardio: COLORS.rose,
};

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Peito',
  back: 'Costas',
  legs: 'Pernas',
  shoulders: 'Ombros',
  arms: 'Braços',
  abs: 'Abdômen',
  cardio: 'Cardio',
};
