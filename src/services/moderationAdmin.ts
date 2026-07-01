// src/services/moderationAdmin.js
// Relatorios e gestao de moderacao (admin)

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'moderationAdmin' });

export async function getCustomBannedWords() {
  const { data } = await supabase.from(TABLES.MODERATION_CUSTOM_WORDS).select('*').eq('is_active', true);
  return data || [];
}

export async function addCustomBannedWord(word, category, addedBy) {
  const result = await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.MODERATION_CUSTOM_WORDS).insert({
      word: word.toLowerCase().trim(), category: category || 'custom', added_by: addedBy,
    });
    if (error) throw error;
    return true;
  });
  return result.ok ? result.data : false;
}

export async function removeCustomBannedWord(wordId) {
  const result = await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.MODERATION_CUSTOM_WORDS).delete().eq('id', wordId);
    if (error) throw error;
    return true;
  });
  return result.ok ? result.data : false;
}

export async function getUserViolationPattern(userId) {
  const { data: logs } = await supabase.from(TABLES.AUDIT_LOG)
    .select('action, details, created_at')
    .eq('user_id', userId).eq('action', 'content_flagged')
    .order('created_at', { ascending: false }).limit(50);

  if (!logs?.length) return { pattern: 'clean', total: 0 };

  const categories: Record<string, number> = {};
  logs.forEach(log => {
    (log.details?.flags || []).forEach(f => { categories[f.category || f.type] = (categories[f.category || f.type] || 0) + 1; });
  });

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  return { pattern: topCategory ? topCategory[0] : 'unknown', total: logs.length, categories, recentFlags: logs.slice(0, 5) };
}

export async function getModerationStats() {
  const [blocksResult, flagsResult, trustResult] = await Promise.all([
    supabase.from(TABLES.USER_BLOCKS).select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from(TABLES.CONTENT_FLAGS).select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from(TABLES.USER_TRUST).select('trust_score').lte('trust_score', 30),
  ]);
  return { activeBlocks: blocksResult.count || 0, pendingFlags: flagsResult.count || 0, lowTrustUsers: trustResult.data?.length || 0 };
}

export async function getRecentViolations(limit = 20) {
  const { data } = await supabase.from(TABLES.AUDIT_LOG)
    .select('*, profiles:user_id(name, email)')
    .eq('action', 'content_flagged')
    .order('created_at', { ascending: false }).limit(limit);
  return data || [];
}
