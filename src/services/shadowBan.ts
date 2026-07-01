// src/services/shadowBan.ts
// Shadow ban: usuário continua postando mas ninguém vê

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';

const VIOLATIONS_THRESHOLD = 3;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function checkAndShadowBan(userId: string): Promise<boolean> {
  const weekAgo = new Date(Date.now() - WEEK_MS).toISOString();

  const { count } = await supabase
    .from(TABLES.AUDIT_LOG)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', 'content_flagged')
    .gte('created_at', weekAgo);

  if ((count || 0) >= VIOLATIONS_THRESHOLD) {
    await supabase
      .from(TABLES.PROFILES)
      .update({ is_shadowbanned: true })
      .eq('id', userId);
    return true;
  }
  return false;
}

export async function isShadowBanned(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from(TABLES.PROFILES)
    .select('is_shadowbanned')
    .eq('id', userId)
    .single();

  return data?.is_shadowbanned === true;
}

export async function getShadowBannedPosts(
  userId: string,
  page = 0,
  limit = 20
): Promise<{ posts: unknown[]; isShadowBanned: boolean }> {
  const banned = await isShadowBanned(userId);
  const offset = page * limit;

  let query = supabase
    .from(TABLES.POSTS)
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (banned) {
    query = query.eq('user_id', userId);
  }

  const { data: posts } = await query;
  return { posts: posts || [], isShadowBanned: banned };
}
