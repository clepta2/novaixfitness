// src/services/workoutReminders.ts
// Serviço de lembretes de treino

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';

type TimePreference = 'morning' | 'afternoon' | 'night';

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleWorkoutReminder(userId: string, time: TimePreference, days: number[]): Promise<boolean> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const timeMap: Record<TimePreference, string> = { morning: '07:00', afternoon: '12:00', night: '18:00' };
  const timeStr = timeMap[time] || '07:00';
  const hour = parseInt(timeStr);
  const minute = parseInt(timeStr.split(':')[1]);

  for (const day of days) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Hora de treinar! 💪', body: 'Seu treino personalizado está esperando por você.', data: { type: 'workout_reminder' } },
      trigger: { weekday: day, hour, minute, repeats: true },
    });
  }
  return true;
}

export async function scheduleHydrationReminder(): Promise<void> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  for (let h = 8; h <= 20; h += 2) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Hora de beber água! 💧', body: 'Mantenha-se hidratado durante o dia.', data: { type: 'hydration' } },
      trigger: { hour: h, minute: 0, repeats: true },
    });
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}
