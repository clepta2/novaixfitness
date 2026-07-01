// src/services/security/jwtBlocklist.ts
// JWT Blocklist — revogacao de tokens em tempo real
// Baseado no conceito: JWT com TTL curto + Refresh Token + Blocklist

import { supabase } from '../../config/supabase';

const BLOCKLIST_PREFIX = 'jwt:blocklist:';

// Adiciona token a blocklist (quando usuario desloga, e bloqueado, ou roubo)
export async function revokeToken(tokenId: string, expiresAt: number): Promise<void> {
  const ttlSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  if (ttlSeconds <= 0) return;

  try {
    await supabase.from('token_blocklist').upsert({
      token_id: tokenId,
      revoked_at: new Date().toISOString(),
      expires_at: new Date(expiresAt).toISOString(),
    });
  } catch (err) {
    if (__DEV__) console.error('[Blocklist] Erro ao revogar token:', err);
  }
}

// Verifica se token esta na blocklist
export async function isTokenRevoked(tokenId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('token_blocklist')
      .select('id')
      .eq('token_id', tokenId)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// Revoga todos os tokens de um usuario (logout geral, seguranca de conta)
export async function revokeAllUserTokens(userId: string): Promise<void> {
  try {
    await supabase.from('token_blocklist').upsert({
      token_id: `user:${userId}:all`,
      revoked_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (err) {
    if (__DEV__) console.error('[Blocklist] Erro ao revogar todos tokens:', err);
  }
}

// Verifica se todos os tokens de um usuario estao revogados
export async function areAllUserTokensRevoked(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('token_blocklist')
      .select('id')
      .eq('token_id', `user:${userId}:all`)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// Limpa blocklist de tokens expirados (manutencao periodica)
export async function cleanupExpiredBlocks(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('token_blocklist')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    return data?.length || 0;
  } catch {
    return 0;
  }
}
