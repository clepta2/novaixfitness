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

import { addPendingAction, getPendingActions, clearAllPendingActions } from './offline/offlineQueue';

export const queueAction = addPendingAction;
export const clearPendingActions = clearAllPendingActions;

export async function hasPendingActions(): Promise<boolean> {
  const actions = await getPendingActions();
  return actions.some(a => a.status === 'pending');
}

export async function getQueueStats() {
  const actions = await getPendingActions();
  return {
    pending: actions.filter(a => a.status === 'pending').length,
    syncing: actions.filter(a => a.status === 'syncing').length,
    failed: actions.filter(a => a.status === 'failed').length,
    total: actions.length,
  };
}
