// src/services/creatorSubscription.ts
// Assinaturas de criadores

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'creatorSubscription' });

export async function subscribeToCreator(creatorId, subscriberId, planType = 'monthly') {
  const result = await guard.guard(async () => {
    const prices = { monthly: 19.90, yearly: 199.00 };
    const price = prices[planType] || prices.monthly;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (planType === 'monthly' ? 1 : 12));

    const { data, error } = await supabase.from(TABLES.CREATOR_SUBSCRIPTIONS)
      .upsert({
        creator_id: creatorId, subscriber_id: subscriberId, plan_type: planType,
        price_brl: price, status: 'active', expires_at: expiresAt.toISOString(),
      }, { onConflict: 'creator_id,subscriber_id' }).select().single();
    if (error) throw error;
    await supabase.rpc('increment_column', { table_name: 'creator_profiles', column_name: 'subscriber_count', row_id: creatorId });
    return data;
  });
  return result.ok ? result.data : null;
}

export async function cancelSubscription(subscriptionId) {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.CREATOR_SUBSCRIPTIONS).update({ status: 'cancelled' }).eq('id', subscriptionId);
    if (error) throw error;
  });
}

export async function isSubscribedTo(creatorId, subscriberId) {
  const { data } = await supabase.from(TABLES.CREATOR_SUBSCRIPTIONS)
    .select('id, status').eq('creator_id', creatorId).eq('subscriber_id', subscriberId).eq('status', 'active').single();
  return !!data;
}
