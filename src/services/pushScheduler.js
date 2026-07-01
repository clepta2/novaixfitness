// src/services/pushScheduler.js
// Agendador de push notifications - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { sendPushNotification, sendPushToUser } from './pushNotifications';
import { APP_CONFIG } from '../config/app';

const { streakMessages } = APP_CONFIG.notifications;

export async function scheduleWorkoutReminder(pushToken, hour, minute, workoutName) {
  const h = hour ?? 19;
  const m = minute ?? 0;
  const name = workoutName || 'seu treino';

  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de treinar!',
      body: `Bora! ${name} esta te esperando. Seu streak esta em risco!`,
      data: { type: 'workout_reminder' },
      sound: true,
    },
    trigger: { hour: h, minute: m, repeats: true, channelId: 'default' },
  });
}

export async function scheduleStreakReminder(userId, pushToken, streakDays) {
  const message = streakMessages[streakDays]
    || `Parabens! ${streakDays} dias seguidos treinando! Continue assim!`;

  await sendPushNotification(pushToken, `Streak de ${streakDays} dias!`, message, {
    type: 'streak',
    streak_days: streakDays,
  });
}

export async function scheduleWeeklySummary(userId, pushToken, stats) {
  const { workoutsCompleted = 0, minutesTrained = 0, streakDays = 0 } = stats || {};

  const body = `${workoutsCompleted} treinos · ${minutesTrained} min`
    + (streakDays > 0 ? ` · ${streakDays} dias seguidos` : '')
    + '. Continue firme!';

  await sendPushNotification(pushToken, 'Resumo da semana', body, {
    type: 'weekly_summary',
  });
}

export async function scheduleNextDayReminder(userId, workoutName) {
  await sendPushToUser(userId, 'Treino de amanha', `Prepare-se! Amanha: ${workoutName}`, {
    type: 'workout_reminder',
  });
}

export async function cancelAllScheduled() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledCount() {
  if (Platform.OS === 'web') return 0;
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.length;
}
