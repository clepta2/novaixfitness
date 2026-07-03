// src/constants/gamificationLevels.ts
// Niveis e progresso de XP

export const XP_VALUES = {
  WORKOUT_COMPLETED: 50, WORKOUT_RATED: 10, STREAK_BONUS_PER_DAY: 5,
  POST_CREATED: 15, POST_LIKED: 2, COMMENT_MADE: 5, FAVORITE_ADDED: 3,
  ONBOARDING_COMPLETED: 100, FIRST_WORKOUT: 200, DAILY_LOGIN: 5,
  PROFILE_COMPLETED: 30, SHARE_WORKOUT: 10, COMPLETE_ALL_DAILY: 100,
  REACTION_GIVEN: 2, STORY_CREATED: 10, GYM_CHECK_IN: 5,
  CHECK_IN_STREAK_7: 100, REFERRAL_SUCCESSFUL: 50, DUEL_WON: 75, GROUP_POST: 10,
} as const;

export interface Level {
  level: number;
  name: string;
  xpRequired: number;
  color: string;
  icon: string;
  rewards: string[];
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Iniciante', xpRequired: 0, color: '#94A3B8', icon: 'seedling', rewards: [] },
  { level: 2, name: 'Dedicado', xpRequired: 500, color: '#00E676', icon: 'flame', rewards: ['Badge exclusivo', 'Dicas de treino'] },
  { level: 3, name: 'Atleta', xpRequired: 2000, color: '#FFD600', icon: 'trophy', rewards: ['Titulo especial', 'Estatisticas avancadas'] },
  { level: 4, name: 'Mestre', xpRequired: 5000, color: '#FF6B35', icon: 'diamond', rewards: ['Coach IA premium', 'Treinos exclusivos'] },
  { level: 5, name: 'NOVAIX', xpRequired: 10000, color: '#CCFF00', icon: 'star', rewards: ['Titulo supremo', 'Acesso vitalicio'] },
];

export interface XPProgress {
  current: Level;
  next: Level | null;
  progress: number;
  xpInLevel: number;
  xpNeeded: number;
}

export interface UserStats {
  maxStreak?: number;
  totalWorkouts?: number;
  totalMinutes?: number;
  level?: number;
  totalXP?: number;
  [key: string]: number | undefined;
}

export function getLevelForXP(xp: number): Level {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) currentLevel = level;
    else break;
  }
  return currentLevel;
}

export function calculateLevel(xp: number): number {
  return getLevelForXP(xp).level;
}

export function getNextLevel(currentLevel: Level): Level | null {
  const idx = LEVELS.findIndex(l => l.level === currentLevel.level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getXPProgress(xp: number): XPProgress {
  const current = getLevelForXP(xp);
  const next = getNextLevel(current);
  if (!next) return { current, next: null, progress: 1, xpInLevel: 0, xpNeeded: 0 };
  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  return { current, next, progress: Math.min(1, xpInLevel / xpNeeded), xpInLevel, xpNeeded };
}
