// src/services/notifications.ts
// Re-exportação do agendador unificado - mantido para compatibilidade

import * as Notifications from 'expo-notifications';
import { supabase } from '../../config/supabase';
import { APP_CONFIG } from '../../config/app';

export {
  sendWorkoutCompletedNotification,
  sendStreakNotification,
  sendAchievementNotification,
  sendLevelUpNotification,
  sendNewWorkoutNotification,
  sendWeeklySummaryNotification,
  sendRestReminder,
  sendMotivationalNotification,
} from './notifications-sender';

export { registerForPushNotificationsAsync } from './pushNotifications';

export {
  setupWorkoutReminders,
  sendStreakProtectionReminder,
  sendPostWorkoutReminder,
  sendWeeklySummaryReminder,
  scheduleHydrationReminder,
  cancelAllScheduled as clearAllNotifications,
  getActiveReminders as getScheduledNotifications,
  setupNotificationListeners,
  saveNotificationToDB,
  getUnreadCount,
} from './notificationScheduler';

const { workoutReminder, types } = APP_CONFIG.notifications;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleWorkoutReminder(hour?: number, minute?: number) {
  const h = hour ?? workoutReminder.hour;
  const m = minute ?? workoutReminder.minute;
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Hora de treinar!', body: 'Seu streak esta em risco!', data: { type: 'workout_reminder' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: h, minute: m },
  }).catch(() => {});
}

export async function scheduleWeeklyPlanReminder() {
  const { weekday, hour, minute } = APP_CONFIG.notifications.weeklyPlan;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Seu plano da semana esta pronto!', body: 'Novos treinos disponiveis.', data: { type: 'weekly_plan' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour, minute },
  }).catch(() => {});
}

export async function scheduleRestDayReminder() {
  const { weekday, hour, minute } = APP_CONFIG.notifications.restDay;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Dia de descanso', body: 'Recuperacao e importante!', data: { type: 'rest_day' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour, minute },
  }).catch(() => {});
}
