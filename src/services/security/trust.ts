// src/services/security/trust.js
// Trust score

import { supabase } from '../../config/supabase';

interface TrustScore {
  trust_score: number;
  warnings_count: number;
  blocks_count: number;
}

export async function getTrustScore(userId: string): Promise<TrustScore> {
  const { data } = await supabase
    .from('user_trust')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data || { trust_score: 100, warnings_count: 0, blocks_count: 0 };
}

export async function getAllUsersWithTrust() {
  const { data } = await supabase
    .from('user_trust')
    .select('*, profiles:user_id(name, email, avatar_url)')
    .order('trust_score', { ascending: true });
  return data || [];
}
