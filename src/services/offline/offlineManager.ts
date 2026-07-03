// src/services/offlineManager.ts
// Re-exportação do módulo unificado - mantido para compatibilidade
export {
  isOnline,
  cacheWorkoutsForUser,
  cacheDailyWorkout, getCachedDailyWorkout,
  cacheLibrary, getCachedLibrary,
  queueWorkoutCompletion, queueFavoriteAction,
  syncPendingActions as syncPendingData,
  getCachedWorkouts, getCachedWorkoutDetail, cacheWorkoutDetail, getPendingActions,
} from './offlineSync';
