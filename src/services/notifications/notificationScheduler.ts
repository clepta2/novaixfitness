// src/services/notificationScheduler.ts
// Agendador de notificações - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../../config/supabase';
import { getMotivationalMessage, getRestDays, getWeeklyFeedback } from '../reminder-helpers';
import { tryIf } from '../../utils/tryIf';

type NotificationTriggerInput = Notifications.NotificationTriggerInput;

const scheduledIds = new Map<string, string[]>();

// ═══════════════════════════════════════════
// Helpers internos
// ═══════════════════════════════════════════

async function schedule(title: string, body: string, type: string, trigger: NotificationTriggerInput): Promise<string | null> {
  const result = await tryIf(async () => {
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { type } },
      trigger,
    });
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) {
    return result.data;
  } else {
    return null;
  }
}

function trackId(type: string, userId: string, id: string) {
  const key = `${userId}:${type}`;
  const ids = scheduledIds.get(key) || [];
  ids.push(id);
  scheduledIds.set(key, ids);
}

async function cancelByType(userId: string, type: string) {
  const key = `${userId}:${type}`;
  const ids = scheduledIds.get(key) || [];
  for (const id of ids) {
    await tryIf(async () => {
      await Notifications.cancelScheduledNotificationAsync(id);
    }, { retries: 1, baseDelay: 500 });
  }
  scheduledIds.delete(key);
}

// ═══════════════════════════════════════════
// Agendamentos do usuário
// ═══════════════════════════════════════════

export async function setupWorkoutReminders(userId: string) {
  const profileResult = await tryIf(async () => {
    const result = await supabase.from('profiles').select('notification_settings').eq('id', userId).single();
    return result.data;
  }, { retries: 1, baseDelay: 500 });
  const profile = profileResult.ok ? profileResult.data : null;

  const obv2Result = await tryIf(async () => {
    const result = await supabase.from('onboarding_v2').select('days_per_week').eq('user_id', userId).maybeSingle();
    return result.data;
  }, { retries: 1, baseDelay: 500 });
  const obv2 = obv2Result.ok ? obv2Result.data : null;

  if (!profile?.notification_settings?.workout_reminder) return;
  const settings = profile.notification_settings;
  const workoutDays = obv2?.days_per_week || [1, 3, 5];
  const reminderTime = settings.reminder_time || '19:00';
  const [hour, minute] = reminderTime.split(':').map(Number);

  await cancelByType(userId, 'workout_reminder');

  for (const day of workoutDays) {
    const adjusted = day === 0 ? 7 : day;
    const id = await schedule('Hora de treinar!', getMotivationalMessage(), 'workout_reminder', {
      weekday: adjusted, hour, minute, repeats: true,
    } as NotificationTriggerInput);
    if (id) trackId('workout_reminder', userId, id);
  }

  if (settings.rest_day) {
    for (const day of getRestDays(workoutDays)) {
      const adjusted = day === 0 ? 7 : day;
      const id = await schedule('Dia de descanso', 'Recuperacao e essencial.', 'rest_day', {
        weekday: adjusted, hour: 10, minute: 0, repeats: true,
      } as NotificationTriggerInput);
      if (id) trackId('rest_day', userId, id);
    }
  }

  if (settings.weekly_plan) {
    const id = await schedule('Plano semanal!', 'Confira os treinos desta semana.', 'weekly_plan', {
      weekday: 1, hour: 8, minute: 0, repeats: true,
    } as NotificationTriggerInput);
    if (id) trackId('weekly_plan', userId, id);
  }

  if (settings.motivational) {
    const id = await schedule('Foco no objetivo!', getMotivationalMessage(), 'motivational', {
      weekday: 4, hour: 19, minute: 30, repeats: true,
    } as NotificationTriggerInput);
    if (id) trackId('motivational', userId, id);
  }
}

// ═══════════════════════════════════════════
// Notificações pontuais
// ═══════════════════════════════════════════

export async function sendStreakProtectionReminder(userId: string) {
  const profileResult = await tryIf(async () => {
    const result = await supabase.from('profiles').select('notification_settings').eq('id', userId).single();
    return result.data;
  }, { retries: 1, baseDelay: 500 });
  const profile = profileResult.ok ? profileResult.data : null;

  if (!profile?.notification_settings?.streak) return;

  const todayResult = await tryIf(async () => {
    const result = await supabase.from('user_workouts').select('id').eq('user_id', userId)
      .eq('completed', true).gte('completed_at', new Date().toISOString().split('T')[0]).limit(1);
    return result.data;
  }, { retries: 1, baseDelay: 500 });
  const todayWorkout = todayResult.ok ? todayResult.data : null;

  if (!todayWorkout?.length) {
    await schedule('Seu streak esta em risco!', 'Voce ainda nao treinou hoje.', 'streak_reminder', null as any);
  }
}

export async function sendPostWorkoutReminder(userId: string, workoutName: string) {
  await schedule('Treino concluido!', 'Hidrate-se e descanse bem.', 'post_workout', null as any);
  setTimeout(() => {
    schedule('Lembrete pos-treino', 'Beba agua e coma algo proteico.', 'recovery_reminder', null as any);
  }, 3600000);
}

export async function sendWeeklySummaryReminder(userId: string) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const workoutsResult = await tryIf(async () => {
    const result = await supabase.from('user_workouts').select('duration').eq('user_id', userId)
      .eq('completed', true).gte('completed_at', weekStart.toISOString());
    return result.data;
  }, { retries: 1, baseDelay: 500 });
  const workouts = workoutsResult.ok ? workoutsResult.data : null;

  const count = workouts?.length || 0;
  const minutes = workouts?.reduce((s: number, w: any) => s + (w.duration || 0), 0) || 0;

  await schedule('Resumo da semana', `${count} treinos, ${minutes} min. ${getWeeklyFeedback(count)}`, 'weekly_summary', null as any);
}

export async function scheduleHydrationReminder() {
  let status = 'denied';
  const permResult = await tryIf(async () => {
    return await Notifications.requestPermissionsAsync();
  }, { retries: 1, baseDelay: 500 });
  if (permResult.ok) {
    status = permResult.data.status;
  }
  if (status !== 'granted') return;

  for (let h = 8; h <= 20; h += 2) {
    await schedule('Hora de beber agua!', 'Mantenha-se hidratado.', 'hydration', {
      hour: h, minute: 0, repeats: true,
    } as NotificationTriggerInput);
  }
}

// ═══════════════════════════════════════════
// Cancelamento
// ═══════════════════════════════════════════

export async function cancelAllScheduled() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  scheduledIds.clear();
}

export async function cancelAllWorkoutReminders(userId: string) {
  await cancelByType(userId, 'workout_reminder');
  await cancelByType(userId, 'rest_day');
  await cancelByType(userId, 'weekly_plan');
  await cancelByType(userId, 'motivational');
}

export async function getActiveReminders() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.filter(n => {
    const type = n.content.data?.type;
    return ['workout_reminder', 'rest_day', 'weekly_plan', 'motivational', 'hydration'].includes(type as string);
  });
}

// ═══════════════════════════════════════════
// Funções auxiliares re-exportadas
// ═══════════════════════════════════════════

export function setupNotificationListeners(navigation: any) {
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    const type = data?.type as string;
    if (type && navigation?.navigate) {
      const routeMap: Record<string, string> = {
        workout_reminder: '/(tabs)/home',
        streak: '/(tabs)/perfil',
        achievement: '/(tabs)/perfil',
        level_up: '/(tabs)/perfil',
      };
      if (routeMap[type]) navigation.navigate(routeMap[type]);
    }
  });
}

export async function saveNotificationToDB(userId: string, type: string, title: string, body: string, data: any = {}) {
  if (!userId) return;
  await tryIf(async () => {
    await supabase.from('notifications').insert({ user_id: userId, type, title, body, data });
  }, { retries: 3, baseDelay: 1000 });
}

export { getUnreadCount } from './notifications-real';
