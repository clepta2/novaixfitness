// src/services/offline/index.ts
// Exportações centralizadas de offline

export {
  cacheWorkouts, getCachedWorkouts,
  cacheFavorites, getCachedFavorites,
  cacheProfile, getCachedProfile,
  cacheWorkoutDetail, getCachedWorkoutDetail, isWorkoutCached,
  cacheExerciseLogs, getCachedExerciseLogs,
  addPendingAction, getPendingActions, clearPendingAction, clearAllPendingActions,
  getLastSync, updateLastSync,
} from './offline';

export {
  isOnline,
  cacheWorkoutsForUser,
  cacheDailyWorkout, getCachedDailyWorkout,
  cacheLibrary, getCachedLibrary,
  queueWorkoutCompletion, queueFavoriteAction,
  syncPendingData,
} from './offlineManager';

export { syncPendingActions, getPendingActionsCount } from './offlineSync';

export { startAutoSync, stopAutoSync, forceSyncNow } from './autoSync';
