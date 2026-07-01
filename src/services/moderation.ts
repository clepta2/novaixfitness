// src/services/moderation.ts
// Serviço de moderação: report, block e pre-moderação

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';
import { moderateText, moderateImage } from './moderationFilters';

const guard = createServiceGuard({ serviceName: 'moderation' });

interface ReportTarget {
  id: string;
}

interface ReportOptions {
  reason: string;
  details?: string;
  targetUser?: ReportTarget;
  targetPost?: ReportTarget;
}

export async function reportContent(
  reporterId: string,
  { reason, details, targetUser, targetPost }: ReportOptions,
): Promise<boolean> {
  const result = await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.REPORTS).insert({
      reporter_id: reporterId,
      reported_user_id: targetUser?.id || null,
      post_id: targetPost?.id || null,
      reason,
      details: details || null,
    });

    if (error) throw error;
    return true;
  });
  return result.ok ? result.data : false;
}

export async function blockUser(userId: string, blockedId: string): Promise<boolean> {
  const result = await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.BLOCKED_USERS).upsert({
      user_id: userId,
      blocked_id: blockedId,
    }, { onConflict: 'user_id,blocked_id' });

    if (error) throw error;
    return true;
  });
  return result.ok ? result.data : false;
}

export async function unblockUser(userId: string, blockedId: string): Promise<boolean> {
  const result = await guard.guard(async () => {
    const { error } = await supabase
      .from(TABLES.BLOCKED_USERS)
      .delete()
      .eq('user_id', userId)
      .eq('blocked_id', blockedId);

    if (error) throw error;
    return true;
  });
  return result.ok ? result.data : false;
}

export async function getBlockedUsers(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from(TABLES.BLOCKED_USERS)
    .select('blocked_id')
    .eq('user_id', userId);

  return (data || []).map(d => d.blocked_id);
}

export async function isBlockedBy(userId: string, targetId: string): Promise<boolean> {
  const { data } = await supabase
    .from(TABLES.BLOCKED_USERS)
    .select('id')
    .eq('user_id', targetId)
    .eq('blocked_id', userId)
    .single();

  return !!data;
}

// Pre-moderation (moved from contentModeration.ts)

interface PreModResult {
  allowed: boolean;
  blocked?: boolean;
  message?: string;
}

interface ContentInput {
  uri?: string;
}

export async function preModerateContent(
  userId: string,
  contentType: 'post' | 'message' | 'story',
  content: string | ContentInput,
): Promise<PreModResult> {
  const { data: blockStatus } = await supabase.rpc('is_user_blocked', {
    p_user_id: userId,
    p_block_type: contentType === 'post' ? 'post' : contentType === 'message' ? 'chat' : 'all',
  });
  if (blockStatus?.blocked) return { allowed: false, blocked: true, message: `Sua conta esta bloqueada: ${blockStatus.reason}` };

  const { data: trust } = await supabase.from(TABLES.USER_TRUST).select('trust_score').eq('user_id', userId).single();
  if (trust && trust.trust_score < 20) return { allowed: false, blocked: true, message: 'Sua conta esta restrita devido a violacoes repetidas.' };

  if (typeof content === 'string') return moderateText(content, userId);
  if (content?.uri) return moderateImage(content, userId);
  return { allowed: true };
}
