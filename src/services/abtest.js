// src/services/abtest.js
// Servico de A/B Testing - NOVAIX FITNESS

import { supabase } from '../config/supabase';

const AB_TESTS = {
  paywall: {
    id: 'paywall_v1',
    variants: ['control', 'variant_b'],
    weights: [50, 50],
  },
};

export async function getVariant(userId, testId) {
  const test = AB_TESTS[testId];
  if (!test) return 'control';

  const { data } = await supabase
    .from('ab_test_assignments')
    .select('variant')
    .eq('user_id', userId)
    .eq('test_id', test.id)
    .single();

  if (data) return data.variant;

  const variant = assignVariant(test);

  await supabase.from('ab_test_assignments').insert({
    user_id: userId,
    test_id: test.id,
    variant,
  });

  return variant;
}

function assignVariant(test) {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (let i = 0; i < test.variants.length; i++) {
    cumulative += test.weights[i];
    if (random < cumulative) return test.variants[i];
  }

  return test.variants[0];
}

export async function trackConversion(userId, testId, event, value = null) {
  const test = AB_TESTS[testId];
  if (!test) return;

  const { data } = await supabase
    .from('ab_test_assignments')
    .select('variant')
    .eq('user_id', userId)
    .eq('test_id', test.id)
    .single();

  if (!data) return;

  await supabase.from('ab_test_events').insert({
    user_id: userId,
    test_id: test.id,
    variant: data.variant,
    event,
    value,
  });
}

export async function trackPaywallView(userId) {
  await trackConversion(userId, 'paywall', 'view');
}

export async function trackPaywallClick(userId, planType) {
  await trackConversion(userId, 'paywall', 'click_subscribe', planType);
}

export async function trackPaywallConversion(userId, planType, revenue) {
  await trackConversion(userId, 'paywall', 'convert', { planType, revenue });
}

export async function trackPaywallSkip(userId) {
  await trackConversion(userId, 'paywall', 'skip');
}
