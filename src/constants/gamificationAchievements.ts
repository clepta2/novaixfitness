// src/constants/gamificationAchievements.ts
// Conquistas e desafios semanais

export type AchievementCategory = 'streak' | 'workout' | 'time' | 'social' | 'level' | 'xp' | 'weekly';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: AchievementCategory;
  requirement: number;
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak
  { id: 'streak_3', name: 'Fogo Aceso', description: '3 dias seguidos treinando', icon: 'flame', color: '#FF6B35', category: 'streak', requirement: 3, xpReward: 50 },
  { id: 'streak_7', name: 'Semana Perfeita', description: '7 dias seguidos treinando', icon: 'flame', color: '#FF6B35', category: 'streak', requirement: 7, xpReward: 150 },
  { id: 'streak_14', name: 'Duas Semanas', description: '14 dias seguidos treinando', icon: 'flame', color: '#FFD600', category: 'streak', requirement: 14, xpReward: 300 },
  { id: 'streak_30', name: 'Mes de Ferro', description: '30 dias seguidos treinando', icon: 'flame', color: '#CCFF00', category: 'streak', requirement: 30, xpReward: 500 },
  { id: 'streak_60', name: 'Inabalavel', description: '60 dias seguidos treinando', icon: 'flame', color: '#CCFF00', category: 'streak', requirement: 60, xpReward: 1000 },
  { id: 'streak_100', name: 'Centenario', description: '100 dias seguidos treinando', icon: 'flame', color: '#CCFF00', category: 'streak', requirement: 100, xpReward: 2000 },
  // Treinos
  { id: 'workout_1', name: 'Primeiro Treino', description: 'Complete seu primeiro treino', icon: 'trophy', color: '#FFD600', category: 'workout', requirement: 1, xpReward: 200 },
  { id: 'workout_5', name: 'Aquecendo', description: 'Complete 5 treinos', icon: 'barbell', color: '#00E676', category: 'workout', requirement: 5, xpReward: 100 },
  { id: 'workout_10', name: 'Dez Pra Um', description: 'Complete 10 treinos', icon: 'barbell', color: '#00E676', category: 'workout', requirement: 10, xpReward: 200 },
  { id: 'workout_25', name: 'Vinte e Cinco Treinos', description: 'Complete 25 treinos', icon: 'barbell', color: '#FFD600', category: 'workout', requirement: 25, xpReward: 350 },
  { id: 'workout_50', name: 'Meio Centenario', description: 'Complete 50 treinos', icon: 'barbell', color: '#FF6B35', category: 'workout', requirement: 50, xpReward: 500 },
  { id: 'workout_100', name: 'Centuriao', description: 'Complete 100 treinos', icon: 'trophy', color: '#CCFF00', category: 'workout', requirement: 100, xpReward: 1000 },
  { id: 'workout_250', name: 'Maquina', description: 'Complete 250 treinos', icon: 'trophy', color: '#CCFF00', category: 'workout', requirement: 250, xpReward: 2000 },
  { id: 'workout_500', name: 'Lenda Viva', description: 'Complete 500 treinos', icon: 'star', color: '#CCFF00', category: 'workout', requirement: 500, xpReward: 5000 },
  // Tempo
  { id: 'time_60', name: 'Primeira Hora', description: 'Acumule 60 minutos', icon: 'time', color: '#94A3B8', category: 'time', requirement: 60, xpReward: 50 },
  { id: 'time_300', name: '5 Horas', description: 'Acumule 5 horas de treino', icon: 'time', color: '#00E676', category: 'time', requirement: 300, xpReward: 150 },
  { id: 'time_1000', name: 'Maratona', description: 'Acumule 1000 minutos (~16h)', icon: 'time', color: '#FFD600', category: 'time', requirement: 1000, xpReward: 400 },
  { id: 'time_5000', name: 'Ultra Atleta', description: 'Acumule 5000 minutos (~83h)', icon: 'time', color: '#FF6B35', category: 'time', requirement: 5000, xpReward: 1000 },
  // Social
  { id: 'social_first_post', name: 'Primeira Postagem', description: 'Publique na comunidade', icon: 'chatbubble', color: '#00E676', category: 'social', requirement: 1, xpReward: 50 },
  { id: 'social_10_posts', name: 'Influencer', description: 'Publique 10 posts', icon: 'chatbubble', color: '#FFD600', category: 'social', requirement: 10, xpReward: 200 },
  { id: 'social_50_likes', name: 'Popular', description: 'Receba 50 curtidas', icon: 'heart', color: '#FF6B35', category: 'social', requirement: 50, xpReward: 300 },
  { id: 'social_100_likes', name: 'Celebridade', description: 'Receba 100 curtidas', icon: 'star', color: '#FFD600', category: 'social', requirement: 100, xpReward: 500 },
  { id: 'social_50_followers', name: 'Influenciador', description: 'Alcance 50 seguidores', icon: 'people', color: '#6366F1', category: 'social', requirement: 50, xpReward: 400 },
  { id: 'social_100_posts', name: 'Veterano', description: 'Publique 100 posts', icon: 'trophy', color: '#CCFF00', category: 'social', requirement: 100, xpReward: 500 },
  { id: 'referral_1', name: 'Recrutador', description: 'Indique 1 amigo', icon: 'person-add', color: '#3B82F6', category: 'social', requirement: 1, xpReward: 100 },
  { id: 'referral_5', name: 'Recrutador Pro', description: 'Indique 5 amigos', icon: 'people', color: '#6366F1', category: 'social', requirement: 5, xpReward: 300 },
  { id: 'referral_10', name: 'Recrutador Elite', description: 'Indique 10 amigos', icon: 'trophy', color: '#FFD600', category: 'social', requirement: 10, xpReward: 500 },
  // Nivel
  { id: 'level_2', name: 'Subindo de Nivel', description: 'Alcance o nivel 2', icon: 'trending-up', color: '#00E676', category: 'level', requirement: 2, xpReward: 100 },
  { id: 'level_3', name: 'Meio Caminho', description: 'Alcance o nivel 3', icon: 'trending-up', color: '#FFD600', category: 'level', requirement: 3, xpReward: 300 },
  { id: 'level_4', name: 'Elite', description: 'Alcance o nivel 4', icon: 'trending-up', color: '#FF6B35', category: 'level', requirement: 4, xpReward: 500 },
  { id: 'level_5', name: 'NOVAIX Supremo', description: 'Alcance o nivel maximo', icon: 'star', color: '#CCFF00', category: 'level', requirement: 5, xpReward: 2000 },
  // XP
  { id: 'xp_100', name: 'Primeiros Passos', description: 'Acumule 100 XP', icon: 'flash', color: '#94A3B8', category: 'xp', requirement: 100, xpReward: 25 },
  { id: 'xp_500', name: 'Coletor de XP', description: 'Acumule 500 XP', icon: 'flash', color: '#00E676', category: 'xp', requirement: 500, xpReward: 50 },
  { id: 'xp_1000', name: 'Mestre do XP', description: 'Acumule 1.000 XP', icon: 'flash', color: '#FFD600', category: 'xp', requirement: 1000, xpReward: 100 },
  { id: 'xp_2500', name: 'Caçador de XP', description: 'Acumule 2.500 XP', icon: 'flash', color: '#FF6B35', category: 'xp', requirement: 2500, xpReward: 200 },
  { id: 'xp_5000', name: 'Lenda do XP', description: 'Acumule 5.000 XP', icon: 'flash', color: '#CCFF00', category: 'xp', requirement: 5000, xpReward: 500 },
  { id: 'xp_10000', name: 'Supremo do XP', description: 'Acumule 10.000 XP', icon: 'star', color: '#CCFF00', category: 'xp', requirement: 10000, xpReward: 1000 },
];

export type WeeklyChallengeType = 'workouts' | 'minutes' | 'streak' | 'posts';

export interface WeeklyChallenge {
  id: string;
  name: string;
  target: number;
  type: WeeklyChallengeType;
  xpReward: number;
  icon: string;
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  { id: 'ch_3_workouts', name: 'Complete 3 treinos', target: 3, type: 'workouts', xpReward: 100, icon: 'barbell' },
  { id: 'ch_5_workouts', name: 'Complete 5 treinos', target: 5, type: 'workouts', xpReward: 250, icon: 'barbell' },
  { id: 'ch_120_minutes', name: 'Treine 120 minutos', target: 120, type: 'minutes', xpReward: 150, icon: 'time' },
  { id: 'ch_streak_7', name: 'Mantenha streak de 7', target: 7, type: 'streak', xpReward: 200, icon: 'flame' },
  { id: 'ch_2_posts', name: 'Poste 2x na comunidade', target: 2, type: 'posts', xpReward: 100, icon: 'chatbubble' },
];

export function getUnlockedAchievements(userStats: { [key: string]: number | undefined }): Achievement[] {
  return ACHIEVEMENTS.filter(a => {
    let value = 0;
    switch (a.category) {
      case 'streak': value = userStats.maxStreak || 0; break;
      case 'workout': value = userStats.totalWorkouts || 0; break;
      case 'time': value = userStats.totalMinutes || 0; break;
      case 'social': value = userStats[`${a.id}_count`] || 0; break;
      case 'level': value = userStats.level || 1; break;
      case 'xp': value = userStats.totalXP || 0; break;
      case 'weekly': value = userStats[`${a.id}_count`] || 0; break;
    }
    return value >= a.requirement;
  });
}

export function checkNewAchievements(userStats: { [key: string]: number | undefined }, previouslyUnlocked: Achievement[]): Achievement[] {
  const allUnlocked = getUnlockedAchievements(userStats);
  const previousIds = new Set(previouslyUnlocked.map(a => a.id));
  return allUnlocked.filter(a => !previousIds.has(a.id));
}
