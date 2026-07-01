// src/services/creator.ts
// Sistema de Criadores - re-exportacao

import { supabase } from '../config/supabase';
export { getCreatorProfile, becomeCreator, getTopCreators, searchCreators } from './creatorProfile';
export { subscribeToCreator, cancelSubscription, isSubscribedTo } from './creatorSubscription';
export { createContent, getCreatorContent, getFreeContent, accessPremiumContent } from './creatorContent';

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
