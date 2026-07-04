// src/services/notifications-sender.ts
// Re-export shim → notifications/notifications-sender.ts

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
} from './notifications/notifications-sender';
