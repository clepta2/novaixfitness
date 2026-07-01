// src/services/monetizationCoupons.ts
// Cupons e indicacoes

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { PLANS, type Coupon } from './monetizationPlans';

export async function applyCoupon(code: string, planId: string): Promise<Coupon | null> {
  const { data: coupon } = await supabase.from(TABLES.COUPONS)
    .select('*').eq('code', code.toUpperCase()).eq('active', true).single();

  if (!coupon) return null;
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return null;
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return null;

  const plan = PLANS[planId];
  if (!plan) return null;
  if (coupon.applies_to && coupon.applies_to !== planId && coupon.applies_to !== 'all') return null;

  const discount = coupon.type === 'percent' ? plan.price * (coupon.value / 100) : coupon.value;
  return {
    code: coupon.code,
    discount: Math.min(discount, plan.price),
    finalPrice: Math.max(0, plan.price - discount),
    type: coupon.type,
    value: coupon.value,
  };
}

export async function recordCouponUsage(couponCode: string, userId: string): Promise<void> {
  await supabase.from(TABLES.COUPON_USAGE).insert({ coupon_code: couponCode, user_id: userId });
  await supabase.rpc('increment_coupon_usage', { code: couponCode });
}

export async function createReferral(userId: string): Promise<string> {
  const code = `NOVAIX${userId.slice(0, 8).toUpperCase()}`;
  await supabase.from(TABLES.REFERRALS).upsert({ user_id: userId, code, referral_count: 0 }, { onConflict: 'user_id' });
  return code;
}

export async function applyReferral(referralCode: string, newUserId: string): Promise<{ referrerId: string; reward: number } | null> {
  const { data: referral } = await supabase.from(TABLES.REFERRALS)
    .select('*').eq('code', referralCode.toUpperCase()).single();
  if (!referral) return null;

  await supabase.from(TABLES.REFERRALS)
    .update({ referral_count: referral.referral_count + 1 }).eq('id', referral.id);

  await supabase.from(TABLES.REFERRAL_REWARDS).insert({
    user_id: referral.user_id, referred_user_id: newUserId,
    reward_type: 'subscription_days', reward_value: 7,
  });

  await supabase.from(TABLES.NOTIFICATIONS).insert({
    user_id: referral.user_id, type: 'referral_reward',
    title: 'Recompensa por indicacao!', body: 'Voce ganhou 7 dias gratis por indicar um amigo!',
    data: { days: 7 },
  });

  return { referrerId: referral.user_id, reward: 7 };
}

export async function getReferralStats(userId: string): Promise<{ code: string | null; referral_count: number }> {
  const { data } = await supabase.from(TABLES.REFERRALS).select('*').eq('user_id', userId).single();
  return data || { code: null, referral_count: 0 };
}
