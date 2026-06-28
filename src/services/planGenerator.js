// src/services/planGenerator.js
// Gerador de planos - COM MIDDLEWARES

import { supabase } from '../config/supabase';
import { APP_CONFIG } from '../config/app';
import { getAvailableExercises } from '../data/exerciseCatalog';
import { validate } from '../middleware/validation';
import { rateLimit } from '../middleware/rateLimit';
import { handleApiError } from '../middleware/errorHandler';

export async function generateMealPlan(profileContext = {}) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
  const { weight = 70, height = 170, age = 25, goal = 'manter', dietaryRestrictions = '', stressSleep = '', preferredTime = '' } = profileContext;

  const weightCheck = validate('weight', weight);
  if (!weightCheck.valid) throw new Error(weightCheck.error);
  const heightCheck = validate('height', height);
  if (!heightCheck.valid) throw new Error(heightCheck.error);

  const systemPrompt = `Gere um plano alimentar semanal completo em JSON valido (sem markdown) com:
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

  if (!apiKey) return generateFallbackMealPlan(profileContext);

  try {
    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: systemPrompt }] }] }) });
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) { const parsed = JSON.parse(jsonMatch[0]); if (parsed.week) return parsed; }
    return null;
  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    return generateFallbackMealPlan(profileContext);
  }
}

export async function generateWorkoutPlan(profileContext = {}) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
  const { weight = 70, goal = 'manter', level = 'intermediario', gymType = 'academia', availableDays = 4, injuries = [], preferredMuscles = [], preferredTime = '', stressSleep = '', ageRange = '', gender = '' } = profileContext;

  const weightCheck = validate('weight', weight);
  if (!weightCheck.valid) throw new Error(weightCheck.error);

  const availableExercises = getAvailableExercises({ level, injuries, gymType });

  const systemPrompt = `Gere uma rotina de treino semanal completa em JSON valido.
CATALOGO: ${JSON.stringify(availableExercises.map(e => ({ name: e.name, muscle: e.muscleGroup, equipment: e.equipment })))}
REGRAS: Use APENAS exercicios do catalogo. Se lesao, analise a descricao. Musculos preferidos: ${preferredMuscles.join(', ') || 'Todos'}.
Usuario: ${weight}kg, ${goal}, ${level}, ${availableDays} dias, Lesoes: ${injuries.map(i => i.bodyPart + ': ' + (i.description || '')).join('; ') || 'Nenhuma'}.
Retorne JSON: { week: [{ day, name, exercises: [{name, sets, reps, rest, muscle}], duration }], summary: { totalWorkouts, musclesWorked, tips } }`;

  if (!apiKey) return generateFallbackWorkoutPlan(profileContext);

  try {
    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: systemPrompt }] }] }) });
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) { const parsed = JSON.parse(jsonMatch[0]); if (parsed.week) return parsed; }
    return null;
  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    return generateFallbackWorkoutPlan(profileContext);
  }
}

function generateFallbackMealPlan(ctx) {
  const days = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
  const meals = [
    { type: 'cafe', name: 'Cafe da Manha', items: ['Ovos mexidos', 'Pao integral', 'Banana'], calories: 400, protein: 25, carbs: 50, fat: 12 },
    { type: 'almoco', name: 'Almoco', items: ['Arroz', 'Feijao', 'Frango', 'Salada'], calories: 600, protein: 40, carbs: 65, fat: 15 },
    { type: 'lanche', name: 'Lanche', items: ['Iogurte grego', 'Granola'], calories: 250, protein: 15, carbs: 35, fat: 6 },
    { type: 'jantar', name: 'Jantar', items: ['Peixe', 'Batata doce', 'Brocolis'], calories: 450, protein: 35, carbs: 45, fat: 12 },
  ];
  return { week: days.map(day => ({ day, meals, totalCalories: 1700 })), summary: { avgCalories: 1700, avgProtein: 115, avgCarbs: 195, avgFat: 36, tips: ['Beba 2.5L de agua'] } };
}

function generateFallbackWorkoutPlan(ctx) {
  return { week: [
    { day: 'Segunda', name: 'Treino A', exercises: [{ name: 'Supino Reto', sets: 4, reps: '10-12', rest: 90, muscle: 'Peito' }, { name: 'Triceps Pulley', sets: 3, reps: '12-15', rest: 60, muscle: 'Triceps' }], duration: 60 },
    { day: 'Quarta', name: 'Treino B', exercises: [{ name: 'Puxada Frontal', sets: 4, reps: '10-12', rest: 90, muscle: 'Costas' }, { name: 'Rosca Martelo', sets: 3, reps: '12-15', rest: 60, muscle: 'Biceps' }], duration: 60 },
  ], summary: { totalWorkouts: 2, musclesWorked: ['Peito', 'Costas'], tips: ['Descanse 48h entre grupos'] } };
}

export async function saveWorkoutPlan(userId, plan) {
  if (!userId || !plan?.week) return false;
  try {
    const workouts = plan.week.map(day => ({ user_id: userId, title: day.name, category: day.focus || 'Treino', duration_minutes: day.duration || 60, exercises: JSON.stringify(day.exercises || []), day_of_week: day.day, is_active: true }));
    const { error } = await supabase.from('user_plans').upsert(workouts, { onConflict: 'user_id,day_of_week' });
    return !error;
  } catch (err) { console.error('Erro ao salvar plano:', err); return false; }
}

export async function getUserPlan(userId) {
  if (!userId) return null;
  try { const { data } = await supabase.from('user_plans').select('*').eq('user_id', userId).eq('is_active', true).order('day_of_week'); return data || []; }
  catch { return null; }
}

export async function getUserMealPlan(userId) {
  if (!userId) return null;
  try { const { data } = await supabase.from('user_meal_plans').select('*').eq('user_id', userId).eq('is_active', true).single(); return data?.plan_data || null; }
  catch { return null; }
}
