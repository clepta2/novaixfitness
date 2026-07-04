// src/services/workout-reminders.ts
// Re-export shim → workout/workout-reminders.ts

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
  requestNotificationPermissions,
  scheduleWorkoutReminder,
  scheduleWeeklyPlanReminder,
  scheduleRestDayReminder,
} from './workout/workout-reminders';
