// src/services/security/userBlocks.js
// Bloquear/desbloquear usuários

import { supabase } from '../../config/supabase';
import { createServiceGuard } from '../../utils/serviceGuard';
import { logAction, ACTIONS } from './audit';

const guard = createServiceGuard({ serviceName: 'userBlocks' });

interface BlockUserParams {
  reason: string;
  severity?: string;
  blockType?: string;
  durationHours?: number;
}

export async function blockUser(userId: string, blockedBy: string, { reason, severity, blockType, durationHours }: BlockUserParams) {
  const expiresAt = severity === 'permanent' ? null
    : new Date(Date.now() + (durationHours || 24) * 3600000).toISOString();

  const { error } = await supabase.from('user_blocks').insert({
    user_id: userId,
    blocked_by: blockedBy,
    reason,
    severity: severity || 'temporary',
    block_type: blockType || 'all',
    expires_at: expiresAt,
  });

  if (error) throw error;
  await logAction(blockedBy, ACTIONS.USER_BLOCKED, 'user', userId, { reason, severity, blockType });
  await supabase.rpc('update_trust_score', { p_user_id: userId, p_action: 'block_applied' });
  return true;
}

export async function unblockUser(blockId: string, unblockedBy: string) {
  const { error } = await supabase
    .from('user_blocks')
    .update({ is_active: false })
    .eq('id', blockId);
  if (error) throw error;
  await logAction(unblockedBy, ACTIONS.USER_UNBLOCKED, 'user', blockId);
  return true;
}

export async function getUserBlocks(userId: string) {
  const { data } = await supabase
    .from('user_blocks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getActiveBlocks(userId: string) {
  const { data } = await supabase
    .from('user_blocks')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());
  return data || [];
}
