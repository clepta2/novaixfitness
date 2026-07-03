// src/services/analytics/analytics-nutrition.ts
// Analytics de nutrição e progresso

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { sumField } from './analytics-helpers';

export async function getNutritionAnalytics(userId: string, period = 'month') {
  const startDate = new Date();
  if (period === 'week') startDate.setDate(startDate.getDate() - 7);
  else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
  else if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);

  const { data: meals } = await supabase
    .from(TABLES.MEAL_LOGS)
    .select('logged_at, calories, protein, carbs, fat')
    .eq('user_id', userId)
    .gte('logged_at', startDate.toISOString());

  const { data: water } = await supabase
    .from(TABLES.WATER_LOGS)
    .select('amount_ml, logged_at')
    .eq('user_id', userId)
    .gte('logged_at', startDate.toISOString());

  const daysLogged = new Set((meals || []).map(m => new Date(m.logged_at).toDateString())).size;

  return {
    totalMeals: meals?.length || 0,
    totalCalories: sumField(meals || [], 'calories'),
    totalProtein: sumField(meals || [], 'protein'),
    totalCarbs: sumField(meals || [], 'carbs'),
    totalFat: sumField(meals || [], 'fat'),
    totalWater: sumField(water || [], 'amount_ml'),
    daysLogged,
    avgCaloriesPerDay: daysLogged > 0 ? Math.round(sumField(meals || [], 'calories') / daysLogged) : 0,
    avgWaterPerDay: daysLogged > 0 ? Math.round(sumField(water || [], 'amount_ml') / daysLogged) : 0,
  };
}

export async function getProgressAnalytics(userId: string) {
  const { data: weight } = await supabase
    .from(TABLES.WEIGHT_LOGS)
    .select('weight, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: true });

  const { data: workouts } = await supabase
    .from(TABLES.USER_WORKOUTS)
    .select('completed_at')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: true });

  const weightData = weight || [];
  const workoutData = workouts || [];
  const weightChange = weightData.length >= 2
    ? weightData[weightData.length - 1].weight - weightData[0].weight : 0;
  const totalWorkouts = workoutData.length;
  const weeks = Math.max(1, Math.ceil(
    (Date.now() - new Date(workoutData[0]?.completed_at || Date.now()).getTime()) / (7 * 86400000)
  ));

  return {
    weightData: weightData.map(w => ({ weight: w.weight, date: w.recorded_at })),
    weightChange: Math.round(weightChange * 10) / 10,
    currentWeight: weightData.length > 0 ? weightData[weightData.length - 1].weight : null,
    totalWorkouts,
    workoutsPerWeek: totalWorkouts > 0 ? Math.round(totalWorkouts / weeks * 10) / 10 : 0,
  };
}
