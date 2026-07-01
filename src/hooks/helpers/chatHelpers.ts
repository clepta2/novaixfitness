// src/hooks/helpers/chatHelpers.ts
// Helpers for chat coach message formatting

import type { SupabaseClient } from '@supabase/supabase-js';

interface ChatProfile {
  physical_data?: { weight?: number; height?: number; age?: number };
  onboarding?: { weight?: number; height?: number; age?: number; goal?: string; gymType?: string; level?: string };
  subscription_plan?: string;
}

interface ChatContext {
  subscriptionPlan: string | undefined;
  weight: number | undefined;
  height: number | undefined;
  age: number | undefined;
  goal: string | undefined;
  gymType: string | undefined;
  level: string | undefined;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  [key: string]: unknown;
}

export function buildChatContext(profile: ChatProfile): ChatContext {
  const pd = profile?.physical_data || {};
  const ob = profile?.onboarding || {};
  return {
    subscriptionPlan: profile?.subscription_plan,
    weight: pd.weight || ob.weight,
    height: pd.height || ob.height,
    age: pd.age || ob.age,
    goal: ob.goal,
    gymType: ob.gymType,
    level: ob.level,
  };
}

export function createWelcomeMessage(userName: string): ChatMessage {
  return {
    id: 'welcome',
    text: `Ola, ${userName}! Sou seu Coach e Nutricionista de IA. Posso te ajudar com treinos, dieta, recuperacao e mais. Como posso ajudar?`,
    isUser: false,
  };
}

export function createCoachMessage(text: string, extras: Partial<ChatMessage> = {}): ChatMessage {
  return { id: (Date.now() + 1).toString(), text, isUser: false, ...extras };
}

export function createUserMessage(text: string): ChatMessage {
  return { id: Date.now().toString(), text, isUser: true };
}

export async function cleanupLimitExceededMessage(
  user: { id: string },
  msg: string,
  supabase: SupabaseClient
): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await supabase.from('coach_chat_messages').delete()
      .eq('user_id', user.id).eq('message', msg).eq('is_user', true)
      .gte('created_at', today.toISOString());
  } catch (dbErr) {
    if (__DEV__) console.error('Erro ao deletar mensagem excedente:', dbErr);
  }
}
