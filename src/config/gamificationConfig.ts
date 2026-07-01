// src/config/gamificationConfig.ts
// Configuracoes centralizadas de gamificacao

export const XP_FORMULA = {
  CUSTOM_WORKOUT: {
    logMultiplier: 5,
    exerciseMultiplier: 10,
    durationDivisor: 60,
    durationMultiplier: 2,
    cap: 200,
  },
};

export function calculateCustomWorkoutXP(
  logs: unknown[],
  exerciseCount: number,
  durationSeconds: number
): number {
  const { logMultiplier, exerciseMultiplier, durationDivisor, durationMultiplier, cap } = XP_FORMULA.CUSTOM_WORKOUT;
  return Math.min(
    logs.length * logMultiplier + exerciseCount * exerciseMultiplier + Math.floor(durationSeconds / durationDivisor) * durationMultiplier,
    cap
  );
}

export const STREAK_LEVELS = [
  { min: 0, label: 'Iniciante', icon: 'flame-outline', colorKey: 'textMuted' },
  { min: 3, label: 'Dedicado', icon: 'flame', colorKey: 'attention' },
  { min: 7, label: 'Consistente', icon: 'flame', colorKey: 'secondary' },
  { min: 14, label: 'Atleta', icon: 'flame', colorKey: 'primary' },
  { min: 30, label: 'Lenda', icon: 'trophy', colorKey: 'primary' },
];

export function getStreakLevel(streak: number) {
  return STREAK_LEVELS.slice().reverse().find(l => streak >= l.min) || STREAK_LEVELS[0];
}

export function getNextStreakLevel(streak: number) {
  return STREAK_LEVELS.find(l => streak < l.min) || null;
}
