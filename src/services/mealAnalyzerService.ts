// src/services/mealAnalyzerService.ts
// Funcoes de analise de refeicoes

import { supabase } from '../config/supabase';
import type { MealAnalysisResult, MealProfileContext, NutritionGoals, MultiplierKey } from './mealAnalyzerTypes';
import { FOOD_DATABASE } from './mealAnalyzerData';

export async function analyzeMealText(mealText: string, profileContext: MealProfileContext = {}): Promise<MealAnalysisResult | null> {
  const weight = profileContext.weight || 70;
  const systemPrompt = `Analise esta refeicao e retorne APENAS um JSON valido com:
  {"description":"nome","calories":numero,"protein":g,"carbs":g,"fat":g,"fiber":g,"items":["item1"],"mealType":"cafe"|"almoco"|"jantar"|"lanche"}
  Usuario: ${weight}kg. Seja preciso.`;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const API_BASE = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${API_BASE}/api/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ prompt: `${systemPrompt}\n\nRefeicao: ${mealText}` }),
    });

    const result = await response.json();
    const text = result.response;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.calories) return parsed;
    }
    return null;
  } catch {
    return generateFallbackMealAnalysis(mealText, weight);
  }
}

export async function saveMealLog(userId: string, mealData: MealAnalysisResult) {
  if (!userId || !mealData) return;
  try {
    await supabase.from('meal_logs').insert({
      user_id: userId, description: mealData.description,
      calories: mealData.calories, protein: mealData.protein,
      carbs: mealData.carbs, fat: mealData.fat, fiber: mealData.fiber,
      items: mealData.items, meal_type: mealData.mealType || 'outro',
      logged_at: new Date().toISOString(),
    });
  } catch (err) {
    if (__DEV__) console.error('Erro ao salvar refeicao:', err);
  }
}

export async function getMealLogs(userId: string, date: string | null = null) {
  if (!userId) return [];
  try {
    let query = supabase.from('meal_logs').select('*').eq('user_id', userId);
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      query = query.gte('logged_at', start.toISOString()).lte('logged_at', end.toISOString());
    }
    const { data } = await query.order('logged_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function getDailySummary(userId: string, date: string | null = null) {
  const logs = await getMealLogs(userId, date);
  if (logs.length === 0) return null;
  return logs.reduce((acc: NutritionGoals & { meals: number }, log: Record<string, unknown>) => ({
    calories: acc.calories + ((log.calories as number) || 0),
    protein: acc.protein + ((log.protein as number) || 0),
    carbs: acc.carbs + ((log.carbs as number) || 0),
    fat: acc.fat + ((log.fat as number) || 0),
    fiber: acc.fiber + ((log.fiber as number) || 0),
    meals: acc.meals + 1,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, meals: 0 });
}

export function calculateNutritionGoals(weight = 70, goal: string = 'manter'): NutritionGoals {
  const baseCalories = weight * 33;
  const baseProtein = weight * 1.8;
  const baseCarbs = weight * 4;
  const baseFat = weight * 1;
  const multipliers: Record<MultiplierKey, { calories: number; protein: number; carbs: number; fat: number }> = {
    emagrecer: { calories: 0.8, protein: 2.0, carbs: 3, fat: 0.8 },
    ganhar: { calories: 1.2, protein: 2.2, carbs: 5, fat: 1.2 },
    manter: { calories: 1, protein: 1.8, carbs: 4, fat: 1 },
  };
  const m = multipliers[goal as MultiplierKey] || multipliers.manter;
  return {
    calories: Math.round(baseCalories * m.calories), protein: Math.round(baseProtein * m.protein),
    carbs: Math.round(baseCarbs * m.carbs), fat: Math.round(baseFat * m.fat), fiber: 30,
  };
}

function detectMealType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('cafe') || lower.includes('manha')) return 'cafe';
  if (lower.includes('almoco') || lower.includes('almoc')) return 'almoco';
  if (lower.includes('jantar') || lower.includes('noite')) return 'jantar';
  if (lower.includes('lanche') || lower.includes('tarde')) return 'lanche';
  const hour = new Date().getHours();
  if (hour < 10) return 'cafe';
  if (hour < 14) return 'almoco';
  if (hour < 18) return 'lanche';
  return 'jantar';
}

function generateFallbackMealAnalysis(mealText: string, _weight: number): MealAnalysisResult {
  const text = mealText.toLowerCase();
  let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;
  const items: string[] = [];

  FOOD_DATABASE.forEach(food => {
    if (food.names.some(n => text.includes(n))) {
      calories += food.cal; protein += food.pro; carbs += food.carb;
      fat += food.fat; fiber += food.fib; items.push(food.names[0]);
    }
  });

  if (calories === 0) {
    calories = 300; protein = 15; carbs = 35; fat = 10; fiber = 4;
    items.push('refeicao estimada');
  }

  return {
    description: mealText.slice(0, 60), calories, protein, carbs, fat, fiber,
    items: items.length > 0 ? items : ['refeicao'], mealType: detectMealType(mealText),
  };
}
