// src/services/security/moderation.js
// Moderação de conteúdo

import { supabase } from '../../config/supabase';
import { createServiceGuard } from '../../utils/serviceGuard';
import { logAction, ACTIONS } from './audit';

const guard = createServiceGuard({ serviceName: 'moderation' });

interface FlagContentParams {
  targetUserId: string;
  contentType: string;
  contentId: string;
  reason: string;
  category?: string;
}

export async function flagContent(reporterId: string, { targetUserId, contentType, contentId, reason, category }: FlagContentParams) {
  const { error } = await supabase.from('content_flags').insert({
    reporter_id: reporterId,
    target_user_id: targetUserId,
    content_type: contentType,
    content_id: contentId,
    reason,
    category: category || 'other',
  });
  if (error) throw error;
  await logAction(reporterId, ACTIONS.CONTENT_FLAGGED, contentType, contentId, { reason, category, targetUserId });
  await supabase.rpc('update_trust_score', { p_user_id: targetUserId, p_action: 'content_flagged' });
  return true;
}

export async function getFlaggedContent(status = 'pending') {
  const { data } = await supabase
    .from('content_flags')
    .select('*, profiles:reporter_id(name), profiles:target_user_id(name)')
    .eq('status', status)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function reviewFlag(flagId: string, reviewerId: string, status: string, notes: string) {
  const { error } = await supabase
    .from('content_flags')
    .update({ status, reviewed_by: reviewerId, review_notes: notes })
    .eq('id', flagId);
  if (error) throw error;
  return true;
}
