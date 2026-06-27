// src/config/app.js
// Configuracoes gerais do app - NOVAIX FITNESS

export const APP_CONFIG = {
  whatsappNumber: '5511999999999',
  supportEmail: 'suporte@novaixfitness.com',
  appName: 'NOVAIX FITNESS',
  waterGoalDefault: 8,
  restTimerDefault: 60,

  // Limites por plano
  plans: {
    free: { maxMessages: 0, maxWorkouts: 3 },
    basic: { maxMessages: 0, maxWorkouts: 5 },
    intermediate: { maxMessages: 10, maxWorkouts: 10 },
    premium: { maxMessages: 20, maxWorkouts: 20 },
    ultra: { maxMessages: 50, maxWorkouts: 50 },
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
      workout_reminder: { icon: 'alarm', color: '#FFD600', route: 'HOME', label: 'Lembrete de Treino', desc: 'Avisar na hora do treino', group: 'treino' },
      workout_completed: { icon: 'checkmark-circle', color: '#00E676', route: 'HOME', label: 'Treino Concluido', desc: 'Confirmar conclusao do treino', group: 'treino' },
      new_workout: { icon: 'barbell', color: '#CCFF00', route: 'HOME', label: 'Novo Treino', desc: 'Avisar quando novos treinos chegarem', group: 'treino' },
      streak: { icon: 'flame', color: '#FF6B35', route: 'PROFILE', label: 'Streak', desc: 'Marcos de dias seguidos', group: 'progresso' },
      achievement: { icon: 'trophy', color: '#FFD600', route: 'PROFILE', label: 'Conquistas', desc: 'Conquistas desbloqueadas', group: 'progresso' },
      level_up: { icon: 'trending-up', color: '#CCFF00', route: 'PROFILE', label: 'Subida de Nivel', desc: 'Quando alcancar novo nivel', group: 'progresso' },
      weekly_plan: { icon: 'calendar', color: '#00E676', route: 'LIBRARY', label: 'Plano Semanal', desc: 'Lembrete do plano da semana', group: 'lembretes' },
      weekly_summary: { icon: 'stats-chart', color: '#00E676', route: 'HOME', label: 'Resumo Semanal', desc: 'Resumo de atividades', group: 'lembretes' },
      rest_day: { icon: 'bed', color: '#94A3B8', route: null, label: 'Dia de Descanso', desc: 'Lembrete de recuperacao', group: 'lembretes' },
      motivational: { icon: 'bulb', color: '#FFD600', route: null, label: 'Motivacao', desc: 'Dicas e motivacao diaria', group: 'lembretes' },
      system: { icon: 'information-circle', color: '#94A3B8', route: null, label: 'Sistema', desc: 'Notificacoes importantes do app', group: 'lembretes' },
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
};
