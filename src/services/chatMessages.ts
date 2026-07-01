// src/services/chatMessages.ts
// Mensagens do chat

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import type { ChatMessage, MessageType } from '../types';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'chatMessages' });

export async function getMessages(conversationId: string, limit: number = 50, before: string | null = null): Promise<ChatMessage[]> {
  let query = supabase
    .from(TABLES.MESSAGES)
    .select('*, profiles:user_id(name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (before) query = query.lt('created_at', before);
  const { data } = await query;
  return ((data || []).reverse()) as ChatMessage[];
}

export async function sendMessage(
  conversationId: string, userId: string, content: string,
  type: MessageType = 'text', replyTo: string | null = null,
): Promise<ChatMessage | null> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .insert({ conversation_id: conversationId, user_id: userId, content, type, reply_to: replyTo })
      .select('*, profiles:user_id(name, avatar_url)')
      .single();
    if (error) throw error;
    await supabase.from(TABLES.CONVERSATIONS).update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
    return data as ChatMessage;
  });
  return result.ok ? result.data : null;
}

export async function editMessage(messageId: string, userId: string, newContent: string): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.MESSAGES)
      .update({ content: newContent, edited: true })
      .eq('id', messageId).eq('user_id', userId);
    if (error) throw error;
  });
}

export async function deleteMessage(messageId: string, userId: string): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.MESSAGES)
      .update({ deleted: true, content: 'Mensagem apagada' })
      .eq('id', messageId).eq('user_id', userId);
    if (error) throw error;
  });
}

export async function searchMessages(conversationId: string, query: string): Promise<ChatMessage[]> {
  const result = await guard.guard(async () => {
    const { data } = await supabase
      .from(TABLES.MESSAGES)
      .select('*, profiles:user_id(name, avatar_url)')
      .eq('conversation_id', conversationId)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20);
    return (data || []) as ChatMessage[];
  });
  return result.ok ? result.data : [];
}
