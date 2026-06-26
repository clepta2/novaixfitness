// src/services/notifications.js
// Servico de notificacoes push - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function registerForPushNotifications(userId) {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  const token = await Notifications.getExpoPushTokenAsync();
  const pushToken = token.data;

  if (userId && pushToken) {
    await supabase
      .from('profiles')
      .update({ push_token: pushToken })
      .eq('id', userId);
  }

  return pushToken;
}

// ========================================
// AGENDAMENTO DE LEMBRETES
// ========================================

export async function scheduleWorkoutReminder(hour = 19, minute = 0) {
  await Notifications.cancelScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de treinar!',
      body: 'Seu streak esta em risco! Nao esqueca do treino de hoje.',
      data: { type: 'workout_reminder' },
    },
    trigger: { hour, minute, repeats: true },
  });
}

export async function scheduleWeeklyPlanReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Seu plano da semana esta pronto!',
      body: 'Novos treinos disponiveis. Confira seu cronograma.',
      data: { type: 'weekly_plan' },
    },
    trigger: { weekday: 1, hour: 8, minute: 0, repeats: true },
  });
}

export async function scheduleRestDayReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Dia de descanso',
      body: 'Recuperacao e importante! Volte amanhã com tudo.',
      data: { type: 'rest_day' },
    },
    trigger: { weekday: 3, hour: 10, minute: 0, repeats: true },
  });
}

// ========================================
// NOTIFICACOES IMEDIATAS
// ========================================

export async function sendWorkoutCompletedNotification(workoutName, xpGained) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Treino concluido!',
      body: `${workoutName} finalizado. +${xpGained} XP ganho!`,
      data: { type: 'workout_completed' },
    },
    trigger: null,
  });
}

export async function sendStreakNotification(days) {
  const messages = {
    3: 'Voce esta pegando fogo! 3 dias seguidos!',
    7: 'Uma semana completa! Voce e incrivel!',
    14: 'Duas semanas! Nada pode te parar!',
    30: 'Um mes inteiro! Voce e uma maquina!',
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Streak de ${days} dias!`,
      body: messages[days] || 'Continue assim! Voce esta indo muito bem.',
      data: { type: 'streak', days },
    },
    trigger: null,
  });
}

export async function sendAchievementNotification(achievementName, xpReward) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Conquista desbloqueada!',
      body: `${achievementName} +${xpReward} XP`,
      data: { type: 'achievement', name: achievementName },
    },
    trigger: null,
  });
}

export async function sendLevelUpNotification(levelName, newLevel) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Nivel ${newLevel}!`,
      body: `Parabens! Voce alcancou o nivel ${levelName}!`,
      data: { type: 'level_up', level: newLevel },
    },
    trigger: null,
  });
}

export async function sendNewWorkoutNotification(workoutName) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Novo treino disponivel!',
      body: `${workoutName} acabou de chegar. Confira agora!`,
      data: { type: 'new_workout' },
    },
    trigger: null,
  });
}

export async function sendWeeklySummaryNotification(workoutsCompleted, minutesTrained) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Resumo da semana',
      body: `${workoutsCompleted} treinos, ${minutesTrained} minutos. Continue firme!`,
      data: { type: 'weekly_summary' },
    },
    trigger: null,
  });
}

export async function sendRestReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tempo de descanso!',
      body: 'Beba agua e prepare-se para o proximo exercicio.',
      data: { type: 'rest_reminder' },
    },
    trigger: null,
  });
}

export async function sendMotivationalNotification() {
  const tips = [
    'Consistencia e a chave! Continue treinando.',
    'Cada treino te aproxima do seu objetivo.',
    'Seu corpo agradece cada gota de suor.',
    'Disciplina e mais forte que motivacao.',
    'Hoje e um bom dia para superar seus limites.',
  ];

  const tip = tips[Math.floor(Math.random() * tips.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Motivacao do dia',
      body: tip,
      data: { type: 'motivational' },
    },
    trigger: null,
  });
}

// ========================================
// GERENCIAMENTO
// ========================================

export async function clearAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
}

export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

export function setupNotificationListeners(navigation) {
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    handleNotificationNavigation(data, navigation);
  });
}

function handleNotificationNavigation(data, navigation) {
  switch (data?.type) {
    case 'workout_reminder':
    case 'workout_completed':
    case 'new_workout':
      navigation?.navigate?.('(tabs)/home');
      break;
    case 'weekly_plan':
      navigation?.navigate?.('(tabs)/library');
      break;
    case 'achievement':
    case 'level_up':
    case 'streak':
      navigation?.navigate?.('(tabs)/perfil');
      break;
    default:
      break;
  }
}
