// src/data/weekPlan.js
// Dados do planejamento semanal - NOVAIX FITNESS

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_NAMES_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const DAY_NAMES_FULL = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export const defaultWeekPlan = {
  mon: { workoutId: '1', workoutName: 'Peito e Tríceps', duration: 50, category: 'MUSCULAÇÃO', isRest: false },
  tue: { workoutId: '2', workoutName: 'HIIT Queima 30\'', duration: 30, category: 'CARDIO', isRest: false },
  wed: { workoutId: '3', workoutName: 'Costas e Bíceps', duration: 50, category: 'MUSCULAÇÃO', isRest: false },
  thu: { workoutId: null, workoutName: null, duration: 0, category: null, isRest: true },
  fri: { workoutId: '1', workoutName: 'Pernas e Glúteos', duration: 55, category: 'MUSCULAÇÃO', isRest: false },
  sat: { workoutId: '2', workoutName: 'Cardio Leve', duration: 25, category: 'CARDIO', isRest: false },
  sun: { workoutId: null, workoutName: null, duration: 0, category: null, isRest: true },
};

export const CATEGORY_COLORS = {
  'MUSCULAÇÃO': '#6366F1',
  CARDIO: '#FF6B35',
  CALISTENIA: '#00E676',
  FLEXIBILIDADE: '#8B5CF6',
};
