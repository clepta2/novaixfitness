import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../config/supabase';
import {
  cacheWorkouts as cacheWorkoutsList,
  getCachedWorkouts,
  cacheWorkoutDetail,
  getCachedWorkoutDetail,
  addPendingAction,
  getPendingActions,
  clearPendingAction,
  updateLastSync,
} from './offline';

const CACHE_KEYS = {
  LIBRARY: '@novaix:library_cache',
  DAILY_WORKOUT: '@novaix:daily_workout',
};

export async function isOnline() {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
}

export async function cacheWorkoutsForUser(userId) {
  if (!userId) return;
  try {
    const { data } = await supabase
      .from('user_plans').select('*').eq('user_id', userId).eq('is_active', true);
    if (data) await cacheWorkoutsList(data);
  } catch (err) {
    console.error('Erro ao cachear treinos do usuario:', err);
  }
}

export async function cacheDailyWorkout(workout) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.DAILY_WORKOUT, JSON.stringify({ workout, timestamp: Date.now() }));
  } catch (err) { console.error('Erro ao cachear treino do dia:', err); }
}

export async function getCachedDailyWorkout() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.DAILY_WORKOUT);
    if (!raw) return null;
    const { workout, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return null;
    return workout;
  } catch { return null; }
}

export async function cacheLibrary(workouts) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.LIBRARY, JSON.stringify({ workouts, timestamp: Date.now() }));
  } catch (err) { console.error('Erro ao cachear biblioteca:', err); }
}

export async function getCachedLibrary() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.LIBRARY);
    if (!raw) return null;
    const { workouts, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return null;
    return workouts;
  } catch { return null; }
}

export async function queueWorkoutCompletion(userId, workoutId, logs, duration) {
  await addPendingAction({
    type: 'COMPLETE_WORKOUT',
    userId,
    workoutId,
    completedAt: new Date().toISOString(),
    duration,
    logs: JSON.stringify(logs),
  });
}

export async function queueFavoriteAction(userId, workoutId, action) {
  const type = action === 'add' ? 'ADD_FAVORITE' : 'REMOVE_FAVORITE';
  await addPendingAction({ type, userId, workoutId });
}

export async function syncPendingData() {
  const actions = await getPendingActions();
  if (actions.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      if (action.type === 'COMPLETE_WORKOUT') {
        await supabase.from('user_workouts').upsert({
          user_id: action.userId, workout_id: action.workoutId,
          completed: true, completed_at: action.completedAt,
          duration: action.duration, notes: action.logs,
        }, { onConflict: 'user_id,workout_id' });
      } else if (action.type === 'ADD_FAVORITE') {
        await supabase.from('favorites').upsert(
          { user_id: action.userId, workout_id: action.workoutId },
          { onConflict: 'user_id,workout_id' }
        );
      } else if (action.type === 'REMOVE_FAVORITE') {
        await supabase.from('favorites')
          .delete().eq('user_id', action.userId).eq('workout_id', action.workoutId);
      }
      await clearPendingAction(action.id);
      synced++;
    } catch (err) {
      console.error(`Erro ao sincronizar acao ${action.type}:`, err);
      failed++;
    }
  }

  if (synced > 0) await updateLastSync();
  return { synced, failed };
}

export { getCachedWorkouts, getCachedWorkoutDetail, cacheWorkoutDetail, getPendingActions };
