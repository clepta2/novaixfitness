// src/services/workout-reminders.ts
// Re-exportação do agendador unificado - mantido para compatibilidade
export {
  setupWorkoutReminders,
  sendStreakProtectionReminder,
  sendPostWorkoutReminder,
  sendWeeklySummaryReminder,
  cancelAllScheduled as cancelAllWorkoutReminders,
  getActiveReminders,
  scheduleHydrationReminder,
} from '../notifications/notificationScheduler';

export async function requestNotificationPermissions() {
  const Notifications = await import('expo-notifications');
  const { status } = await Notifications.requestPermissionsAsync().catch(() => ({ status: 'denied' }));
  return status === 'granted';
}
