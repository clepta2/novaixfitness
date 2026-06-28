// src/services/workout-reminders.js
// Sistema de lembretes de treino - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { supabase } from '../config/supabase';
import { getRestDays, getMotivationalMessage, getWeeklyFeedback } from './reminder-helpers';


export async function setupWorkoutReminders(userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding, notification_settings')
    .eq('id', userId)
    .single();

  const { data: obv2 } = await supabase
    .from('onboarding_v2')
    .select('days_per_week')
    .eq('user_id', userId)
    .maybeSingle();

  if (!profile?.notification_settings?.workout_reminder) return;

  const settings = profile.notification_settings;
  const workoutDays = obv2?.days_per_week || profile.onboarding?.daysPerWeek || [1, 3, 5];
  const reminderTime = settings.reminder_time || '19:00';
  const [hour, minute] = reminderTime.split(':').map(Number);

  await Notifications.cancelScheduledNotificationsAsync();

  for (const day of workoutDays) {
    const adjustedDay = day === 0 ? 7 : day;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de treinar!',
        body: getMotivationalMessage(),
        data: { type: 'workout_reminder', day: adjustedDay },
      },
      trigger: {
        weekday: adjustedDay,
        hour,
        minute,
        repeats: true,
      },
    });
  }

  if (settings.rest_day) {
    const restDays = getRestDays(workoutDays);
    for (const day of restDays) {
      const adjustedDay = day === 0 ? 7 : day;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Dia de descanso',
          body: 'Recuperacao e essencial. Volte amanhã com energia!',
          data: { type: 'rest_day' },
        },
        trigger: {
          weekday: adjustedDay,
          hour: 10,
          minute: 0,
          repeats: true,
        },
      });
    }
  }

  if (settings.weekly_plan) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Seu plano da semana!',
        body: 'Confira os treinos desta semana no app.',
        data: { type: 'weekly_plan' },
      },
      trigger: {
        weekday: 1,
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
  }

  if (settings.motivational) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Foco no objetivo!',
        body: getMotivationalMessage(),
        data: { type: 'motivational' },
      },
      trigger: {
        weekday: 4,
        hour: 19,
        minute: 30,
        repeats: true,
      },
    });
  }
}

export async function sendStreakProtectionReminder(userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('notification_settings')
    .eq('id', userId)
    .single();

  if (!profile?.notification_settings?.streak) return;

  const { data: todayWorkout } = await supabase
    .from('user_workouts')
    .select('id')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completed_at', new Date().toISOString().split('T')[0])
    .limit(1);

  if (!todayWorkout?.length) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Seu streak esta em risco!',
        body: 'Voce ainda nao treinou hoje. Nao perca seu progresso!',
        data: { type: 'streak_reminder' },
      },
      trigger: null,
    });
  }
}

export async function sendPostWorkoutReminder(userId, workoutName) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Treino concluido!',
      body: `Excelente! Hidrate-se e descanse bem.`,
      data: { type: 'post_workout' },
    },
    trigger: null,
  });

  setTimeout(async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete pos-treino',
        body: 'Beba agua e coma algo proteico nas proximas 2 horas.',
        data: { type: 'recovery_reminder' },
      },
      trigger: null,
    });
  }, 3600000);
}

export async function sendWeeklySummaryReminder(userId) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const { data: workouts } = await supabase
    .from('user_workouts')
    .select('duration')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completed_at', weekStart.toISOString());

  const count = workouts?.length || 0;
  const minutes = workouts?.reduce((s, w) => s + (w.duration || 0), 0) || 0;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Resumo da semana',
      body: `${count} treinos, ${minutes} minutos. ${getWeeklyFeedback(count)}`,
      data: { type: 'weekly_summary' },
    },
    trigger: null,
  });
}

export async function cancelAllWorkoutReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getActiveReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.filter(n =>
    ['workout_reminder', 'rest_day', 'weekly_plan', 'motivational'].includes(n.content.data?.type)
  );
}

// Funções auxiliares movidas para reminder-helpers.js
