// src/services/notificationScheduler.js
// Servico de agendamento de notificacoes - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { supabase } from '../config/supabase';
import type { NotificationTriggerInput } from 'expo-notifications';

const SCHEDULED_IDENTIFIERS = new Map<string, string[]>();

export async function scheduleWorkoutReminder(userId: string, hour: number, minute: number, days: number[]) {
  await cancelSchedByType(userId, 'workout_reminder');

  const identifiers: string[] = [];
  for (const day of days) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de treinar!',
        body: 'Seu treino de hoje esta esperando. Bora!',
        data: { type: 'workout_reminder' },
      },
      trigger: {
        weekday: day,
        hour,
        minute,
        repeats: true,
      } as NotificationTriggerInput,
    });
    identifiers.push(id);
  }

  SCHEDULED_IDENTIFIERS.set(`workout_reminder_${userId}`, identifiers);
  return identifiers;
}

export async function scheduleWeeklyPlanReminder(userId: string) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Novo plano da semana!',
      body: 'Seus treinos da semana estao prontos. Confira agora.',
      data: { type: 'weekly_plan' },
    },
    trigger: {
      weekday: 1,
      hour: 8,
      minute: 0,
      repeats: true,
    } as NotificationTriggerInput,
  });

  SCHEDULED_IDENTIFIERS.set(`weekly_plan_${userId}`, [id]);
  return id;
}

export async function scheduleStreakProtection(userId: string, streakDays: number) {
  if (streakDays < 3) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${streakDays} dias seguidos!`,
      body: 'Nao perca seu streak! Treine hoje para manter a sequencia.',
      data: { type: 'streak_reminder' },
    },
    trigger: {
      hour: 18,
      minute: 0,
      repeats: true,
    } as NotificationTriggerInput,
  });

  SCHEDULED_IDENTIFIERS.set(`streak_${userId}`, [id]);
  return id;
}

export async function scheduleWeeklySummary(userId: string) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Resumo da semana',
      body: 'Veja como foi seu desempenho esta semana.',
      data: { type: 'weekly_summary' },
    },
    trigger: {
      weekday: 0,
      hour: 20,
      minute: 0,
      repeats: true,
    } as NotificationTriggerInput,
  });

  SCHEDULED_IDENTIFIERS.set(`weekly_summary_${userId}`, [id]);
  return id;
}

export async function scheduleMotivational(userId: string, hour = 19, minute = 30) {
  const messages = [
    'Voce esta indo muito bem! Continue assim!',
    'Cada treino te leva mais perto do seu objetivo.',
    'A consistencia e a chave do sucesso.',
    'Seu corpo agradece cada esforco!',
  ];

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Mensagem do dia',
      body: messages[Math.floor(Math.random() * messages.length)],
      data: { type: 'motivational' },
    },
    trigger: {
      weekday: 2,
      hour,
      minute,
      repeats: true,
    } as NotificationTriggerInput,
  });

  SCHEDULED_IDENTIFIERS.set(`motivational_${userId}`, [id]);
  return id;
}

export async function cancelAllScheduled(userId: string) {
  const types = ['workout_reminder', 'weekly_plan', 'streak', 'weekly_summary', 'motivational'];
  for (const type of types) {
    await cancelSchedByType(userId, type);
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function cancelSchedByType(userId: string, type: string) {
  const key = `${type}_${userId}`;
  const ids = SCHEDULED_IDENTIFIERS.get(key);
  if (ids) {
    for (const id of ids) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    SCHEDULED_IDENTIFIERS.delete(key);
  }
}

export async function getScheduledReminders(userId: string) {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.filter(n => n.content.data?.type);
}

interface ReminderSettings {
  workoutReminder?: { enabled?: boolean; hour?: number; minute?: number; days?: number[] };
  weeklyPlan?: boolean;
  streakProtection?: boolean;
  streakDays?: number;
  weeklySummary?: boolean;
  motivational?: boolean;
}

export async function setupUserReminders(userId: string, settings: ReminderSettings) {
  await cancelAllScheduled(userId);

  if (settings.workoutReminder?.enabled) {
    const { hour, minute, days } = settings.workoutReminder;
    await scheduleWorkoutReminder(userId, hour || 19, minute || 0, days || [1, 2, 3, 4, 5]);
  }

  if (settings.weeklyPlan) {
    await scheduleWeeklyPlanReminder(userId);
  }

  if (settings.streakProtection) {
    await scheduleStreakProtection(userId, settings.streakDays || 0);
  }

  if (settings.weeklySummary) {
    await scheduleWeeklySummary(userId);
  }

  if (settings.motivational) {
    await scheduleMotivational(userId);
  }
}
