// src/services/nutritionContent.js
// Geração de conteúdo nutricional via IA - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../config/app';

const CACHE_KEY = '@novaix:nutrition_content';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

const SYSTEM_PROMPTS = {
  foods: `Gere uma lista de 40 alimentos brasileiros comuns em JSON válido (sem markdown):
{
  "foods": [
    {"name": "nome", "portion": "porção", "cal": num, "pro": num, "carb": num, "fat": num, "cat": "categoria"}
  ]
}
Categorias: Carboidratos, Proteínas, Frutas, Laticínios, Gorduras, Legumes.
Inclua valores nutricionais reais por 100g ou porção padrão.`,

  myths: `Gere 10 mitos e verdades sobre nutrição em JSON válido:
{
  "myths": [
    {"myth": "Mito comum", "truth": "Verdade científica", "category": "Macros|Timing|Suplementos|Geral"}
  ]
}
Foco em informações científicas, sem sensationalismo.`,

  swaps: `Gere 16 substituições inteligentes de alimentos em JSON válido:
{
  "swaps": [
    {"from": "Alimento original", "to": "Substituição", "reason": "Razão nutricional", "category": "Proteínas|Carboidratos|Gorduras|Lanches"}
  ]
}
Foco em alternativas mais saudáveis ou econômicas.`,

  challenges: `Gere 8 desafios semanais de nutrição em JSON válido:
{
  "challenges": [
    {"title": "Nome do desafio", "desc": "Descrição", "duration": "X dias", "reward": num, "difficulty": "Fácil|Médio|Difícil", "category": "Hidratação|Proteína|Geral"}
  ]
}`,

  tips: `Gere 10 dicas educativas sobre nutrição em JSON válido:
{
  "tips": [
    {"title": "Título curto", "content": "Conteúdo explicativo (2-3 frases)", "category": "Hidratação|Proteína|Sono|Carboidratos|Timing|Gorduras|Progressão|Descanso"}
  ]
}`,

  recipes: `Gere receitas e guia de meal prep em JSON válido:
{
  "recipes": [
    {"name": "Nome", "description": "Descrição", "ingredients": [{"item": "ingrediente", "amount": "qtd"}], "steps": ["passo1"], "prepTime": num, "cookTime": num, "servings": num, "calories": num, "protein": num, "carbs": num, "fat": num, "difficulty": "fácil|médio|difícil"}
  ],
  "prep": [
    {"day": "Domingo", "title": "Passo", "icon": "clipboard", "color": "#3B82F6", "tasks": ["tarefa1", "tarefa2"]}
  ]
}
Inclua 6 receitas brasileiras e 6 passos de meal prep.`,
};

async function fetchFromGemini(prompt) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
  if (!apiKey) return null;

  try {
    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch (error) {
    console.error('Erro Gemini:', error);
    return null;
  }
}

async function getCachedContent() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

async function setCachedContent(data) {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (err) {
    console.error('Erro ao cachear:', err);
  }
}

export async function getNutritionContent(type) {
  const cached = await getCachedContent();
  if (cached?.[type]) return cached[type];

  const prompt = SYSTEM_PROMPTS[type];
  if (!prompt) return null;

  const data = await fetchFromGemini(prompt);
  if (data) {
    const existing = cached || {};
    await setCachedContent({ ...existing, [type]: data });
    return data[type] || data;
  }
  return null;
}

export async function getAllNutritionContent() {
  const cached = await getCachedContent();
  if (cached) return cached;

  const results = {};
  for (const [type, prompt] of Object.entries(SYSTEM_PROMPTS)) {
    const data = await fetchFromGemini(prompt);
    if (data) results[type] = data[type] || data;
  }

  if (Object.keys(results).length > 0) {
    await setCachedContent(results);
  }
  return results;
}

export async function refreshNutritionContent(type) {
  const prompt = SYSTEM_PROMPTS[type];
  if (!prompt) return null;

  const data = await fetchFromGemini(prompt);
  if (data) {
    const cached = await getCachedContent() || {};
    await setCachedContent({ ...cached, [type]: data[type] || data });
    return data[type] || data;
  }
  return null;
}
