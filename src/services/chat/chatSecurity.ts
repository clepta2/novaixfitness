// src/services/chatSecurity.ts
// Segurança do chat - Regras 81-85

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { tryIf } from '../../utils/tryIf';

// ═══════════════════════════════════════════
// REGRA 81: Validação JWT no Handshake
// ═══════════════════════════════════════════

export async function validateChatToken(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const result = await tryIf(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id === userId;
  }, { retries: 1 });
  
  return result.ok ? result.data : false;
}

// ═══════════════════════════════════════════
// REGRA 82: Validação de Escopo de Canal
// ═══════════════════════════════════════════

export async function validateChannelAccess(userId: string, conversationId: string): Promise<boolean> {
  if (!userId || !conversationId) return false;
  
  const result = await tryIf(async () => {
    const { data } = await supabase
      .from(TABLES.CONVERSATION_MEMBERS)
      .select('conversation_id')
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)
      .maybeSingle();
    
    return !!data;
  }, { retries: 1 });
  
  return result.ok ? result.data : false;
}

// ═══════════════════════════════════════════
// REGRA 83: Rate Limiting para Mensagens
// ═══════════════════════════════════════════

const messageTimestamps: Map<string, number[]> = new Map();
const MAX_MESSAGES_PER_SECOND = 5;
const RATE_LIMIT_WINDOW = 5000; // 5 segundos

export function checkMessageRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = messageTimestamps.get(userId) || [];
  
  // Limpar timestamps antigos
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (validTimestamps.length >= MAX_MESSAGES_PER_SECOND) {
    const oldestInWindow = validTimestamps[0];
    const retryAfter = RATE_LIMIT_WINDOW - (now - oldestInWindow);
    return { allowed: false, retryAfter };
  }
  
  validTimestamps.push(now);
  messageTimestamps.set(userId, validTimestamps);
  
  return { allowed: true };
}

// ═══════════════════════════════════════════
// REGRA 84: Sanitização Anti-XSS
// ═══════════════════════════════════════════

const DANGEROUS_TAGS = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const HTML_TAGS = /<[^>]*>/g;
const EVENT_HANDLERS = /\bon\w+\s*=/gi;
const JAVASCRIPT_URLS = /javascript\s*:/gi;

export function sanitizeMessage(content: string): string {
  if (!content) return '';
  
  let sanitized = content;
  
  // Remover tags script
  sanitized = sanitized.replace(DANGEROUS_TAGS, '');
  
  // Remover atributos de eventos
  sanitized = sanitized.replace(EVENT_HANDLERS, '');
  
  // Remover URLs javascript:
  sanitized = sanitized.replace(JAVASCRIPT_URLS, '');
  
  // Remover HTML tags (manter texto)
  sanitized = sanitized.replace(HTML_TAGS, (match) => {
    // Permitir apenas tags de formatação básica
    const allowedTags = ['b', 'i', 'u', 'em', 'strong', 'br'];
    const tagMatch = match.match(/<(\w+)/);
    if (tagMatch && allowedTags.includes(tagMatch[1].toLowerCase())) {
      return match;
    }
    return '';
  });
  
  return sanitized.trim();
}

// ═══════════════════════════════════════════
// REGRA 85: Paginação Estrita
// ═══════════════════════════════════════════

const MAX_MESSAGES_PER_PAGE = 30;
const MIN_MESSAGES_PER_PAGE = 10;

export function validatePageSize(limit: number): number {
  return Math.max(MIN_MESSAGES_PER_PAGE, Math.min(MAX_MESSAGES_PER_PAGE, limit));
}

// ═══════════════════════════════════════════
// Função segura para enviar mensagem
// ═══════════════════════════════════════════

export async function safeSendMessage(
  conversationId: string,
  userId: string,
  content: string,
  type: string = 'text'
): Promise<{ success: boolean; error?: string; message?: any; retryAfter?: number }> {
  // 1. Validar token
  if (!await validateChatToken(userId)) {
    return { success: false, error: 'Token inválido' };
  }
  
  // 2. Validar acesso ao canal
  if (!await validateChannelAccess(userId, conversationId)) {
    return { success: false, error: 'Sem acesso ao canal' };
  }
  
  // 3. Verificar rate limit
  const rateCheck = checkMessageRateLimit(userId);
  if (!rateCheck.allowed) {
    return { success: false, error: 'Muitas mensagens', retryAfter: rateCheck.retryAfter };
  }
  
  // 4. Sanitizar conteúdo
  const sanitizedContent = sanitizeMessage(content);
  
  // 5. Enviar mensagem
  const result = await tryIf(async () => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content: sanitizedContent,
        type,
      })
      .select('*, profiles:user_id(name, avatar_url)')
      .single();
    
    if (error) throw error;
    
    // Atualizar timestamp da conversa
    await supabase.from(TABLES.CONVERSATIONS)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    return data;
  }, { retries: 2, baseDelay: 500 });
  
  if (result.ok) {
    return { success: true, message: result.data };
  }
  return { success: false, error: result.error?.message };
}

// ═══════════════════════════════════════════
// Função segura para obter mensagens
// ═══════════════════════════════════════════

export async function safeGetMessages(
  conversationId: string,
  userId: string,
  limit: number = 30,
  before?: string
): Promise<any[]> {
  // Validar acesso
  if (!await validateChannelAccess(userId, conversationId)) {
    return [];
  }
  
  // Validar tamanho da página
  const safeLimit = validatePageSize(limit);
  
  const result = await tryIf(async () => {
    let query = supabase
      .from(TABLES.MESSAGES)
      .select('*, profiles:user_id(name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(safeLimit);
    
    if (before) {
      query = query.lt('created_at', before);
    }
    
    const { data } = await query;
    return (data || []).reverse();
  }, { retries: 1 });
  
  return result.ok ? result.data : [];
}
