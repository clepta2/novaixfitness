// src/config/app.ts
// Configuracoes gerais do app - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

interface PlanConfig {
  maxMessages: number;
  maxWorkouts: number;
}

interface NotificationType {
  icon: string;
  color: string;
  route: string | null;
  label: string;
  desc: string;
  group: string;
}

export const APP_CONFIG = {
  whatsappNumber: process.env.EXPO_PUBLIC_WHATSAPP_NUMBER || '',
  supportEmail: 'suporte@novaixfitness.com',
  appName: 'NOVAIX FITNESS',
  waterGoalDefault: 8,
  restTimerDefault: 60,

  // Limites por plano
  plans: {
    free: { maxMessages: 0, maxWorkouts: 3 } as PlanConfig,
    basic: { maxMessages: 0, maxWorkouts: 5 } as PlanConfig,
    intermediate: { maxMessages: 10, maxWorkouts: 10 } as PlanConfig,
    premium: { maxMessages: 20, maxWorkouts: 20 } as PlanConfig,
    ultra: { maxMessages: 50, maxWorkouts: 50 } as PlanConfig,
  },

  // Defaults do usuario
  userDefaults: {
    weight: 70,
    height: 170,
    age: 25,
    availableDays: 4,
    sessionDuration: 60,
  },

  // Periodizacao
  periodization: {
    weeksBetweenAdapts: 4,
    minSessionsForAdapt: 6,
    deloadWeekEvery: 4,
    maxSets: 6,
    minSets: 2,
    incrementStep: 2.5,
  },

  // Limites de UI
  ui: {
    homePollingInterval: 60000,
    defaultWorkoutDuration: 30,
    defaultRestTime: 60,
    defaultReps: '10-12',
    defaultSets: 4,
    maxRecentWorkouts: 3,
    maxFeedPosts: 20,
    analyticsWeeksHistory: 52,
    analyticsMonthsHistory: 6,
  },

  // Videos fallback
  videos: {
    fallbackId: null,
    fallbackLabel: 'Video indisponivel',
  },

  notifications: {
    workoutReminder: { hour: 19, minute: 0 },
    weeklyPlan: { weekday: 1, hour: 8, minute: 0 },
    restDay: { weekday: 3, hour: 10, minute: 0 },
    streakMessages: {
      3: 'Voce esta pegando fogo! 3 dias seguidos!',
      7: 'Uma semana completa! Voce e incrivel!',
      14: 'Duas semanas! Nada pode te parar!',
      30: 'Um mes inteiro! Voce e uma maquina!',
      60: 'Dois meses! Lenda absoluta!',
      100: '100 dias! Voce e inspiracao!',
    },
    motivationalTips: [
      'Consistencia e a chave! Continue treinando.',
      'Cada treino te aproxima do seu objetivo.',
      'Seu corpo agradece cada gota de suor.',
      'Disciplina e mais forte que motivacao.',
      'Hoje e um bom dia para superar seus limites.',
      'Nao pare quando esta cansado, pare quando terminar.',
      'O segredo do progresso e comecar.',
    ],
    types: {
      workout_reminder: { icon: 'alarm', color: COLORS.attention, route: 'HOME', label: 'Lembrete de Treino', desc: 'Avisar na hora do treino', group: 'treino' } as NotificationType,
      workout_completed: { icon: 'checkmark-circle', color: COLORS.success, route: 'HOME', label: 'Treino Concluido', desc: 'Confirmar conclusao do treino', group: 'treino' } as NotificationType,
      new_workout: { icon: 'barbell', color: COLORS.primary, route: 'HOME', label: 'Novo Treino', desc: 'Avisar quando novos treinos chegarem', group: 'treino' } as NotificationType,
      streak: { icon: 'flame', color: COLORS.secondary, route: 'PROFILE', label: 'Streak', desc: 'Marcos de dias seguidos', group: 'progresso' } as NotificationType,
      achievement: { icon: 'trophy', color: COLORS.attention, route: 'PROFILE', label: 'Conquistas', desc: 'Conquistas desbloqueadas', group: 'progresso' } as NotificationType,
      level_up: { icon: 'trending-up', color: COLORS.primary, route: 'PROFILE', label: 'Subida de Nivel', desc: 'Quando alcancar novo nivel', group: 'progresso' } as NotificationType,
      weekly_plan: { icon: 'calendar', color: COLORS.success, route: 'LIBRARY', label: 'Plano Semanal', desc: 'Lembrete do plano da semana', group: 'lembretes' } as NotificationType,
      weekly_summary: { icon: 'stats-chart', color: COLORS.success, route: 'HOME', label: 'Resumo Semanal', desc: 'Resumo de atividades', group: 'lembretes' } as NotificationType,
      rest_day: { icon: 'bed', color: COLORS.textDescription, route: null, label: 'Dia de Descanso', desc: 'Lembrete de recuperacao', group: 'lembretes' } as NotificationType,
      motivational: { icon: 'bulb', color: COLORS.attention, route: null, label: 'Motivacao', desc: 'Dicas e motivacao diaria', group: 'lembretes' } as NotificationType,
      system: { icon: 'information-circle', color: COLORS.textDescription, route: null, label: 'Sistema', desc: 'Notificacoes importantes do app', group: 'lembretes' } as NotificationType,
    },
    defaultPrefs: {
      workout_reminder: true,
      workout_completed: true,
      new_workout: true,
      streak: true,
      achievement: true,
      level_up: true,
      weekly_plan: true,
      weekly_summary: true,
      rest_day: false,
      motivational: true,
      system: true,
    },
  },

  // Links externos
  links: {
    youtube: 'https://youtube.com/@novaixfitness',
    instagram: 'https://instagram.com/novaixfitness',
    tiktok: 'https://tiktok.com/@novaixfitness',
    website: 'https://novaixfitness.com',
    terms: 'https://novaixfitness.com/termos',
    privacy: 'https://novaixfitness.com/privacidade',
  },

  // APIs
  apis: {
    geminiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  },
};

export type PlanType = keyof typeof APP_CONFIG.plans;
export type NotificationTypeKey = keyof typeof APP_CONFIG.notifications.types;
