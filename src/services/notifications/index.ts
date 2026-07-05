// src/services/notifications/index.ts
// Exportações centralizadas de notificações

import { registerForPushNotificationsAsync } from './pushNotifications';
import { cancelAllScheduled, getActiveReminders } from './notificationScheduler';

export {
  sendWorkoutCompletedNotification,
  sendStreakNotification,
  sendAchievementNotification,
  sendLevelUpNotification,
  sendNewWorkoutNotification,
  sendWeeklySummaryNotification,
  sendRestReminder,
  sendMotivationalNotification,
  sendWorkoutReminder,
} from './notifications-sender';

export {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
} from './notifications-real';

export {
  setupWorkoutReminders,
  sendStreakProtectionReminder,
  sendPostWorkoutReminder,
  sendWeeklySummaryReminder,
  scheduleHydrationReminder,
  cancelAllScheduled,
  cancelAllWorkoutReminders,
  getActiveReminders,
  setupNotificationListeners,
  saveNotificationToDB,
  getUnreadCount,
} from './notificationScheduler';

export { getPrefsForSettings, setNotificationPref, getNotificationPrefs } from './notificationPrefs';

export {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseListener,
} from './pushNotifications';

export {
  scheduleWorkoutReminder,
  scheduleWeeklyPlanReminder,
  scheduleRestDayReminder,
} from './notifications';

// Aliases para compatibilidade com testes
export async function requestNotificationPermission(): Promise<boolean> {
  const token = await registerForPushNotificationsAsync(undefined);
  return token !== null;
}

export const clearAllNotifications = cancelAllScheduled;
export const getScheduledNotifications = getActiveReminders;
