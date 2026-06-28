// src/data/achievements.js
// Conquistas e metas - DATA DRIVEN

function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
}

// function calcXP(base, multiplier) {
//   return Math.round(base * multiplier);
// }

export const ACHIEVEMENTS = [
  { name: 'Primeiro Treino', description: 'Complete 1 treino', icon: 'trophy', metric: 'totalWorkouts', target: 1, xpBase: 10 },
  { name: '5 Treinos', description: 'Complete 5 treinos', icon: 'trophy', metric: 'totalWorkouts', target: 5, xpBase: 15 },
  { name: '10 Treinos', description: 'Complete 10 treinos', icon: 'trophy', metric: 'totalWorkouts', target: 10, xpBase: 20 },
  { name: '25 Treinos', description: 'Complete 25 treinos', icon: 'trophy', metric: 'totalWorkouts', target: 25, xpBase: 30 },
  { name: '50 Treinos', description: 'Complete 50 treinos', icon: 'trophy', metric: 'totalWorkouts', target: 50, xpBase: 40 },
  { name: '100 Treinos', description: 'Complete 100 treinos', icon: 'trophy', metric: 'totalWorkouts', target: 100, xpBase: 50 },
  { name: '3 Dias Seguidos', description: 'Treine 3 dias seguidos', icon: 'flame', metric: 'streak', target: 3, xpBase: 10 },
  { name: '7 Dias Seguidos', description: 'Treine 7 dias seguidos', icon: 'flame', metric: 'streak', target: 7, xpBase: 20 },
  { name: '14 Dias Seguidos', description: 'Treine 14 dias seguidos', icon: 'flame', metric: 'streak', target: 14, xpBase: 30 },
  { name: '30 Dias Seguidos', description: 'Treine 30 dias seguidos', icon: 'flame', metric: 'streak', target: 30, xpBase: 50 },
  { name: 'Primeira Refeição', description: 'Registre 1 refeição', icon: 'restaurant', metric: 'totalMeals', target: 1, xpBase: 5 },
  { name: '7 Dias de Água', description: 'Beba água 7 dias seguidos', icon: 'water', metric: 'waterStreak', target: 7, xpBase: 15 },
  { name: 'Madrugador', description: 'Treine antes das 7h', icon: 'sunny', metric: 'earlyWorkouts', target: 1, xpBase: 5 },
  { id: 'night_owl', name: 'Coruja', description: 'Treine depois das 20h', icon: 'moon', metric: 'nightWorkouts', target: 1, xpBase: 5 },
].map(a => ({ ...a, id: generateId(a.name), xp: a.xpBase }));

export const GOAL_TYPES = [
  { id: 'workouts', label: 'Treinos', unit: 'treinos', icon: 'barbell' },
  { id: 'weight_loss', label: 'Perder peso', unit: 'kg', icon: 'trending-down' },
  { id: 'weight_gain', label: 'Ganhar peso', unit: 'kg', icon: 'trending-up' },
  { id: 'streak', label: 'Sequência', unit: 'dias', icon: 'flame' },
  { id: 'minutes', label: 'Minutos', unit: 'min', icon: 'time' },
];

export function getUnlockedAchievements(stats) {
  return ACHIEVEMENTS.filter(a => (stats[a.metric] || 0) >= a.target);
}

export function getNewAchievements(stats, unlockedIds) {
  return ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id) && (stats[a.metric] || 0) >= a.target);
}

