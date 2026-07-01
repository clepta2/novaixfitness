// src/services/moderation.ts
// Serviço de moderação: report e block

import { supabase } from '../config/supabase';
import { createServiceGuard } from '../utils/serviceGuard';

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
    const { error } = await supabase.from('reports').insert({
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
    const { error } = await supabase.from('blocked_users').upsert({
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
      .from('blocked_users')
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
    .from('blocked_users')
    .select('blocked_id')
    .eq('user_id', userId);

  return (data || []).map(d => d.blocked_id);
}

export async function isBlockedBy(userId: string, targetId: string): Promise<boolean> {
  const { data } = await supabase
    .from('blocked_users')
    .select('id')
    .eq('user_id', targetId)
    .eq('blocked_id', userId)
    .single();

  return !!data;
}
