// src/services/planService.js
// Serviço de conversão e CRUD de planos semanais - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { DAY_KEYS } from '../../data/weekPlan';
import { tryIf } from '../../utils/tryIf';

export async function loadWeeklyPlan(userId) {
  if (!userId) return null;

  const result = await tryIf(async () => {
    const { data: plans } = await supabase
      .from('user_plans')
      .select('day_of_week, title, exercises, duration_minutes, category')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!plans || plans.length === 0) return null;
    return convertUserPlansToWeekPlan(plans);
  }, { retries: 2, baseDelay: 500 });
  if (!result.ok) {
    if (__DEV__) console.error('Erro ao carregar plano semanal:', result.error);
    return null;
  }
  return result.data;
}

export async function saveWeeklyPlan(userId, weekPlan) {
  if (!userId || !weekPlan) return false;

  const result = await tryIf(async () => {
    await supabase
      .from('user_plans')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);

    const plans = convertWeekPlanToUserPlans(userId, weekPlan);
    const activePlans = plans.filter(p => !p.isRest);

    if (activePlans.length > 0) {
      const { error } = await supabase
        .from('user_plans')
        .insert(activePlans);
      if (error) throw error;
    }

    return true;
  }, { retries: 2, baseDelay: 500 });
  if (!result.ok) {
    if (__DEV__) console.error('Erro ao salvar plano semanal:', result.error);
    return false;
  }
  return result.data;
}

export async function updateDayPlan(userId, dayKey, dayData) {
  if (!userId || !dayKey) return false;

  const result = await tryIf(async () => {
    if (dayData.isRest) {
      await supabase
        .from('user_plans')
        .delete()
        .eq('user_id', userId)
        .eq('day_of_week', dayKey)
        .eq('is_active', true);
      return true;
    }

    const { data: existing } = await supabase
      .from('user_plans')
      .select('id')
      .eq('user_id', userId)
      .eq('day_of_week', dayKey)
      .eq('is_active', true)
      .maybeSingle();

    const planRow = {
      user_id: userId,
      day_of_week: dayKey,
      title: dayData.workoutName || '',
      exercises: dayData.exercises || [],
      duration_minutes: dayData.duration || 0,
      category: dayData.category || null,
      is_active: true,
    };

    if (existing) {
      await supabase.from('user_plans').update(planRow).eq('id', existing.id);
    } else {
      await supabase.from('user_plans').insert(planRow);
    }

    return true;
  }, { retries: 2, baseDelay: 500 });
  if (!result.ok) {
    if (__DEV__) console.error('Erro ao atualizar dia:', result.error);
    return false;
  }
  return result.data;
}

function convertUserPlansToWeekPlan(plans) {
  const weekPlan = {};

  for (const key of DAY_KEYS) {
    const plan = plans.find(p => p.day_of_week === key);
    if (plan) {
      weekPlan[key] = {
        workoutId: plan.exercises?.[0]?.workout_id || null,
        workoutName: plan.title || '',
        duration: plan.duration_minutes || 0,
        category: plan.category || null,
        isRest: false,
        exercises: plan.exercises || [],
      };
    } else {
      weekPlan[key] = { workoutId: null, workoutName: null, duration: 0, category: null, isRest: true };
    }
  }

  return weekPlan;
}

function convertWeekPlanToUserPlans(userId, weekPlan) {
  return DAY_KEYS.map(key => {
    const day = weekPlan[key];
    return {
      user_id: userId,
      day_of_week: key,
      title: day?.workoutName || '',
      exercises: day?.exercises || [],
      duration_minutes: day?.duration || 0,
      category: day?.category || null,
      is_active: true,
      isRest: !!day?.isRest,
    };
  });
}
