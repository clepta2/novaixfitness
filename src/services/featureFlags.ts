// src/services/featureFlags.js
// Sistema de feature flags para A/B testing - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'featureFlags' });

const FLAGS_CACHE_KEY = '@novaix:feature_flags';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

let flagsCache = null;
let cacheTimestamp = null;

const DEFAULT_FLAGS = {
  new_onboarding_flow: false,
  advanced_analytics: false,
  social_duels: false,
  live_workouts: false,
  ai_coach_v2: false,
  nutrition_planner: false,
  workout_sharing: false,
  dark_mode_toggle: true,
  push_notifications: true,
  offline_mode: true,
  gamification_v2: false,
  referral_system: true,
  subscription_plans: true,
  health_integration: true,
  chat_coach: true,
  workout_history: true,
  progress_photos: true,
  body_measurements: true,
  weekly_reports: true,
  achievements: true,
};

export async function getFeatureFlags(userId = null) {
  const cached = await getCachedFlags();
  if (cached) return cached;

  try {
    let query = supabase
      .from('feature_flags')
      .select('*')
      .eq('enabled', true);

    if (userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;

    const flags = { ...DEFAULT_FLAGS };
    for (const flag of data || []) {
      flags[flag.key] = flag.value;
    }

    await cacheFlags(flags);
    return flags;
  } catch (err) {
    if (__DEV__) console.warn('Erro ao buscar feature flags:', err);
    return DEFAULT_FLAGS;
  }
}

export async function isFeatureEnabled(flagKey, userId = null) {
  const flags = await getFeatureFlags(userId);
  return flags[flagKey] ?? false;
}

export async function getVariant(flagKey, userId, variants = ['control', 'variant_a', 'variant_b']) {
  const { data } = await supabase
    .from('ab_test_assignments')
    .select('variant')
    .eq('flag_key', flagKey)
    .eq('user_id', userId)
    .single();

  if (data) return data.variant;

  const hash = hashString(`${flagKey}:${userId}`);
  const variantIndex = hash % variants.length;
  const variant = variants[variantIndex];

  await supabase
    .from('ab_test_assignments')
    .insert({
      flag_key: flagKey,
      user_id: userId,
      variant,
    });

  return variant;
}

export async function trackConversion(flagKey, userId, event) {
  await supabase
    .from('ab_test_conversions')
    .insert({
      flag_key: flagKey,
      user_id: userId,
      event,
    });
}

export async function createFeatureFlag(key, value, description, userId = null) {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase
      .from('feature_flags')
      .upsert({
        key,
        value,
        description,
        user_id: userId,
        enabled: true,
      }, { onConflict: 'key,user_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  });
  if (result.ok) await clearFlagsCache();
  return result.ok ? result.data : null;
}

export async function toggleFeatureFlag(key, enabled) {
  await guard.guard(async () => {
    const { error } = await supabase
      .from('feature_flags')
      .update({ enabled })
      .eq('key', key);
    if (error) throw error;
    await clearFlagsCache();
  });
}

async function getCachedFlags() {
  if (!flagsCache || !cacheTimestamp) return null;
  if (Date.now() - cacheTimestamp > CACHE_EXPIRY) {
    flagsCache = null;
    cacheTimestamp = null;
    return null;
  }
  return flagsCache;
}

async function cacheFlags(flags) {
  flagsCache = flags;
  cacheTimestamp = Date.now();
  try {
    await AsyncStorage.setItem(FLAGS_CACHE_KEY, JSON.stringify(flags));
  } catch (e) { if (__DEV__) console.warn('featureFlags:', e); }
}

async function clearFlagsCache() {
  flagsCache = null;
  cacheTimestamp = null;
  try {
    await AsyncStorage.removeItem(FLAGS_CACHE_KEY);
  } catch (e) { if (__DEV__) console.warn('featureFlags:', e); }
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
