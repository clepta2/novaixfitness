// src/services/mealAnalyzer.js
// Analise de refeicoes por IA - NOVAIX FITNESS

import { supabase } from '../config/supabase';

export async function analyzeMealText(mealText, profileContext = {}) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  const weight = profileContext.weight || 70;

  const systemPrompt = `Analise esta refeicao e retorne APENAS um JSON valido (sem markdown, sem texto extra) com:
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

  if (!apiKey) {
    return generateFallbackMealAnalysis(mealText, weight);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nRefeicao: ${mealText}` }] }],
      }),
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
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

export async function saveMealLog(userId, mealData) {
  if (!userId || !mealData) return;
  try {
    await supabase.from('meal_logs').insert({
      user_id: userId,
      description: mealData.description,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fat: mealData.fat,
      fiber: mealData.fiber,
      items: mealData.items,
      meal_type: mealData.mealType || 'outro',
      logged_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Erro ao salvar refeicao:', err);
  }
}

export async function getMealLogs(userId, date = null) {
  if (!userId) return [];
  try {
    let query = supabase.from('meal_logs').select('*').eq('user_id', userId);
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query = query.gte('logged_at', start.toISOString()).lte('logged_at', end.toISOString());
    }
    const { data } = await query.order('logged_at', { ascending: false });
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar refeicoes:', err);
    return [];
  }
}

export async function getDailySummary(userId, date = null) {
  const logs = await getMealLogs(userId, date);
  if (logs.length === 0) return null;

  const totals = logs.reduce((acc, log) => ({
    calories: acc.calories + (log.calories || 0),
    protein: acc.protein + (log.protein || 0),
    carbs: acc.carbs + (log.carbs || 0),
    fat: acc.fat + (log.fat || 0),
    fiber: acc.fiber + (log.fiber || 0),
    meals: acc.meals + 1,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, meals: 0 });

  return totals;
}

export function calculateNutritionGoals(weight = 70, goal = 'manter') {
  const baseCalories = weight * 33;
  const baseProtein = weight * 1.8;
  const baseCarbs = weight * 4;
  const baseFat = weight * 1;

  const multipliers = {
    emagrecer: { calories: 0.8, protein: 2.0, carbs: 3, fat: 0.8 },
    ganhar: { calories: 1.2, protein: 2.2, carbs: 5, fat: 1.2 },
    manter: { calories: 1, protein: 1.8, carbs: 4, fat: 1 },
  };

  const m = multipliers[goal] || multipliers.manter;

  return {
    calories: Math.round(baseCalories * m.calories),
    protein: Math.round(baseProtein * m.protein),
    carbs: Math.round(baseCarbs * m.carbs),
    fat: Math.round(baseFat * m.fat),
    fiber: 30,
  };
}

function detectMealType(text) {
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

function generateFallbackMealAnalysis(mealText, weight) {
  const text = mealText.toLowerCase();
  let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;
  const items = [];

  const foods = [
    { names: ['arroz'], cal: 130, pro: 3, carb: 28, fat: 0.5, fib: 1 },
    { names: ['feijao'], cal: 90, pro: 6, carb: 16, fat: 0.5, fib: 4 },
    { names: ['frango', 'peito de frango'], cal: 165, pro: 31, carb: 0, fat: 4, fib: 0 },
    { names: ['ovo', 'omelete'], cal: 78, pro: 6, carb: 1, fat: 5, fib: 0 },
    { names: ['banana'], cal: 89, pro: 1, carb: 23, fat: 0.3, fib: 3 },
    { names: ['salada', 'legume'], cal: 25, pro: 2, carb: 4, fat: 0.2, fib: 3 },
    { names: ['peixe', 'sardinha', 'tilapia'], cal: 120, pro: 22, carb: 0, fat: 3, fib: 0 },
    { names: ['pao', 'torrada'], cal: 75, pro: 3, carb: 14, fat: 1, fib: 1 },
    { names: ['leite', 'iogurte'], cal: 60, pro: 3, carb: 6, fat: 3, fib: 0 },
    { names: ['batata', 'purê'], cal: 130, pro: 3, carb: 30, fat: 0.2, fib: 3 },
    { names: ['carne', 'bife', 'carne bovina'], cal: 250, pro: 26, carb: 0, fat: 15, fib: 0 },
    { names: ['macarra', 'espaguete'], cal: 150, pro: 5, carb: 30, fat: 1, fib: 2 },
    { names: ['azeite', 'azeite de oliva'], cal: 120, pro: 0, carb: 0, fat: 14, fib: 0 },
    { names: ['mandioca', 'aipim'], cal: 160, pro: 1, carb: 38, fat: 0.2, fib: 2 },
    { names: ['café', 'cafezinho'], cal: 2, pro: 0, carb: 0, fat: 0, fib: 0 },
    { names: ['suco', 'sumo'], cal: 60, pro: 0, carb: 15, fat: 0, fib: 0 },
    { names: ['manteiga'], cal: 100, pro: 0, carb: 0, fat: 11, fib: 0 },
    { names: ['queijo', 'mussarela'], cal: 85, pro: 6, carb: 1, fat: 6, fib: 0 },
    { names: ['presunto'], cal: 100, pro: 12, carb: 2, fat: 5, fib: 0 },
    { names: ['cenoura'], cal: 41, pro: 1, carb: 10, fat: 0.2, fib: 3 },
    { names: ['tomate'], cal: 18, pro: 1, carb: 4, fat: 0.2, fib: 1 },
    { names: ['cereal', 'granola'], cal: 350, pro: 8, carb: 60, fat: 7, fib: 5 },
    { names: ['whey', 'protein shake'], cal: 120, pro: 24, carb: 3, fat: 2, fib: 0 },
  ];

  foods.forEach(food => {
    if (food.names.some(n => text.includes(n))) {
      calories += food.cal;
      protein += food.pro;
      carbs += food.carb;
      fat += food.fat;
      fiber += food.fib;
      items.push(food.names[0]);
    }
  });

  if (calories === 0) {
    calories = 300; protein = 15; carbs = 35; fat = 10; fiber = 4;
    items.push('refeicao estimada');
  }

  return {
    description: mealText.slice(0, 60),
    calories, protein, carbs, fat, fiber,
    items: items.length > 0 ? items : ['refeicao'],
    mealType: detectMealType(mealText),
  };
}
