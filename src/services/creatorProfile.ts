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
