// src/constants/gamification.js
// Sistema de gamificação - XP, Níveis, Conquistas - NOVAIX FITNESS

export const XP_VALUES = {
  WORKOUT_COMPLETED: 50,
  WORKOUT_RATED: 10,
  STREAK_BONUS_PER_DAY: 5,
  POST_CREATED: 15,
  POST_LIKED: 2,
  COMMENT_MADE: 5,
  FAVORITE_ADDED: 3,
  ONBOARDING_COMPLETED: 100,
  FIRST_WORKOUT: 200,
};

export const LEVELS = [
  { level: 1, name: 'Iniciante', xpRequired: 0, color: '#94A3B8', icon: 'seedling' },
  { level: 2, name: 'Aquecendo', xpRequired: 200, color: '#94A3B8', icon: 'flash' },
  { level: 3, name: 'Dedicado', xpRequired: 500, color: '#00E676', icon: 'flame' },
  { level: 4, name: 'Focado', xpRequired: 1000, color: '#00E676', icon: 'rocket' },
  { level: 5, name: 'Atleta', xpRequired: 2000, color: '#FFD600', icon: 'trophy' },
  { level: 6, name: 'Guerreiro', xpRequired: 3500, color: '#FFD600', icon: 'shield' },
  { level: 7, name: 'Mestre', xpRequired: 5000, color: '#FF6B35', icon: 'diamond' },
  { level: 8, name: 'Lenda', xpRequired: 7500, color: '#FF6B35', icon: 'skull' },
  { level: 9, name: 'Lendário', xpRequired: 10000, color: '#CCFF00', icon: 'flash' },
  { level: 10, name: 'NOVAIX', xpRequired: 15000, color: '#CCFF00', icon: 'star' },
];

export const ACHIEVEMENTS = [
  // Streak
  { id: 'streak_3', name: 'Fogo Aceso', description: '3 dias seguidos treinando', icon: 'flame', color: '#FF6B35', category: 'streak', requirement: 3 },
  { id: 'streak_7', name: 'Semana Perfeita', description: '7 dias seguidos treinando', icon: 'flame', color: '#FF6B35', category: 'streak', requirement: 7 },
  { id: 'streak_14', name: 'Duas Semanas', description: '14 dias seguidos treinando', icon: 'flame', color: '#FFD600', category: 'streak', requirement: 14 },
  { id: 'streak_30', name: 'Mês de Ferro', description: '30 dias seguidos treinando', icon: 'flame', color: '#CCFF00', category: 'streak', requirement: 30 },
  { id: 'streak_60', name: 'Inabalável', description: '60 dias seguidos treinando', icon: 'flame', color: '#CCFF00', category: 'streak', requirement: 60 },
  { id: 'streak_100', name: 'Centenário', description: '100 dias seguidos treinando', icon: 'flame', color: '#CCFF00', category: 'streak', requirement: 100 },

  // Treinos
  { id: 'workout_1', name: 'Primeiro Treino', description: 'Complete seu primeiro treino', icon: 'trophy', color: '#FFD600', category: 'workout', requirement: 1 },
  { id: 'workout_5', name: 'Aquecendo', description: 'Complete 5 treinos', icon: 'barbell', color: '#00E676', category: 'workout', requirement: 5 },
  { id: 'workout_10', name: 'Dez Pra Um', description: 'Complete 10 treinos', icon: 'barbell', color: '#00E676', category: 'workout', requirement: 10 },
  { id: 'workout_25', name: 'Quinze Mais', description: 'Complete 25 treinos', icon: 'barbell', color: '#FFD600', category: 'workout', requirement: 25 },
  { id: 'workout_50', name: 'Meio Centenário', description: 'Complete 50 treinos', icon: 'barbell', color: '#FF6B35', category: 'workout', requirement: 50 },
  { id: 'workout_100', name: 'Centúrião', description: 'Complete 100 treinos', icon: 'trophy', color: '#CCFF00', category: 'workout', requirement: 100 },
  { id: 'workout_250', name: 'Máquina', description: 'Complete 250 treinos', icon: 'trophy', color: '#CCFF00', category: 'workout', requirement: 250 },
  { id: 'workout_500', name: 'Lenda Viva', description: 'Complete 500 treinos', icon: 'star', color: '#CCFF00', category: 'workout', requirement: 500 },

  // Tempo
  { id: 'time_60', name: 'Primeira Hora', description: 'Acumule 60 minutos', icon: 'time', color: '#94A3B8', category: 'time', requirement: 60 },
  { id: 'time_300', name: '5 Horas', description: 'Acumule 5 horas de treino', icon: 'time', color: '#00E676', category: 'time', requirement: 300 },
  { id: 'time_1000', name: 'Maratona', description: 'Acumule 1000 minutos (~16h)', icon: 'time', color: '#FFD600', category: 'time', requirement: 1000 },
  { id: 'time_5000', name: 'Ultra Atleta', description: 'Acumule 5000 minutos (~83h)', icon: 'time', color: '#FF6B35', category: 'time', requirement: 5000 },

  // Social
  { id: 'social_first_post', name: 'Primeira Postagem', description: 'Publique na comunidade', icon: 'chatbubble', color: '#00E676', category: 'social', requirement: 1 },
  { id: 'social_10_posts', name: 'Influencer', description: 'Publique 10 posts', icon: 'chatbubble', color: '#FFD600', category: 'social', requirement: 10 },
  { id: 'social_50_likes', name: 'Popular', description: 'Receba 50 curtidas', icon: 'heart', color: '#FF6B35', category: 'social', requirement: 50 },

  // Nível
  { id: 'level_3', name: 'Subindo de Nível', description: 'Alcance o nível 3', icon: 'trending-up', color: '#00E676', category: 'level', requirement: 3 },
  { id: 'level_5', name: 'Meio Caminho', description: 'Alcance o nível 5', icon: 'trending-up', color: '#FFD600', category: 'level', requirement: 5 },
  { id: 'level_7', name: 'Elite', description: 'Alcance o nível 7', icon: 'trending-up', color: '#FF6B35', category: 'level', requirement: 7 },
  { id: 'level_10', name: 'NOVAIX Supremo', description: 'Alcance o nível máximo', icon: 'star', color: '#CCFF00', category: 'level', requirement: 10 },
];

export function getLevelForXP(xp) {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getNextLevel(currentLevel) {
  const idx = LEVELS.findIndex(l => l.level === currentLevel.level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getXPProgress(xp) {
  const current = getLevelForXP(xp);
  const next = getNextLevel(current);
  if (!next) return { current, next: null, progress: 1, xpInLevel: 0, xpNeeded: 0 };

  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  const progress = Math.min(1, xpInLevel / xpNeeded);

  return { current, next, progress, xpInLevel, xpNeeded };
}

export function getUnlockedAchievements(userStats) {
  const unlocked = [];

  for (const achievement of ACHIEVEMENTS) {
    let value = 0;
    switch (achievement.category) {
      case 'streak': value = userStats.maxStreak || 0; break;
      case 'workout': value = userStats.totalWorkouts || 0; break;
      case 'time': value = userStats.totalMinutes || 0; break;
      case 'social': value = userStats[`${achievement.id}_count`] || 0; break;
      case 'level': value = userStats.level || 1; break;
    }
    if (value >= achievement.requirement) {
      unlocked.push(achievement);
    }
  }

  return unlocked;
}

export function checkNewAchievements(userStats, previouslyUnlocked) {
  const allUnlocked = getUnlockedAchievements(userStats);
  const previousIds = new Set(previouslyUnlocked.map(a => a.id));
  return allUnlocked.filter(a => !previousIds.has(a.id));
}
