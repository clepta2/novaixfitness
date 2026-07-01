// src/data/duels.ts
// Dados mock para duelos de treino - NOVAIX FITNESS

export const MOCK_DUELS = [
  {
    id: 'd1',
    challenger: { name: 'Jeferson Henrique', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100', progress: 12 },
    challenged: { name: 'Alex Silva', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100', progress: 8 },
    target: 15,
    workoutName: 'Supino Reto 🏋️',
    daysRemaining: 2
  },
  {
    id: 'd2',
    challenger: { name: 'Bruno Souza', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100', progress: 4 },
    challenged: { name: 'Você', avatar: null, progress: 6 },
    target: 10,
    workoutName: 'Abdominal Remador 🔥',
    daysRemaining: 4
  }
];
