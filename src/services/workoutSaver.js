// src/services/workoutSaver.js
// Servico para salvar dados do treino - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { recordWorkoutCompletion } from './gamification';
import { sendWorkoutCompletedNotification } from './notifications';

export async function saveCompleteWorkout(userId, workout, logs, duration) {
  if (!userId) return null;

  try {
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('total_workouts, total_minutes')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          total_workouts: (profile.total_workouts || 0) + 1,
          total_minutes: (profile.total_minutes || 0) + duration,
        })
        .eq('id', userId);
    }

    const gamResult = await recordWorkoutCompletion(userId, workout, logs, duration);

    if (gamResult.xpGained > 0) {
      await sendWorkoutCompletedNotification(
        workout?.name || 'Treino',
        gamResult.xpGained,
        userId
      );
    }

    return {
      userWorkout,
      xpGained: gamResult.xpGained,
      newAchievements: gamResult.newAchievements,
      streak: gamResult.streak,
    };
  } catch (err) {
    console.error('Erro ao salvar treino:', err);
    return null;
  }
}

export async function savePartialWorkout(userId, workout, logs, elapsed) {
  if (!userId) return null;

  try {
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
  } catch (err) {
    console.error('Erro ao salvar treino parcial:', err);
    return null;
  }
}
