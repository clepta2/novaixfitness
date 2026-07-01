// src/services/monetizationSubscription.ts
// Gerenciamento de assinaturas

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';
import { trackEvent, EVENT_TYPES } from './analyticsTracker';
import { PLANS, type Plan, type Subscription } from './monetizationPlans';

const guard = createServiceGuard({ serviceName: 'monetizationSubscription' });

export async function getUserPlan(userId: string): Promise<Plan & { subscription?: Subscription }> {
  const { data: subscription } = await supabase
    .from(TABLES.SUBSCRIPTIONS)
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!subscription) return PLANS.free;
  const plan = PLANS[subscription.plan_id];
  if (!plan) return PLANS.free;
  if (subscription.expires_at && new Date(subscription.expires_at) < new Date()) return PLANS.free;
  return { ...plan, subscription };
}

export async function checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  const limit = plan.limits?.[feature as keyof Plan['limits']];
  if (limit === undefined || limit === Infinity) return true;
  if (limit === false || limit === 0) return false;
  return true;
}

export async function getUsageStats(userId: string): Promise<{ workoutsThisWeek: number; aiChatsToday: number; customWorkouts: number }> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const [{ count: workoutsThisWeek }, { count: aiChatsToday }, { count: customWorkouts }] = await Promise.all([
    supabase.from(TABLES.USER_WORKOUTS).select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('completed', true).gte('completed_at', weekStart.toISOString()),
    supabase.from(TABLES.AI_CHAT_LOGS).select('id', { count: 'exact', head: true })
      .eq('user_id', userId).gte('created_at', todayStart.toISOString()),
    supabase.from(TABLES.CUSTOM_WORKOUTS).select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  return {
    workoutsThisWeek: workoutsThisWeek || 0,
    aiChatsToday: aiChatsToday || 0,
    customWorkouts: customWorkouts || 0,
  };
}

export async function createSubscription(userId: string, planId: string, paymentMethod: string): Promise<Subscription> {
  const plan = PLANS[planId];
  if (!plan || plan.price === 0) throw new Error('Invalid plan');

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const { data, error } = await supabase
    .from(TABLES.SUBSCRIPTIONS)
    .insert({
      user_id: userId, plan_id: planId, status: 'active',
      payment_method: paymentMethod, price: plan.price, expires_at: expiresAt.toISOString(),
    }).select().single();

  if (error) throw error;
  await supabase.from(TABLES.PROFILES).update({ subscription_plan: planId }).eq('id', userId);
  trackEvent(EVENT_TYPES.SUBSCRIPTION_STARTED, { plan_id: planId, price: plan.price }, userId);
  return data as Subscription;
}

export async function cancelSubscription(userId: string): Promise<void> {
  const { error } = await supabase.from(TABLES.SUBSCRIPTIONS)
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('user_id', userId).eq('status', 'active');
  if (error) throw error;
  await supabase.from(TABLES.PROFILES).update({ subscription_plan: 'free' }).eq('id', userId);
  trackEvent(EVENT_TYPES.SUBSCRIPTION_CANCELLED, {}, userId);
}

export async function getSubscriptionHistory(userId: string): Promise<Subscription[]> {
  const { data } = await supabase.from(TABLES.SUBSCRIPTIONS)
    .select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return (data || []) as Subscription[];
}
