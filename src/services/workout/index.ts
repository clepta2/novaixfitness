// src/services/workout/index.ts
// Exportações centralizadas de treinos

export { saveCompleteWorkout } from './workoutSaver';

export {
  setupWorkoutReminders,
  sendStreakProtectionReminder,
  sendPostWorkoutReminder,
  sendWeeklySummaryReminder,
  cancelAllWorkoutReminders,
  getActiveReminders,
  scheduleHydrationReminder,
  requestNotificationPermissions,
} from './workout-reminders';

export {
  generateWorkoutPlan,
  saveWorkoutPlan,
  getUserWorkoutPlan,
  generateMealPlan,
} from './planGenerator';

export {
  shouldAdaptPlan,
  analyzeUserPerformance,
  adaptWorkoutPlan,
  saveAdaptation,
  getAdaptationReason,
} from './planAdaptation';

export {
  loadWeeklyPlan,
  saveWeeklyPlan,
  updateDayPlan,
} from './planService';
