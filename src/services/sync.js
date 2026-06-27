// src/services/sync.js
// Serviço de sincronização offline-online - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { getPendingActions, clearPendingAction, updateLastSync } from './offline';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

async function retryWithBackoff(fn, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, BASE_DELAY * Math.pow(2, attempt)));
    }
  }
}

export async function syncPendingActions() {
  const actions = await getPendingActions();
  if (actions.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      await retryWithBackoff(async () => {
        switch (action.type) {
          case 'ADD_FAVORITE':
            await supabase.from('favorites').insert({ workout_id: action.workoutId });
            break;
          case 'REMOVE_FAVORITE':
            await supabase.from('favorites').delete().eq('workout_id', action.workoutId);
            break;
          case 'COMPLETE_WORKOUT':
            await supabase.from('user_workouts').upsert({
              user_id: action.userId, workout_id: action.workoutId,
              completed: true, completed_at: action.completedAt, duration: action.duration,
            }, { onConflict: 'user_id,workout_id' });
            break;
          case 'UPDATE_WEIGHT':
            await supabase.from('weight_logs').insert({
              user_id: action.userId, weight: action.weight, recorded_at: action.recordedAt,
            });
            break;
          case 'UPDATE_WATER':
            await supabase.from('water_logs').insert({
              user_id: action.userId, amount: action.amount, recorded_at: action.recordedAt,
            });
            break;
          case 'ADD_EXERCISE_LOG':
            await supabase.from('user_exercise_logs').insert({
              user_workout_id: action.userWorkoutId,
              exercise_name: action.exerciseName,
              set_number: action.setNumber,
              reps_done: action.repsDone,
              weight_kg: action.weightKg,
            });
            break;
          default:
            console.warn('Ação desconhecida:', action.type);
        }
      });
      await clearPendingAction(action.id);
      synced++;
    } catch (err) {
      console.error(`Erro ao sincronizar ação ${action.type}:`, err);
      failed++;
    }
  }

  if (synced > 0) await updateLastSync();
  return { synced, failed };
}

export async function getPendingActionsCount() {
  const actions = await getPendingActions();
  return actions.length;
}
