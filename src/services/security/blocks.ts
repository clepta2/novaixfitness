// src/services/security/blocks.js
// Verificação de bloqueios

import { supabase } from '../../config/supabase';

interface BlockResult {
  blocked: boolean;
  reason?: string;
  severity?: string;
}

export async function isBlocked(userId: string, blockType: string): Promise<BlockResult> {
  try {
    const { data } = await supabase.rpc('is_user_blocked', {
      p_user_id: userId,
      p_block_type: blockType,
    });
    return data || { blocked: false };
  } catch (err) {
    if (__DEV__) console.error('Erro ao verificar bloqueio:', err);
    return { blocked: false };
  }
}

export async function isBlockedFromPosting(userId: string) {
  return isBlocked(userId, 'post');
}

export async function isBlockedFromChatting(userId: string) {
  return isBlocked(userId, 'chat');
}

export async function isBlockedFromLive(userId: string) {
  return isBlocked(userId, 'live');
}

export async function isBlockedFromEverything(userId: string) {
  return isBlocked(userId, 'all');
}
