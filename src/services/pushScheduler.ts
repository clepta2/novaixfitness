// src/services/pushScheduler.ts
// Agendador de push notifications - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { sendPushNotification, sendPushToUser } from './pushNotifications';
import { APP_CONFIG } from '../config/app';

const { streakMessages } = APP_CONFIG.notifications;

interface WeeklyStats {
  workoutsCompleted?: number;
  minutesTrained?: number;
  streakDays?: number;
}

export async function scheduleWorkoutReminder(
  pushToken: string,
  hour?: number,
  minute?: number,
  workoutName?: string
): Promise<void> {
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

export async function scheduleStreakReminder(userId: string, pushToken: string, streakDays: number): Promise<void> {
  const message = streakMessages[streakDays as keyof typeof streakMessages]
    || `Parabens! ${streakDays} dias seguidos treinando! Continue assim!`;

  await sendPushNotification(pushToken, `Streak de ${streakDays} dias!`, message, {
    type: 'streak',
    streak_days: streakDays,
  });
}

export async function scheduleWeeklySummary(userId: string, pushToken: string, stats: WeeklyStats): Promise<void> {
  const { workoutsCompleted = 0, minutesTrained = 0, streakDays = 0 } = stats || {};

  const body = `${workoutsCompleted} treinos · ${minutesTrained} min`
    + (streakDays > 0 ? ` · ${streakDays} dias seguidos` : '')
    + '. Continue firme!';

  await sendPushNotification(pushToken, 'Resumo da semana', body, {
    type: 'weekly_summary',
  });
}

export async function scheduleAchievementUnlocked(
  userId: string,
  pushToken: string,
  achievementName: string
): Promise<void> {
  await sendPushNotification(pushToken, 'Nova conquista!', `Voce desbloqueou: ${achievementName}`, {
    type: 'achievement',
  });
}

export async function scheduleLevelUp(userId: string, pushToken: string, newLevel: number): Promise<void> {
  await sendPushNotification(pushToken, 'Subiu de nivel!', `Parabens! Voce agora e nivel ${newLevel}!`, {
    type: 'level_up',
    level: newLevel,
  });
}
