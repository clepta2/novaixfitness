// src/services/offlineSync.ts
// Re-export shim → src/services/offline/offlineSync.ts

export {
  cacheWorkouts, getCachedWorkouts, cacheWorkoutDetail, getCachedWorkoutDetail,
  isWorkoutCached, cacheFavorites, getCachedFavorites, cacheProfile, getCachedProfile,
  cacheLibrary, getCachedLibrary, cacheDailyWorkout, getCachedDailyWorkout,
  cacheWorkoutsForUser, cacheExerciseLogs, getCachedExerciseLogs,
} from './offline/offlineCache';

export {
  addPendingAction, getPendingActions, clearAllPendingActions,
} from './offline/offlineQueue';

export {
  syncPendingActions, updateLastSync, getLastSync, startAutoSync, stopAutoSync,
  forceSyncNow, queueWorkoutCompletion, queueFavoriteAction, isOnline,
} from './offline/offlineSync';
