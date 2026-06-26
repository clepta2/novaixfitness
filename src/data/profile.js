// src/data/profile.js
// Dados do perfil do usuário - NOVAIX FITNESS

export const mockUserProfile = {
  id: '1',
  name: 'Carlos Silva',
  email: 'carlos@email.com',
  avatar: null,
  initials: 'CS',
  memberSince: '24/01/2026',
  stats: {
    streak: 5,
    totalWorkouts: 47,
    totalMinutes: 2350,
    favoriteWorkouts: 8,
  },
  physicalData: {
    height: 178,
    weight: 82,
    age: 28,
    imc: 25.9,
  },
  evolution: [
    { month: 'Jan', weight: 85 },
    { month: 'Fev', weight: 84 },
    { month: 'Mar', weight: 83 },
    { month: 'Abr', weight: 82.5 },
    { month: 'Mai', weight: 82 },
    { month: 'Jun', weight: 82 },
  ],
  recentWorkouts: [
    { id: '1', name: 'Peito e Tríceps', date: 'Hoje', duration: 50 },
    { id: '2', name: 'HIIT Queima', date: 'Ontem', duration: 30 },
    { id: '3', name: 'Pernas', date: 'Há 2 dias', duration: 45 },
  ],
  badges: [
    { id: '1', name: 'Streak 5 dias', icon: 'flame', color: '#FF6B35' },
    { id: '2', name: 'Primeiro treino', icon: 'trophy', color: '#FFD600' },
    { id: '3', name: '10 treinos', icon: 'barbell', color: '#CCFF00' },
  ],
};
