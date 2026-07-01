// src/services/creatorSubscription.js
// Assinaturas de criadores

import { supabase } from '../config/supabase';

export async function subscribeToCreator(creatorId, subscriberId, planType = 'monthly') {
  const prices = { monthly: 19.90, yearly: 199.00 };
  const price = prices[planType] || prices.monthly;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + (planType === 'monthly' ? 1 : 12));

  const { data, error } = await supabase.from('creator_subscriptions')
    .upsert({
      creator_id: creatorId, subscriber_id: subscriberId, plan_type: planType,
      price_brl: price, status: 'active', expires_at: expiresAt.toISOString(),
    }, { onConflict: 'creator_id,subscriber_id' }).select().single();
  if (error) throw error;
  await supabase.rpc('increment_column', { table_name: 'creator_profiles', column_name: 'subscriber_count', row_id: creatorId });
  return data;
}

export async function cancelSubscription(subscriptionId) {
  const { error } = await supabase.from('creator_subscriptions').update({ status: 'cancelled' }).eq('id', subscriptionId);
  if (error) throw error;
}

export async function isSubscribedTo(creatorId, subscriberId) {
  const { data } = await supabase.from('creator_subscriptions')
    .select('id, status').eq('creator_id', creatorId).eq('subscriber_id', subscriberId).eq('status', 'active').single();
  return !!data;
}
