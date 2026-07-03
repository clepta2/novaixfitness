// src/services/aiProxy.ts
// Serviço frontend que usa o proxy do backend - NOVAIX FITNESS
// A chave da API NÃO fica no frontend

import { supabase } from '../../config/supabase';
import { APP_CONFIG } from '../../config/app';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

interface GenerateOptions {
  prompt: string;
  type?: string;
  systemInstruction?: string;
}

/**
 * Chama o proxy de IA no backend
 * A chave da API fica segura no servidor
 */
export async function generateWithAI({ prompt, type = 'default', systemInstruction }: GenerateOptions): Promise<string> {
  if (!API_URL) {
    throw new Error('API_URL não configurada');
  }

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, type, systemInstruction }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || 'Erro ao chamar IA');
    }

    const data = await response.json();
    return data.response;
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Backend indisponível');
    }
    throw err;
  }
}

// ─── Funções de conveniência (substituem chamadas diretas) ──

export async function askGeminiCoach(message: string, profileContext: any = {}): Promise<string> {
  const systemInstruction = `Coach/Nutri IA NOVAIX: direto, motivador. Usuario: Peso ${profileContext.weight || '?'}kg, Altura ${profileContext.height || '?'}cm, Idade ${profileContext.age || '?'}a, Obj: ${profileContext.goal || 'Geral'}, Equip: ${profileContext.gymType || 'Geral'}, Nivel: ${profileContext.level || 'Geral'}. Responda em chat curto, max 3 paragrafos, objetivo.`;

  return generateWithAI({
    prompt: message,
    type: 'coach',
    systemInstruction,
  });
}

export async function generateMealAnalysis(mealText: string): Promise<any> {
  const prompt = `Analise a refeicao: "${mealText}". Retorne APENAS um objeto JSON valido com as chaves: calories, protein, carbs, fat. Sem markdown ou explicacoes. Exemplo: {"calories": 300, "protein": 20, "carbs": 30, "fat": 10}`;

  const response = await generateWithAI({ prompt, type: 'meal' });
  const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(clean);
}

export async function generateWorkoutPlan(context: any): Promise<string> {
  const prompt = `Gere um plano de treino personalizado para: Objetivo: ${context.goal}, Nivel: ${context.level}, Dias: ${context.days}, Duracao: ${context.duration}min, Equipamentos: ${context.equipment}`;

  return generateWithAI({ prompt, type: 'plan' });
}

export async function generateNutritionPlan(context: any): Promise<string> {
  const prompt = `Gere um plano nutricional para: Peso: ${context.weight}kg, Altura: ${context.height}cm, Idade: ${context.age}a, Objetivo: ${context.goal}, Restricoes: ${context.restrictions || 'Nenhuma'}`;

  return generateWithAI({ prompt, type: 'plan' });
}

export async function generateRecipe(ingredients: string[], preferences: any): Promise<string> {
  const prompt = `Gere uma receita saudavel usando: ${ingredients.join(', ')}. Preferencias: ${JSON.stringify(preferences)}`;

  return generateWithAI({ prompt, type: 'recipe' });
}

export async function generateShoppingList(mealPlan: any): Promise<string> {
  const prompt = `Gere uma lista de compras para este plano alimentar: ${JSON.stringify(mealPlan)}`;

  return generateWithAI({ prompt, type: 'shopping' });
}

export async function generateNutritionTips(context: any): Promise<string> {
  const prompt = `Gere dicas de nutricao personalizadas para: ${JSON.stringify(context)}`;

  return generateWithAI({ prompt, type: 'tips' });
}

export async function generateNutritionContent(topic: string): Promise<string> {
  const prompt = `Gere conteudo educativo sobre nutricao: ${topic}`;

  return generateWithAI({ prompt, type: 'nutrition' });
}
