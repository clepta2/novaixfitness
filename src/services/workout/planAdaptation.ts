// src/services/planAdaptation.js
// Sistema de adaptação inteligente multimodal - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { analyzeProgression, applyProgression } from '../progressionEngine';
import { tryIf } from '../../utils/tryIf';

const ADAPTATION_THRESHOLDS = {
  MIN_SESSIONS_FOR_ADAPT: 6,
  WEEKS_BETWEEN_ADAPTS: 4,
};

export async function analyzeUserPerformance(userId) {
  if (!userId) return null;
  const result = await tryIf(async () => {
    const fourWeeksAgo = new Date(Date.now() - 28 * 86400000).toISOString();
    const [recentWorkouts, logs] = await Promise.all([
      supabase.from('user_workouts').select('*, workouts(category)').eq('user_id', userId).gte('completed_at', fourWeeksAgo).order('completed_at', { ascending: false }),
      supabase.from('user_exercise_logs').select('*').eq('user_id', userId).gte('created_at', fourWeeksAgo),
    ]);
    const recent = recentWorkouts.data || [];
    const exerciseLogs = logs.data || [];
    const completionRate = recent.length > 0 ? recent.filter(w => w.completed).length / recent.length : 0;
    const consistency = calculateConsistency(recent);
    const lastAdaptation = await getLastAdaptation(userId);
    return {
      completionRate, consistency, totalSessions: recent.length, exerciseLogs,
      lastAdaptation: lastAdaptation?.created_at,
      weeksSinceAdaptation: lastAdaptation ? Math.floor((Date.now() - new Date(lastAdaptation.created_at).getTime()) / (7 * 86400000)) : 99,
    };
  }, { retries: 1, baseDelay: 500 });
  if (!result.ok) { console.error('Erro ao analisar performance:', result.error); return null; }
  return result.data!;
}

function calculateConsistency(workouts) {
  if (workouts.length < 2) return 1;
  const dates = workouts.map(w => new Date(w.completed_at || w.created_at).toDateString());
  const uniqueDays = new Set(dates).size;
  const timestamps = workouts.map(w => new Date(w.completed_at || w.created_at).getTime());
  const weeksSpan = Math.max(1, (Date.now() - Math.min(...timestamps)) / (7 * 86400000));
  return Math.min(1, uniqueDays / (weeksSpan * 3));
}

export async function shouldAdaptPlan(userId) {
  const performance = await analyzeUserPerformance(userId);
  if (!performance) return false;
  if (performance.totalSessions < ADAPTATION_THRESHOLDS.MIN_SESSIONS_FOR_ADAPT) return false;
  if (performance.weeksSinceAdaptation < ADAPTATION_THRESHOLDS.WEEKS_BETWEEN_ADAPTS) return false;
  return true;
}

export function adaptExercise(exercise, modality) {
  const progression = analyzeProgression(modality, []);
  return applyProgression(exercise, progression);
}

export function getWorkoutModality(workout) {
  const cat = (workout?.category || workout?.focus || '').toLowerCase();
  if (cat.includes('cardio') || cat.includes('corrida')) return 'cardio';
  if (cat.includes('calistenia') || cat.includes('bodyweight')) return 'calisthenics';
  if (cat.includes('dança') || cat.includes('dance') || cat.includes('zumba')) return 'dance';
  if (cat.includes('yoga') || cat.includes('pilates')) return 'yoga';
  if (cat.includes('hiit')) return 'hiit';
  return 'gym';
}

export async function saveAdaptation(userId, oldPlan, newPlan, reason) {
  if (!userId) return;
  await tryIf(async () => {
    await supabase.from('plan_adaptations').insert({ user_id: userId, old_plan: oldPlan, new_plan: newPlan, reason, adapted_at: new Date().toISOString() });
    await supabase.from('user_plans').delete().eq('user_id', userId).eq('is_active', true);
    const workouts = newPlan.week.map(day => ({
      user_id: userId, title: day.name, category: day.focus || 'Treino', duration_minutes: day.duration || 60,
      exercises: JSON.stringify(day.exercises || []), day_of_week: day.day, is_active: true,
    }));
    await supabase.from('user_plans').upsert(workouts, { onConflict: 'user_id,day_of_week' });
  }, { retries: 3, baseDelay: 1000 });
}

export async function getLastAdaptation(userId) {
  if (!userId) return null;
  const result = await tryIf(async () => {
    const { data } = await supabase.from('plan_adaptations').select('*').eq('user_id', userId).order('adapted_at', { ascending: false }).limit(1).single();
    return data;
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data! : null;
}

export function getAdaptationReason(performance) {
  if (performance.completionRate < 0.5) return 'Reduzindo volume para melhor execução';
  if (performance.completionRate > 0.85) return 'Aumentando desafio';
  return 'Atualização periódica';
}
export function adaptWorkoutPlan(plan: any, feedback: any) { return plan; }
