// src/services/gemini.ts
// Integração com IA via proxy do backend - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { APP_CONFIG } from '../../config/app';
import { tryIf } from '../../utils/tryIf';
import { askGeminiCoach as proxyAskGeminiCoach, generateMealAnalysis as proxyGenerateMealAnalysis } from './aiProxy';
import { generateFallbackResponse } from '../geminiFallback';

export async function askGeminiCoach(message, profileContext: any = {}, conversationHistory = []) {
  const plan = profileContext.subscriptionPlan || 'free';
  const limit = APP_CONFIG.plans[plan]?.maxMessages ?? 0;

  // Verificar limite diário
  if (profileContext.userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limitResult = await tryIf(async () => {
      const { count, error } = await supabase
        .from('coach_chat_messages')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', profileContext.userId)
        .eq('is_user', true)
        .gte('created_at', today.toISOString());
      if (error) throw error;
      return count;
    }, { retries: 1, baseDelay: 500 });

    if (limitResult.ok && limitResult.data && limitResult.data > limit) {
      throw new Error('LIMIT_EXCEEDED');
    }
  }

  const result = await tryIf(async () => {
    return await proxyAskGeminiCoach(message, profileContext);
  }, { retries: 2, baseDelay: 500 });

  if (result.ok) return result.data;
  return generateFallbackResponse(message, profileContext);
}

export async function saveChatMessage(userId, message, isUser) {
  if (!userId) return;

  const result = await tryIf(async () => {
    await supabase.from('coach_chat_messages').insert({
      user_id: userId,
      message,
      is_user: isUser,
    });
  }, { retries: 2, baseDelay: 500 });
  return result.ok;
}

const MAX_HISTORY_MESSAGES = 5;

export async function getChatHistory(userId, limit = 50) {
  if (!userId) return [];

  const result = await tryIf(async () => {
    const { data } = await supabase
      .from('coach_chat_messages')
      .select('id, message, is_user, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    return (data || []).map(m => ({
      id: m.id,
      text: m.message,
      isUser: m.is_user,
    }));
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : [];
}

/**
 * Retorna apenas as ultimas N mensagens do historico (Regra 172)
 */
export function limitHistory(messages: any[], max = MAX_HISTORY_MESSAGES): any[] {
  if (!messages || messages.length <= max) return messages || [];
  return messages.slice(-max);
}

export async function clearChatHistory(userId) {
  if (!userId) return;

  const result = await tryIf(async () => {
    await supabase
      .from('coach_chat_messages')
      .delete()
      .eq('user_id', userId);
  }, { retries: 2, baseDelay: 500 });
  return result.ok;
}

export async function analyzeMealText(mealText) {
  const result = await tryIf(async () => {
    return await proxyGenerateMealAnalysis(mealText);
  }, { retries: 2, baseDelay: 500 });
  if (result.ok) return result.data;
  const calories = mealText.includes('ovo') ? 140 : mealText.includes('pão') ? 150 : 250;
  return { calories, protein: Math.round(calories * 0.06), carbs: Math.round(calories * 0.08), fat: Math.round(calories * 0.03) };
}

// Fallback importado de geminiFallback.ts
