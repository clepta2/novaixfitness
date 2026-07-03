// src/data/weekPlan.ts
// Dados do planejamento semanal - NOVAIX FITNESS

export const DAY_KEYS: string[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_NAMES_SHORT: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const DAY_NAMES_FULL: string[] = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

interface WeekPlanDay {
  workoutId: string | null;
  workoutName: string | null;
  duration: number;
  category: string | null;
  isRest: boolean;
}

export const defaultWeekPlan: Record<string, WeekPlanDay> = {
  mon: { workoutId: '1', workoutName: 'Peito e Tríceps', duration: 50, category: 'MUSCULAÇÃO', isRest: false },
  tue: { workoutId: '2', workoutName: 'HIIT Queima 30\'', duration: 30, category: 'CARDIO', isRest: false },
  wed: { workoutId: '3', workoutName: 'Costas e Bíceps', duration: 50, category: 'MUSCULAÇÃO', isRest: false },
  thu: { workoutId: null, workoutName: null, duration: 0, category: null, isRest: true },
  fri: { workoutId: '1', workoutName: 'Pernas e Glúteos', duration: 55, category: 'MUSCULAÇÃO', isRest: false },
  sat: { workoutId: '2', workoutName: 'Cardio Leve', duration: 25, category: 'CARDIO', isRest: false },
  sun: { workoutId: null, workoutName: null, duration: 0, category: null, isRest: true },
};

export { CATEGORY_COLORS } from '../constants/categoryColors';
