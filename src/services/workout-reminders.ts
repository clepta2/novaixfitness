// src/services/workout-reminders.ts
// Re-export shim → workout/workout-reminders.ts

export {
  setupWorkoutReminders,
  sendStreakProtectionReminder,
  sendPostWorkoutReminder,
  sendWeeklySummaryReminder,
  scheduleHydrationReminder,
  cancelAllWorkoutReminders,
  getActiveReminders,
  requestNotificationPermissions,
} from './workout/workout-reminders';
