// src/services/creatorProfile.ts
// Perfil e busca de criadores

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'creatorProfile' });

export async function getCreatorProfile(userId) {
  const { data } = await supabase    .from(TABLES.CREATOR_PROFILES)
    .select('*, profiles:user_id(name, avatar_url)').eq('user_id', userId).single();
  return data;
}

export async function becomeCreator(userId, { displayName, bio, category }) {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase    .from(TABLES.CREATOR_PROFILES)
      .upsert({ user_id: userId, display_name: displayName, bio, category: category || 'fitness' }, { onConflict: 'user_id' })
      .select().single();
    if (error) throw error;
    return data;
  });
  return result.ok ? result.data : null;
}

export async function getTopCreators(limit = 20) {
  const { data } = await supabase    .from(TABLES.CREATOR_PROFILES)
    .select('*, profiles:user_id(name, avatar_url)')
    .eq('status', 'active').order('subscriber_count', { ascending: false }).limit(limit);
  return data || [];
}

export async function searchCreators(query) {
  const { data } = await supabase    .from(TABLES.CREATOR_PROFILES)
    .select('*, profiles:user_id(name, avatar_url)')
    .ilike('display_name', `%${query}%`).eq('status', 'active').limit(20);
  return data || [];
}

// Revenue & Stats (moved from creator.ts barrel)

interface CreatorRevenue {
  id: string;
  creator_id: string;
  amount: number;
  created_at: string;
}

interface CreatorStats {
  activeSubscribers: number;
  totalContent: number;
  totalEarned: number;
  subscriberCount: number;
}

export async function getCreatorRevenue(creatorId: string): Promise<CreatorRevenue[]> {
  const { data } = await supabase.from('creator_revenue')
    .select('*').eq('creator_id', creatorId).order('created_at', { ascending: false });
  return (data || []) as CreatorRevenue[];
}

export async function getCreatorStats(creatorId: string): Promise<CreatorStats> {
  const [{ data: subs }, { data: content }, { data: profile }] = await Promise.all([
    supabase.from('creator_subscriptions').select('price_brl', { count: 'exact' }).eq('creator_id', creatorId).eq('status', 'active'),
    supabase.from('creator_content').select('id', { count: 'exact' }).eq('creator_id', creatorId),
    supabase.from('creator_profiles').select('total_earned, subscriber_count').eq('user_id', creatorId).single(),
  ]);
  return {
    activeSubscribers: subs?.length || 0,
    totalContent: content?.length || 0,
    totalEarned: profile?.total_earned || 0,
    subscriberCount: profile?.subscriber_count || 0,
  };
}
