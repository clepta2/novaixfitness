// src/services/workout/workoutSaver.ts
// Serviço para salvar dados do treino — com suporte offline

import { supabase } from '../../config/supabase';
import { recordWorkoutCompletion } from '../gamification/gamification';
import { sendWorkoutCompletedNotification } from '../notifications/notifications';
import { sendPushToUser } from '../notifications/pushNotifications';
import { tryIf } from '../../utils/tryIf';
import { queueWorkoutCompletion, isOnline } from '../offline/offlineSync';
import { incrementProfileStats } from '../../utils/atomicUpdates';

export async function saveCompleteWorkout(userId: string, workout: any, logs: any[], duration: number) {
  if (!userId) return null;

  const online = await isOnline();

  if (!online) {
    await queueWorkoutCompletion(userId, workout?.id || 'custom', logs, duration);
    return { userWorkout: null, xpGained: 0, newAchievements: [], streak: 0, queued: true };
  }

  const result = await tryIf(async () => {
    const workoutId = workout?.id?.length === 36 ? workout.id : null;

    const { data: userWorkout, error: workoutError } = await supabase
      .from('user_workouts')
      .insert({
        user_id: userId,
        workout_id: workoutId,
        completed: true,
        completed_at: new Date().toISOString(),
        duration: duration,
        notes: JSON.stringify({ logs, exerciseCount: logs.length }),
      })
      .select('id')
      .single();

    if (workoutError) throw workoutError;

    await incrementProfileStats(userId, { workouts: 1, minutes: duration });

    const gamResult: any = await recordWorkoutCompletion(userId, workout, logs as any, duration);

    if (gamResult?.xpGained > 0) {
      await sendWorkoutCompletedNotification(workout?.name || 'Treino', gamResult.xpGained, userId);
      await sendPushToUser(userId, 'Treino concluido!', `${workout?.name || 'Treino'} finalizado. +${gamResult.xpGained} XP!`, {
        type: 'workout_completed', workout_id: workout?.id,
      });
    }

    return {
      userWorkout,
      xpGained: gamResult.xpGained,
      newAchievements: gamResult.newAchievements,
      streak: gamResult.streak,
    };
  }, { retries: 2, baseDelay: 1000 });

  return result.ok ? result.data : null;
}

export async function savePartialWorkout(userId: string, workout: any, logs: any[], elapsed: number) {
  if (!userId) return null;

  const online = await isOnline();

  if (!online) {
    await queueWorkoutCompletion(userId, workout?.id || 'custom', logs, elapsed);
    return { id: null, queued: true };
  }

  const result = await tryIf(async () => {
    const workoutId = workout?.id?.length === 36 ? workout.id : null;

    const { data, error } = await supabase
      .from('user_workouts')
      .insert({
        user_id: userId,
        workout_id: workoutId,
        completed: false,
        duration: elapsed,
        notes: JSON.stringify({ logs, partial: true, exerciseCount: logs.length }),
      })
      .select('id')
      .single();

    if (error) throw error;
    return data;
  }, { retries: 2, baseDelay: 1000 });

  return result.ok ? result.data : null;
}
