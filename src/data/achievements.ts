// src/data/achievements.ts
// Re-export de constants + GOAL_TYPES

export { ACHIEVEMENTS, getUnlockedAchievements, checkNewAchievements } from '../constants/gamificationAchievements';

interface GoalType {
  id: string;
  label: string;
  unit: string;
  icon: string;
}

export const GOAL_TYPES: GoalType[] = [
  { id: 'workouts', label: 'Treinos', unit: 'treinos', icon: 'barbell' },
  { id: 'weight_loss', label: 'Perder peso', unit: 'kg', icon: 'trending-down' },
  { id: 'weight_gain', label: 'Ganhar peso', unit: 'kg', icon: 'trending-up' },
  { id: 'streak', label: 'Sequência', unit: 'dias', icon: 'flame' },
  { id: 'minutes', label: 'Minutos', unit: 'min', icon: 'time' },
];
