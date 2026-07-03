// src/services/nutritionContent.ts
// Geração de conteúdo nutricional via proxy - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWithAI } from './ai/aiProxy';
import { tryIf } from '../utils/tryIf';

const CACHE_KEY = '@novaix:nutrition_content';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

const SYSTEM_PROMPTS: Record<string, string> = {
  foods: `Gere uma lista de 40 alimentos brasileiros comuns em JSON valido (sem markdown):
{
  "foods": [
    {"name": "nome", "portion": "porcao", "cal": num, "pro": num, "carb": num, "fat": num, "cat": "categoria"}
  ]
}
Categorias: Carboidratos, Proteinas, Frutas, Laticinios, Gorduras, Legumes.
Inclua valores nutricionais reais por 100g ou porcao padrao.`,

  myths: `Gere 10 mitos e verdades sobre nutricao em JSON valido:
{
  "myths": [
    {"myth": "Mito comum", "truth": "Verdade cientifica", "category": "Macros|Timing|Suplementos|Geral"}
  ]
}
Foco em informacoes cientificas, sem sensationalismo.`,

  swaps: `Gere 16 substituicoes inteligentes de alimentos em JSON valido:
{
  "swaps": [
    {"from": "Alimento original", "to": "Substituicao", "reason": "Razao nutricional", "category": "Proteinas|Carboidratos|Gorduras|Lanches"}
  ]
}
Foco em alternativas mais saudaveis ou economicas.`,

  challenges: `Gere 8 desafios semanais de nutricao em JSON valido:
{
  "challenges": [
    {"title": "Nome do desafio", "desc": "Descricao", "duration": "X dias", "reward": num, "difficulty": "Facil|Medio|Dificil", "category": "Hidratacao|Proteina|Geral"}
  ]
}`,

  tips: `Gere 10 dicas educativas sobre nutricao em JSON valido:
{
  "tips": [
    {"title": "Titulo curto", "content": "Conteudo explicativo (2-3 frases)", "category": "Hidratacao|Proteina|Sono|Carboidratos|Timing|Gorduras|Progressao|Descanso"}
  ]
}`,

  recipes: `Gere receitas e guia de meal prep em JSON valido:
{
  "recipes": [
    {"name": "Nome", "description": "Descricao", "ingredients": [{"item": "ingrediente", "amount": "qtd"}], "steps": ["passo1"], "prepTime": num, "cookTime": num, "servings": num, "calories": num, "protein": num, "carbs": num, "fat": num, "difficulty": "facil|medio|dificil"}
  ],
  "prep": [
    {"day": "Domingo", "title": "Passo", "icon": "clipboard", "color": "#3B82F6", "tasks": ["tarefa1", "tarefa2"]}
  ]
}
Inclua 6 receitas brasileiras e 6 passos de meal prep.`,
};

async function fetchContent(type: string) {
  const prompt = SYSTEM_PROMPTS[type];
  if (!prompt) return null;

  const result = await tryIf(async () => {
    const response = await generateWithAI({ prompt, type: 'nutrition' });
    if (!response) return null;

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  }, { retries: 2, baseDelay: 500 });

  if (!result.ok) {
    console.error(`Erro ao buscar conteudo (${type}):`, result.error);
    return null;
  }
  return result.data;
}

export async function getNutritionContent(type: string) {
  const cachedResult = await tryIf(async () => {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      if (data[type] && Date.now() - data[type].timestamp < CACHE_TTL) {
        return data[type].content;
      }
    }
    return null;
  }, { retries: 2, baseDelay: 500 });

  if (cachedResult.ok && cachedResult.data) {
    return cachedResult.data;
  }

  const content = await fetchContent(type);
  if (content) {
    await tryIf(async () => {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const data = cached ? JSON.parse(cached) : {};
      data[type] = { content, timestamp: Date.now() };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, { retries: 2, baseDelay: 500 });
  }

  return content;
}

export async function refreshNutritionContent(type: string) {
  const content = await fetchContent(type);
  if (content) {
    await tryIf(async () => {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const data = cached ? JSON.parse(cached) : {};
      data[type] = { content, timestamp: Date.now() };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, { retries: 2, baseDelay: 500 });
  }
  return content;
}

export async function clearNutritionCache() {
  await tryIf(async () => {
    await AsyncStorage.removeItem(CACHE_KEY);
  }, { retries: 2, baseDelay: 500 });
}
