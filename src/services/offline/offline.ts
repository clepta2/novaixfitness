// src/services/offline.ts
// Re-exportação do módulo unificado - mantido para compatibilidade
export {
  cacheWorkouts, getCachedWorkouts,
  cacheFavorites, getCachedFavorites,
  cacheProfile, getCachedProfile,
  cacheWorkoutDetail, getCachedWorkoutDetail, isWorkoutCached,
  cacheExerciseLogs, getCachedExerciseLogs,
  addPendingAction, getPendingActions, clearPendingAction, clearAllPendingActions,
  getLastSync, updateLastSync,
} from './offlineSync';
