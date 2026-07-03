// src/services/recipeGenerator.ts
// Gerador de receitas por IA - NOVAIX FITNESS

import { APP_CONFIG } from '../config/app';
import { RECIPE_SYSTEM_INSTRUCTION } from './aiSystemInstructions';
import { sanitizeAIOutput } from '../utils/aiSanitize';

interface Ingredient {
  item: string;
  amount: string;
}

interface Recipe {
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  tips: string[];
}

export async function generateRecipe(ingredients: string[] = [], goal: string = 'manter'): Promise<Recipe | null> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';

  const ingredientsText = ingredients.length > 0 ? ingredients.join(', ') : 'ingredientes disponíveis';

  const systemPrompt = `${RECIPE_SYSTEM_INSTRUCTION}

Gere uma receita saudável e prática em JSON válido:
{
  "name": "Nome da Receita",
  "description": "Descrição curta",
  "ingredients": [{"item": "ingrediente", "amount": "quantidade"}],
  "steps": ["passo1", "passo2"],
  "prepTime": 15,
  "cookTime": 30,
  "servings": 2,
  "calories": 400,
  "protein": 30,
  "carbs": 45,
  "fat": 12,
  "difficulty": "fácil|médio|difícil",
  "tips": ["dica1"]
}
Ingredientes disponíveis: ${ingredientsText}.
Objetivo: ${goal}. Use técnicas de culinária saudável. Inclua tempo de preparo.`;

  if (!apiKey) {
    return generateFallbackRecipe(ingredients);
  }

  try {
    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
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

    const sanitized = sanitizeAIOutput(text);
    const jsonMatch = sanitized.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.name) return parsed;
    }
    return null;
  } catch (error) {
    if (__DEV__) console.error('Erro ao gerar receita:', error);
    return generateFallbackRecipe(ingredients);
  }
}

function generateFallbackRecipe(ingredients: string[]): Recipe {
  return {
    name: 'Frango com Legumes Grelhados',
    description: 'Receita simples e saudável para o dia a dia',
    ingredients: [
      { item: 'Peito de frango', amount: '200g' },
      { item: 'Brócolis', amount: '1 xícara' },
      { item: 'Cenoura', amount: '1 unidade' },
      { item: 'Azeite', amount: '1 colher de sopa' },
      { item: 'Alho', amount: '2 dentes' },
    ],
    steps: [
      'Tempere o frango com sal, pimenta e alho',
      'Grelhe o frango em fogo médio por 5 minutos de cada lado',
      'Cozinhe os legumes no vapor por 5 minutos',
      'Finalize com azeite e sirva',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    calories: 350,
    protein: 35,
    carbs: 15,
    fat: 12,
    difficulty: 'fácil',
    tips: ['Use temperos naturais em vez de molhos industrializados'],
  };
}
