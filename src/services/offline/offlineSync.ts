// src/services/offline/offlineSync.ts
// Sistema offline unificado: sync + auto-sync + shortcuts - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../config/supabase';
import { tryIf } from '../../utils/tryIf';
import { getQueue, saveQueue, clearPendingAction, getPendingActionsCount } from './offlineQueue';

// Re-exports de cache e queue
export { cacheWorkouts, getCachedWorkouts, cacheWorkoutDetail, getCachedWorkoutDetail, isWorkoutCached, cacheFavorites, getCachedFavorites, cacheProfile, getCachedProfile, cacheLibrary, getCachedLibrary, cacheDailyWorkout, getCachedDailyWorkout, cacheWorkoutsForUser, cacheExerciseLogs, getCachedExerciseLogs } from './offlineCache';
export { addPendingAction, getPendingActions, clearAllPendingActions } from './offlineQueue';

const SYNC_KEY = '@novaix:last_sync';
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const DEBOUNCE_MS = 300;

// ═══════════════════════════════════════════
// SINCRONIZAÇÃO
// ═══════════════════════════════════════════

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try { return await fn(); }
    catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, BASE_DELAY * Math.pow(2, attempt)));
    }
  }
  throw new Error('unreachable');
}

async function executeAction(action: { type: string; userId?: string; workoutId?: string; completedAt?: string; duration?: number; weight?: number; recordedAt?: string; amount?: number; userWorkoutId?: string; exerciseName?: string; setNumber?: number; repsDone?: number; weightKg?: number; [key: string]: unknown }) {
  switch (action.type) {
    case 'ADD_FAVORITE':
      await supabase.from('favorites').upsert({ user_id: action.userId, workout_id: action.workoutId }, { onConflict: 'user_id,workout_id' });
      break;
    case 'REMOVE_FAVORITE':
      await supabase.from('favorites').delete().eq('user_id', action.userId).eq('workout_id', action.workoutId);
      break;
    case 'COMPLETE_WORKOUT':
      await supabase.from('user_workouts').upsert({
        user_id: action.userId, workout_id: action.workoutId,
        completed: true, completed_at: action.completedAt, duration: action.duration,
      }, { onConflict: 'user_id,workout_id' });
      break;
    case 'UPDATE_WEIGHT':
      await supabase.from('weight_logs').insert({ user_id: action.userId, weight: action.weight, recorded_at: action.recordedAt });
      break;
    case 'UPDATE_WATER':
      await supabase.from('water_logs').insert({ user_id: action.userId, amount_ml: action.amount, recorded_at: action.recordedAt });
      break;
    case 'ADD_EXERCISE_LOG':
      await supabase.from('user_exercise_logs').insert({
        user_workout_id: action.userWorkoutId, exercise_name: action.exerciseName,
        set_number: action.setNumber, reps_done: action.repsDone, weight_kg: action.weightKg,
      });
      break;
    default:
      break;
  }
}

export async function syncPendingActions() {
  const queue = await getQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  let synced = 0, failed = 0;
  for (const action of queue) {
    const execResult = await tryIf(async () => {
      await retryWithBackoff(() => executeAction(action));
      await clearPendingAction(action.id);
      return true;
    }, { retries: 1, baseDelay: 500 });
    if (execResult.ok) {
      synced++;
    } else {
      action.retries = (action.retries || 0) + 1;
      if (action.retries >= MAX_RETRIES) { await clearPendingAction(action.id); failed++; }
      else { await saveQueue(queue); }
    }
  }

  if (synced > 0) await AsyncStorage.setItem(SYNC_KEY, Date.now().toString()).catch(() => {});
  return { synced, failed };
}

export async function updateLastSync() {
  await AsyncStorage.setItem(SYNC_KEY, Date.now().toString()).catch(() => {});
}

export async function getLastSync() {
  const raw = await AsyncStorage.getItem(SYNC_KEY).catch(() => null);
  return raw ? parseInt(raw, 10) : null;
}

// ═══════════════════════════════════════════
// AUTO-SYNC (escuta mudança de rede)
// ═══════════════════════════════════════════

let netUnsubscribe: (() => void) | null = null;
let lastConnectedState = true;
let syncTimer: ReturnType<typeof setTimeout> | null = null;
let onStateChange: ((state: string) => void) | null = null;

function handleNetChange(state: { isConnected: boolean | null; isInternetReachable: boolean | null }) {
  const isNowOnline = state.isConnected === true && state.isInternetReachable === true;
  if (isNowOnline && !lastConnectedState) {
    onStateChange?.('syncing');
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      const count = await getPendingActionsCount();
      if (count > 0) {
        const syncResult = await tryIf(async () => {
          await syncPendingActions();
          return true;
        }, { retries: 1, baseDelay: 500 });
        if (syncResult.ok) {
          onStateChange?.('synced');
        } else {
          onStateChange?.('error');
        }
      } else { onStateChange?.('idle'); }
    }, DEBOUNCE_MS);
  }
  lastConnectedState = isNowOnline;
}

export function startAutoSync(stateCallback?: (state: string) => void) {
  onStateChange = stateCallback || null;
  if (netUnsubscribe) return;
  netUnsubscribe = NetInfo.addEventListener(handleNetChange);
}

export function stopAutoSync() {
  if (netUnsubscribe) { netUnsubscribe(); netUnsubscribe = null; }
  if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
  onStateChange = null;
}

export async function forceSyncNow() {
  const count = await getPendingActionsCount();
  if (count === 0) return { synced: 0, failed: 0 };
  onStateChange?.('syncing');
  const result = await syncPendingActions();
  onStateChange?.(result.failed > 0 ? 'error' : 'synced');
  return result;
}

// ═══════════════════════════════════════════
// ATALHOS para enfileirar ações
// ═══════════════════════════════════════════

export async function queueWorkoutCompletion(userId: string, workoutId: string, logs: unknown[], duration: number) {
  const { addPendingAction } = await import('./offlineQueue');
  await addPendingAction({ type: 'COMPLETE_WORKOUT', userId, workoutId, completedAt: new Date().toISOString(), duration, logs: JSON.stringify(logs) });
}

export async function queueFavoriteAction(userId: string, workoutId: string, action: 'add' | 'remove') {
  const { addPendingAction } = await import('./offlineQueue');
  await addPendingAction({ type: action === 'add' ? 'ADD_FAVORITE' : 'REMOVE_FAVORITE', userId, workoutId });
}

// ═══════════════════════════════════════════
// UTILITÁRIO
// ═══════════════════════════════════════════

export async function isOnline() {
  const state = await NetInfo.fetch().catch(() => ({ isConnected: true, isInternetReachable: true }));
  return state.isConnected === true && state.isInternetReachable === true;
}
