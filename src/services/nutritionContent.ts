// src/services/nutritionContent.js
// Geração de conteúdo nutricional via IA - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { sanitizeAIOutput } from '../utils/aiSanitize';
import { NUTRITION_CONTENT_SYSTEM_INSTRUCTION } from './aiSystemInstructions';

const CACHE_KEY = '@novaix:nutrition_content';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

const SYSTEM_PROMPTS = {
  foods: `${NUTRITION_CONTENT_SYSTEM_INSTRUCTION}

Gere uma lista de 40 alimentos brasileiros comuns em JSON valido (sem markdown):
{
  "foods": [
    {"name": "nome", "portion": "porcao", "cal": num, "pro": num, "carb": num, "fat": num, "cat": "categoria"}
  ]
}
Categorias: Carboidratos, Proteinas, Frutas, Laticinios, Gorduras, Legumes.
Inclua valores nutricionais reais por 100g ou porcao padrao.`,

  myths: `${NUTRITION_CONTENT_SYSTEM_INSTRUCTION}

Gere 10 mitos e verdades sobre nutricao em JSON valido:
{
  "myths": [
    {"myth": "Mito comum", "truth": "Verdade cientifica", "category": "Macros|Timing|Suplementos|Geral"}
  ]
}
Foco em informacoes cientificas, sem sensationalismo.`,

  swaps: `${NUTRITION_CONTENT_SYSTEM_INSTRUCTION}

Gere 16 substituicoes inteligentes de alimentos em JSON valido:
{
  "swaps": [
    {"from": "Alimento original", "to": "Substituicao", "reason": "Razao nutricional", "category": "Proteinas|Carboidratos|Gorduras|Lanches"}
  ]
}
Foco em alternativas mais saudaveis ou economicas.`,

  challenges: `${NUTRITION_CONTENT_SYSTEM_INSTRUCTION}

Gere 8 desafios semanais de nutricao em JSON valido:
{
  "challenges": [
    {"title": "Nome do desafio", "desc": "Descricao", "duration": "X dias", "reward": num, "difficulty": "Facil|Medio|Dificil", "category": "Hidratacao|Proteina|Geral"}
  ]
}`,

  tips: `${NUTRITION_CONTENT_SYSTEM_INSTRUCTION}

Gere 10 dicas educativas sobre nutricao em JSON valido:
{
  "tips": [
    {"title": "Titulo curto", "content": "Conteudo explicativo (2-3 frases)", "category": "Hidratacao|Proteina|Sono|Carboidratos|Timing|Gorduras|Progressao|Descanso"}
  ]
}`,

  recipes: `${NUTRITION_CONTENT_SYSTEM_INSTRUCTION}

Gere receitas e guia de meal prep em JSON valido:
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

async function fetchFromGemini(prompt) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const API_BASE = process.env.EXPO_PUBLIC_API_URL;
    if (!token || !API_BASE) return null;

    const response = await fetch(`${API_BASE}/api/ai/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (!response.ok) return null;

    const text = data.response || '';
    if (!text) return null;

    const sanitized = sanitizeAIOutput(text);
    const jsonMatch = sanitized.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch (error) {
    if (__DEV__) console.error('Erro Gemini:', error);
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
    if (__DEV__) console.error('Erro ao cachear:', err);
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
