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

export async function sendStreakNotification(days) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Streak de ${days} dias!`,
      body: 'Continue assim! Voce esta indo muito bem.',
      data: { type: 'streak' },
    },
    trigger: null,
  });
}

export async function sendAchievementNotification(achievementName) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nova conquista desbloqueada!',
      body: achievementName,
      data: { type: 'achievement' },
    },
    trigger: null,
  });
}

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

export async function clearAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
}

export function setupNotificationListeners(navigation) {
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.type === 'workout_reminder' || data?.type === 'workout_completed') {
      navigation?.navigate?.('(tabs)/home');
    }
  });
}
