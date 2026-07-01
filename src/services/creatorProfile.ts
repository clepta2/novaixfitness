// src/services/creatorProfile.js
// Perfil e busca de criadores

import { supabase } from '../config/supabase';

export async function getCreatorProfile(userId) {
  const { data } = await supabase.from('creator_profiles')
    .select('*, profiles:user_id(name, avatar_url)').eq('user_id', userId).single();
  return data;
}

export async function becomeCreator(userId, { displayName, bio, category }) {
  const { data, error } = await supabase.from('creator_profiles')
    .upsert({ user_id: userId, display_name: displayName, bio, category: category || 'fitness' }, { onConflict: 'user_id' })
    .select().single();
  if (error) throw error;
  return data;
}

export async function getTopCreators(limit = 20) {
  const { data } = await supabase.from('creator_profiles')
    .select('*, profiles:user_id(name, avatar_url)')
    .eq('status', 'active').order('subscriber_count', { ascending: false }).limit(limit);
  return data || [];
}

export async function searchCreators(query) {
  const { data } = await supabase.from('creator_profiles')
    .select('*, profiles:user_id(name, avatar_url)')
    .ilike('display_name', `%${query}%`).eq('status', 'active').limit(20);
  return data || [];
}
