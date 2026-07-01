// src/services/workout-reminders.js
// Sistema de lembretes de treino - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { sendPushNotification, sendPushToUser } from './notifications';
import { APP_CONFIG } from '../config/app';

const { streakMessages } = APP_CONFIG.notifications;

function getRestDays(workoutDays) {
  const allDays = [1, 2, 3, 4, 5, 6, 7];
  return allDays.filter(d => !workoutDays.includes(d));
}

function getMotivationalMessage() {
  const messages = [
    'Cada treino te aproxima do seu objetivo!',
    'Disciplina e mais forte que motivacao.',
    'Seu corpo agradece cada gota de suor.',
    'Hoje e um bom dia para superar seus limites.',
    'A consistencia e a chave do sucesso.',
    'Nao pare agora! Voce esta indo muito bem.',
    'O unico treino ruim e o que nao aconteceu.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getWeeklyFeedback(count) {
  if (count >= 5) return 'Semana incrivel!';
  if (count >= 3) return 'Muito bem! Continue assim.';
  if (count >= 1) return 'Bom comeco! Tente treinar mais.';
  return 'Semana fraca. Volte com tudo!';
}


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
  const workoutDays = obv2?.days_per_week || [1, 3, 5];
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

export async function sendScheduledWorkoutReminder(pushToken, hour, minute, workoutName) {
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

export async function sendScheduledStreakReminder(userId, pushToken, streakDays) {
  const message = streakMessages[streakDays]
    || `Parabens! ${streakDays} dias seguidos treinando! Continue assim!`;

  await sendPushNotification(pushToken, `Streak de ${streakDays} dias!`, message, {
    type: 'streak',
    streak_days: streakDays,
  });
}

export async function sendScheduledWeeklySummary(userId, pushToken, stats) {
  const { workoutsCompleted = 0, minutesTrained = 0, streakDays = 0 } = stats || {};

  const body = `${workoutsCompleted} treinos · ${minutesTrained} min`
    + (streakDays > 0 ? ` · ${streakDays} dias seguidos` : '')
    + '. Continue firme!';

  await sendPushNotification(pushToken, 'Resumo da semana', body, {
    type: 'weekly_summary',
  });
}

export async function sendScheduledNextDayReminder(userId, workoutName) {
  await sendPushToUser(userId, 'Treino de amanha', `Prepare-se! Amanha: ${workoutName}`, {
    type: 'workout_reminder',
  });
}
