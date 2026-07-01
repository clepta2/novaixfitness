// src/services/gamificationAchievements.ts
// Conquistas do usuario

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { awardXP } from './gamificationLevels';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_workout', name: 'Primeiro Treino', description: 'Complete seu primeiro treino', icon: '🏋️', xp: 150 },
  { id: 'streak_7', name: 'Sequencia de 7', description: 'Mantenha streak de 7 dias', icon: '🔥', xp: 500 },
  { id: 'streak_30', name: 'Mes Completo', description: 'Mantenha streak de 30 dias', icon: '💪', xp: 2000 },
  { id: 'workouts_10', name: '10 Treinos', description: 'Complete 10 treinos', icon: '🎯', xp: 300 },
  { id: 'workouts_50', name: '50 Treinos', description: 'Complete 50 treinos', icon: '⭐', xp: 1500 },
  { id: 'workouts_100', name: '100 Treinos', description: 'Complete 100 treinos', icon: '👑', xp: 5000 },
  { id: 'weight_goal', name: 'Meta de Peso', description: 'Atinga sua meta de peso', icon: '⚖️', xp: 1000 },
  { id: 'meal_streak', name: 'Nutricao Consistente', description: 'Registre refeicoes por 14 dias', icon: '🥗', xp: 400 },
  { id: 'early_bird', name: 'Madrugador', description: 'Complete 10 treinos antes das 8h', icon: '🌅', xp: 600 },
  { id: 'night_owl', name: 'Coruja', description: 'Complete 10 treinos apos as 20h', icon: '🦉', xp: 600 },
  { id: 'social_butterfly', name: 'Social', description: 'Compartilhe 5 treinos', icon: '🦋', xp: 300 },
  { id: 'perfectionist', name: 'Perfeccionista', description: 'Complete todos exercicios em 20 treinos', icon: '✨', xp: 800 },
];

function checkAchievementCondition(achievementId: string, stats: Record<string, number>): boolean {
  switch (achievementId) {
    case 'first_workout': return stats.total_workouts >= 1;
    case 'streak_7': return stats.current_streak >= 7;
    case 'streak_30': return stats.current_streak >= 30;
    case 'workouts_10': return stats.total_workouts >= 10;
    case 'workouts_50': return stats.total_workouts >= 50;
    case 'workouts_100': return stats.total_workouts >= 100;
    case 'meal_streak': return stats.meal_streak >= 14;
    default: return false;
  }
}

export function getAchievements(): Achievement[] { return ACHIEVEMENTS; }

export async function getUserAchievements(userId: string): Promise<(Achievement & { unlocked_at: string })[]> {
  const { data } = await supabase.from(TABLES.USER_ACHIEVEMENTS)
    .select('achievement_id, unlocked_at').eq('user_id', userId);
  return (data || []).map(ua => ({
    ...ACHIEVEMENTS.find(a => a.id === ua.achievement_id)!,
    unlocked_at: ua.unlocked_at, unlocked: true,
  }));
}

export async function checkAchievements(userId: string): Promise<Achievement[]> {
  const { data: stats } = await supabase.rpc('get_user_stats', { p_user_id: userId });
  if (!stats) return [];
  const newAchievements: Achievement[] = [];
  for (const ach of ACHIEVEMENTS) {
    const { data: existing } = await supabase.from(TABLES.USER_ACHIEVEMENTS)
      .select('id').eq('user_id', userId).eq('achievement_id', ach.id).single();
    if (existing) continue;
    if (checkAchievementCondition(ach.id, stats)) {
      await supabase.from(TABLES.USER_ACHIEVEMENTS).insert({ user_id: userId, achievement_id: ach.id });
      await awardXP(userId, 'achievement_unlocked', { achievement_id: ach.id });
      newAchievements.push(ach);
    }
  }
  return newAchievements;
}
