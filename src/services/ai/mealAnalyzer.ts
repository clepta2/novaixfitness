// src/services/mealAnalyzer.ts
// Analise de refeicoes por IA via proxy - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { generateWithAI } from './aiProxy';

// Re-exportar getMealLogs e saveMealLog de mealAnalyzerService para compatibilidade
export { getMealLogs, saveMealLog } from '../mealAnalyzerService';

export async function analyzeMealText(mealText, profileContext: any = {}) {
  const weight = profileContext.weight || 70;

  const systemInstruction = `Analise esta refeicao e retorne APENAS um JSON valido (sem markdown, sem texto extra) com:
{
  "description": "nome da refeicao",
  "calories": numero,
  "protein": numero_em_gramas,
  "carbs": numero_em_gramas,
  "fat": numero_em_gramas,
  "fiber": numero_em_gramas,
  "items": ["item1", "item2"],
  "mealType": "cafe"|"almoco"|"jantar"|"lanche"
}
Usuario: ${weight}kg. Seja preciso nas estimativas. Se nao conseguir analisar, retorne null.`;

  try {
    const response = await generateWithAI({
      prompt: `Refeicao: ${mealText}`,
      type: 'meal',
      systemInstruction,
    });

    if (!response) return null;

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.calories) return parsed;
    }
    return null;
  } catch (error) {
    console.error('Erro ao analisar refeicao:', error);
    return generateFallbackMealAnalysis(mealText, weight);
  }
}

export async function getDailySummary(userId: string) {
  if (!userId) return { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from('meal_logs')
    .select('calories, protein, carbs, fat')
    .eq('user_id', userId)
    .gte('logged_at', today.toISOString());

  const meals = data || [];
  return {
    calories: meals.reduce((s, m) => s + (m.calories || 0), 0),
    protein: meals.reduce((s, m) => s + (m.protein || 0), 0),
    carbs: meals.reduce((s, m) => s + (m.carbs || 0), 0),
    fat: meals.reduce((s, m) => s + (m.fat || 0), 0),
    meals: meals.length,
  };
}

export async function calculateNutritionGoals(userIdOrWeight: string | number, goal?: string) {
  // Se for number, usar direto; se for string, buscar do banco
  if (typeof userIdOrWeight === 'number') {
    const weight = userIdOrWeight;
    const g = goal || 'manter';
    const multiplier = g === 'emagrecer' ? 0.85 : g === 'ganhar' ? 1.15 : 1;
    const calories = Math.round(2000 * multiplier);
    return {
      calories,
      protein: Math.round(weight * 1.8),
      carbs: Math.round((calories * 0.45) / 4),
      fat: Math.round((calories * 0.25) / 9),
    };
  }

  const userId = userIdOrWeight;
  if (!userId) return { calories: 2000, protein: 150, carbs: 250, fat: 70 };

  const { data } = await supabase
    .from('profiles')
    .select('weight, height, age, gender, goal')
    .eq('id', userId)
    .single();

  if (!data) return { calories: 2000, protein: 150, carbs: 250, fat: 70 };

  const weight = data.weight || 70;
  const height = data.height || 170;
  const age = data.age || 25;
  const gender = data.gender || 'M';

  // Harris-Benedict
  let bmr;
  if (gender === 'M') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  const tdee = bmr * 1.55;
  const calories = Math.round(tdee);
  const protein = Math.round(weight * 1.8);

  return {
    calories,
    protein,
    carbs: Math.round((calories * 0.45) / 4),
    fat: Math.round((calories * 0.25) / 9),
  };
}

function generateFallbackMealAnalysis(mealText: string, weight: number) {
  const text = mealText.toLowerCase();
  let calories = 250;

  if (text.includes('frango') || text.includes('peixe')) calories = 200;
  if (text.includes('arroz') || text.includes('macarrao')) calories += 150;
  if (text.includes('salada')) calories += 50;
  if (text.includes('ovo')) calories += 70;

  return {
    description: mealText.substring(0, 50),
    calories,
    protein: Math.round(calories * 0.3 / 4),
    carbs: Math.round(calories * 0.4 / 4),
    fat: Math.round(calories * 0.3 / 9),
    fiber: 5,
    items: mealText.split(',').map(s => s.trim()).slice(0, 5),
    mealType: 'almoco',
  };
}
