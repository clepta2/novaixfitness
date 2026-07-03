// src/services/notifications/index.ts
// Exportações centralizadas de notificações

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
