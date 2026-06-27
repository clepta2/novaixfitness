// src/services/planGenerator.js
// Gerador de planos alimentares e de treino - NOVAIX FITNESS

import { supabase } from '../config/supabase';

export async function generateMealPlan(profileContext = {}) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  const { weight = 70, height = 170, age = 25, goal = 'manter', allergies = '', restrictions = '' } = profileContext;

  const systemPrompt = `Gere um plano alimentar semanal completo em JSON valido (sem markdown) com:
{
  "week": [
    {
      "day": "Segunda",
      "meals": [
        {"type": "cafe", "name": "Café da Manhã", "items": ["item1", "item2"], "calories": 400, "protein": 30, "carbs": 45, "fat": 12},
        {"type": "almoco", "name": "Almoço", "items": [...], "calories": 600, "protein": 40, "carbs": 60, "fat": 18},
        {"type": "lanche", "name": "Lanche", "items": [...], "calories": 250, "protein": 15, "carbs": 30, "fat": 8},
        {"type": "jantar", "name": "Jantar", "items": [...], "calories": 500, "protein": 35, "carbs": 50, "fat": 15}
      ],
      "totalCalories": 1750
    }
  ],
  "summary": {
    "avgCalories": 1750,
    "avgProtein": 120,
    "avgCarbs": 185,
    "avgFat": 53,
    "tips": ["dica1", "dica2"]
  }
}
Usuario: ${weight}kg, ${height}cm, ${age}a. Objetivo: ${goal}. Alergias: ${allergies}. Restrições: ${restrictions}.
Varie os alimentos. Use alimentos brasileiros. Inclua quantidades aproximadas.`;

  if (!apiKey) {
    return generateFallbackMealPlan(profileContext);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      }),
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.week) return parsed;
    }
    return null;
  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    return generateFallbackMealPlan(profileContext);
  }
}

export async function generateWorkoutPlan(profileContext = {}) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  const { weight = 70, goal = 'manter', level = 'intermediario', gymType = 'academia', availableDays = 4, sessionDuration = 60 } = profileContext;

  const systemPrompt = `Gere uma rotina de treino semanal completa em JSON valido (sem markdown) com:
{
  "week": [
    {
      "day": "Segunda",
      "name": "Treino A - Peito e Tríceps",
      "warmup": ["exercicio1", "exercicio2"],
      "exercises": [
        {"name": "Supino Reto", "sets": 4, "reps": "10-12", "rest": 90, "muscle": "Peito"},
        {"name": "Supino Inclinado", "sets": 3, "reps": "10-12", "rest": 90, "muscle": "Peito"}
      ],
      "cooldown": ["alongamento1"],
      "duration": 60,
      "focus": "Hipertrofia"
    }
  ],
  "summary": {
    "totalWorkouts": 4,
    "totalDuration": 240,
    "musclesWorked": ["Peito", "Tríceps", "Costas", "Bíceps", "Pernas", "Ombros"],
    "tips": ["dica1", "dica2"]
  }
}
Usuario: ${weight}kg. Objetivo: ${goal}. Nível: ${level}. Local: ${gymType}. Dias disponíveis: ${availableDays}. Duração: ${sessionDuration}min.
Inclua exercícios para iniciante se nível for "iniciante". Use exercícios básicos e avançados conforme nível.`;

  if (!apiKey) {
    return generateFallbackWorkoutPlan(profileContext);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      }),
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.week) return parsed;
    }
    return null;
  } catch (error) {
    console.error('Erro ao gerar rotina de treino:', error);
    return generateFallbackWorkoutPlan(profileContext);
  }
}

function generateFallbackMealPlan(ctx) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const meals = [
    { type: 'cafe', name: 'Café da Manhã', items: ['Ovos mexidos', 'Pão integral', 'Banana', 'Suco de laranja'], calories: 400, protein: 25, carbs: 50, fat: 12 },
    { type: 'almoco', name: 'Almoço', items: ['Arroz', 'Feijão', 'Frango grelhado', 'Salada'], calories: 600, protein: 40, carbs: 65, fat: 15 },
    { type: 'lanche', name: 'Lanche', items: ['Iogurte grego', 'Granola', 'Mel'], calories: 250, protein: 15, carbs: 35, fat: 6 },
    { type: 'jantar', name: 'Jantar', items: ['Peixe grelhado', 'Batata doce', 'Brócolis'], calories: 450, protein: 35, carbs: 45, fat: 12 },
  ];

  return {
    week: days.map(day => ({ day, meals, totalCalories: 1700 })),
    summary: { avgCalories: 1700, avgProtein: 115, avgCarbs: 195, avgFat: 36, tips: ['Beba 2.5L de água', 'Evite ultraprocessados'] },
  };
}

function generateFallbackWorkoutPlan(ctx) {
  const days = [
    { day: 'Segunda', name: 'Treino A - Peito e Tríceps', exercises: [{ name: 'Supino Reto', sets: 4, reps: '10-12', rest: 90, muscle: 'Peito' }, { name: 'Supino Inclinado', sets: 3, reps: '10-12', rest: 90, muscle: 'Peito' }, { name: 'Crucifixo', sets: 3, reps: '12-15', rest: 60, muscle: 'Peito' }, { name: 'Tríceps Pulley', sets: 3, reps: '12-15', rest: 60, muscle: 'Tríceps' }, { name: 'Tríceps Francês', sets: 3, reps: '10-12', rest: 60, muscle: 'Tríceps' }], duration: 60, focus: 'Hipertrofia' },
    { day: 'Terça', name: 'Treino B - Costas e Bíceps', exercises: [{ name: 'Puxada Frontal', sets: 4, reps: '10-12', rest: 90, muscle: 'Costas' }, { name: 'Remada Curvada', sets: 3, reps: '10-12', rest: 90, muscle: 'Costas' }, { name: 'Remada Unilateral', sets: 3, reps: '10-12', rest: 60, muscle: 'Costas' }, { name: 'Rosca Direta', sets: 3, reps: '12-15', rest: 60, muscle: 'Bíceps' }, { name: 'Rosca Martelo', sets: 3, reps: '12-15', rest: 60, muscle: 'Bíceps' }], duration: 60, focus: 'Hipertrofia' },
    { day: 'Quinta', name: 'Treino Pernas', exercises: [{ name: 'Agachamento', sets: 4, reps: '10-12', rest: 120, muscle: 'Pernas' }, { name: 'Leg Press', sets: 3, reps: '10-12', rest: 90, muscle: 'Pernas' }, { name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: 60, muscle: 'Quadríceps' }, { name: 'Cadeira Flexora', sets: 3, reps: '12-15', rest: 60, muscle: 'Posterior' }, { name: 'Panturrilha', sets: 4, reps: '15-20', rest: 45, muscle: 'Panturrilha' }], duration: 70, focus: 'Hipertrofia' },
    { day: 'Sexta', name: 'Treino Ombros e Abdômen', exercises: [{ name: 'Desenvolvimento', sets: 4, reps: '10-12', rest: 90, muscle: 'Ombros' }, { name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: 60, muscle: 'Ombros' }, { name: 'Face Pull', sets: 3, reps: '12-15', rest: 60, muscle: 'Ombros' }, { name: 'Abdominal Crunch', sets: 3, reps: '15-20', rest: 45, muscle: 'Abdômen' }, { name: 'Prancha', sets: 3, reps: '30-45s', rest: 30, muscle: 'Abdômen' }], duration: 55, focus: 'Hipertrofia' },
  ];

  return {
    week: days,
    summary: { totalWorkouts: 4, totalDuration: 245, musclesWorked: ['Peito', 'Tríceps', 'Costas', 'Bíceps', 'Pernas', 'Ombros', 'Abdômen'], tips: ['Descanse 48h entre grupos', 'Progressão de carga a cada 2 semanas'] },
  };
}

export async function saveWorkoutPlan(userId, plan) {
  if (!userId || !plan?.week) return false;
  try {
    const workouts = plan.week.map(day => ({
      user_id: userId,
      title: day.name,
      category: day.focus || 'Treino',
      duration_minutes: day.duration || 60,
      exercises: JSON.stringify(day.exercises || []),
      day_of_week: day.day,
      is_active: true,
    }));
    const { error } = await supabase.from('user_plans').upsert(workouts, { onConflict: 'user_id,day_of_week' });
    return !error;
  } catch (err) {
    console.error('Erro ao salvar plano:', err);
    return false;
  }
}

export async function getUserPlan(userId) {
  if (!userId) return null;
  try {
    const { data } = await supabase.from('user_plans').select('*').eq('user_id', userId).eq('is_active', true).order('day_of_week');
    return data || [];
  } catch { return null; }
}

export async function getUserMealPlan(userId) {
  if (!userId) return null;
  try {
    const { data } = await supabase.from('user_meal_plans').select('*').eq('user_id', userId).eq('is_active', true).single();
    return data?.plan_data || null;
  } catch { return null; }
}
