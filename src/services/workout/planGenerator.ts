// src/services/workout/planGenerator.ts
// Gerador de planos via proxy - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { generateWithAI } from '../ai/aiProxy';
import { getAvailableExercises } from '../../data/exerciseCatalog';
import { validate } from '../../middleware/validation';
import { tryIf } from '../../utils/tryIf';
import { MEAL_PLAN_SYSTEM_INSTRUCTION, WORKOUT_PLAN_SYSTEM_INSTRUCTION } from '../aiSystemInstructions';
import { sanitizeAIOutput } from '../../utils/aiSanitize';

// ─── Buscar plano de treino do usuário ─────────────────────
export async function getUserWorkoutPlan(userId: string) {
  if (!userId) return [];
  const result = await tryIf(async () => {
    const { data } = await supabase
      .from('workout_plans')
      .select('plan_data')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!data?.plan_data) return [];
    const planData = typeof data.plan_data === 'string' ? JSON.parse(data.plan_data) : data.plan_data;
    return planData.week || planData.workouts || [];
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data! : [];
}

// ─── Salvar planos no banco ────────────────────────────────
export async function saveWorkoutPlan(userId: string, plan: any) {
  if (!userId || !plan) return;
  await tryIf(async () => {
    await supabase.from('workout_plans').insert({
      user_id: userId,
      plan_data: plan,
      status: 'active',
    });
  }, { retries: 3, baseDelay: 1000 });
}

export async function saveMealPlan(userId: string, plan: any) {
  if (!userId || !plan) return;
  await tryIf(async () => {
    await supabase.from('meal_plans').insert({
      user_id: userId,
      plan_data: plan,
      status: 'active',
    });
  }, { retries: 3, baseDelay: 1000 });
}

export async function generateMealPlan(profileContext: any = {}) {
  const { weight = 70, height = 170, age = 25, goal = 'manter', dietaryRestrictions = '', stressSleep = '', preferredTime = '' } = profileContext;

  const weightCheck = validate('weight', weight);
  if (!weightCheck.valid) throw new Error(weightCheck.error);
  const heightCheck = validate('height', height);
  if (!heightCheck.valid) throw new Error(heightCheck.error);

  const systemPrompt = `${MEAL_PLAN_SYSTEM_INSTRUCTION}

Formato esperado:
{
  "week": [
    {
      "day": "Segunda",
      "meals": [
        {"type": "cafe", "name": "Cafe da Manha", "items": ["item1", "item2"], "calories": 400, "protein": 30, "carbs": 45, "fat": 12},
        {"type": "almoco", "name": "Almoco", "items": [...], "calories": 600, "protein": 40, "carbs": 60, "fat": 18},
        {"type": "lanche", "name": "Lanche", "items": [...], "calories": 250, "protein": 15, "carbs": 30, "fat": 8},
        {"type": "jantar", "name": "Jantar", "items": [...], "calories": 500, "protein": 35, "carbs": 50, "fat": 15}
      ],
      "totalCalories": 1750
    }
  ],
  "summary": { "avgCalories": 1750, "avgProtein": 120, "avgCarbs": 185, "avgFat": 53, "tips": ["dica1", "dica2"] }
}

REGRAS: Se VEGETARIANO, NAO inclua carnes. Se estresse RUIM, inclua alimentos ricos em magnesio.
Usuario: ${weight}kg, ${height}cm, ${age}a. Objetivo: ${goal}. Restricoes: ${dietaryRestrictions}.`;

  const result = await tryIf(async () => {
    const response = await generateWithAI({ prompt: systemPrompt, type: 'plan' });
    if (!response) return null;
    const sanitized = sanitizeAIOutput(response);
    const jsonMatch = sanitized.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.week) return parsed;
    }
    return null;
  }, { retries: 2, baseDelay: 500 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao gerar plano alimentar:', result.error);
    return generateFallbackMealPlan(profileContext);
  }
  return result.data;
}

export async function generateWorkoutPlan(profileContext: any = {}) {
  const { weight = 70, goal = 'manter', level = 'intermediario', gymType = 'academia', availableDays = 4, injuries = [], preferredMuscles = [], preferredTime = '', stressSleep = '', ageRange = '', gender = '' } = profileContext;

  const weightCheck = validate('weight', weight);
  if (!weightCheck.valid) throw new Error(weightCheck.error);

  const availableExercises = getAvailableExercises({ level, injuries, gymType });

  const systemPrompt = `${WORKOUT_PLAN_SYSTEM_INSTRUCTION}

CATALOGO: ${JSON.stringify(availableExercises.map(e => ({ name: e.name, muscle: e.muscleGroup, equipment: e.equipment })))}
REGRAS: Use APENAS exercicios do catalogo. Se lesao, analise a descricao. Musculos preferidos: ${preferredMuscles.join(', ') || 'Todos'}.
Usuario: ${weight}kg, ${goal}, ${level}, ${availableDays} dias, Lesoes: ${injuries.map(i => i.bodyPart + ': ' + (i.description || '')).join('; ') || 'Nenhuma'}.
Retorne JSON: { week: [{ day, name, exercises: [{name, sets, reps, rest, muscle}], duration }], summary: { totalWorkouts, musclesWorked, tips } }`;

  const result = await tryIf(async () => {
    const response = await generateWithAI({ prompt: systemPrompt, type: 'plan' });
    if (!response) return null;
    const sanitized = sanitizeAIOutput(response);
    const jsonMatch = sanitized.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.week) return parsed;
    }
    return null;
  }, { retries: 2, baseDelay: 500 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao gerar plano de treino:', result.error);
    return generateFallbackWorkoutPlan(profileContext);
  }
  return result.data;
}

// ─── Fallbacks ─────────────────────────────────────────────
function generateFallbackMealPlan(profile) {
  const goal = profile.goal || 'manter';
  const multiplier = goal === 'emagrecer' ? 0.85 : goal === 'ganhar' ? 1.15 : 1;
  const baseCalories = Math.round(1800 * multiplier);

  const meals = [
    { type: 'cafe', name: 'Cafe da Manha', items: ['Ovos (3)', 'Pao integral', 'Banana'], calories: Math.round(baseCalories * 0.25), protein: 24, carbs: 35, fat: 12 },
    { type: 'almoco', name: 'Almoco', items: ['Arroz', 'Feijao', 'Frango (150g)', 'Salada'], calories: Math.round(baseCalories * 0.35), protein: 40, carbs: 50, fat: 15 },
    { type: 'lanche', name: 'Lanche', items: ['Whey', 'Fruta', 'Castanhas'], calories: Math.round(baseCalories * 0.15), protein: 25, carbs: 20, fat: 10 },
    { type: 'jantar', name: 'Jantar', items: ['Peixe', 'Legumes', 'Batata doce'], calories: Math.round(baseCalories * 0.25), protein: 30, carbs: 30, fat: 10 },
  ];

  return {
    week: Array(7).fill(null).map((_, i) => ({
      day: ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'][i],
      meals,
      totalCalories: baseCalories,
    })),
    summary: { avgCalories: baseCalories, avgProtein: 119, avgCarbs: 135, avgFat: 47, tips: ['Mantenha horarios fixos', 'Beba 2.5L de agua'] },
  };
}

function generateFallbackWorkoutPlan(profile) {
  const days = profile.availableDays || 4;
  const dayNames = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
  const templates = [
    { name: 'Peito/Tri', exercises: [{ name: 'Supino', sets: 4, reps: '10-12', rest: 90, muscle: 'chest' }, { name: 'Triceps Pulley', sets: 3, reps: '12-15', rest: 60, muscle: 'arms' }] },
    { name: 'Costas/Bi', exercises: [{ name: 'Puxada Frontal', sets: 4, reps: '10-12', rest: 90, muscle: 'back' }, { name: 'Rosca Direta', sets: 3, reps: '12-15', rest: 60, muscle: 'arms' }] },
    { name: 'Pernas', exercises: [{ name: 'Agachamento', sets: 4, reps: '8-10', rest: 120, muscle: 'legs' }, { name: 'Leg Press', sets: 3, reps: '10-12', rest: 90, muscle: 'legs' }] },
    { name: 'Ombros/Abd', exercises: [{ name: 'Desenvolvimento', sets: 4, reps: '10-12', rest: 90, muscle: 'shoulders' }, { name: 'Prancha', sets: 3, reps: '30-45s', rest: 60, muscle: 'core' }] },
  ];

  return {
    week: dayNames.slice(0, days).map((day, i) => ({
      day,
      name: templates[i % templates.length].name,
      exercises: templates[i % templates.length].exercises,
      duration: 60,
    })),
    summary: { totalWorkouts: days, musclesWorked: ['chest', 'back', 'legs', 'shoulders'], tips: ['Progressao gradual', 'Descanso entre series'] },
  };
}
