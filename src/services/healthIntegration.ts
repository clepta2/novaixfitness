import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { getHealthLibs, syncWeightFromHealth, syncStepsFromHealth, syncCaloriesFromHealth } from './healthSync';

export { syncWeightFromHealth, syncStepsFromHealth, syncCaloriesFromHealth };

export async function requestHealthPermissions() {
  const { HealthKit, GoogleFit } = getHealthLibs();

  if (Platform.OS === 'ios' && HealthKit) {
    const { status } = await HealthKit.requestPermissionsAsync([
      HealthKit.HealthkitPermissionsIdentifier.StepCount,
      HealthKit.HealthkitPermissionsIdentifier.ActiveEnergyBurned,
      HealthKit.HealthkitPermissionsIdentifier.Weight,
      HealthKit.HealthkitPermissionsIdentifier.Height,
    ]);
    return status === 'granted';
  }

  if (Platform.OS === 'android' && GoogleFit) {
    try { await GoogleFit.authorize(); return true; } catch { return false; }
  }

  return false;
}

export async function syncAllHealthData(userId) {
  const [weight, steps, calories] = await Promise.all([
    syncWeightFromHealth(userId),
    syncStepsFromHealth(userId),
    syncCaloriesFromHealth(userId),
  ]);
  return { weight, steps, calories };
}

export function isHealthAvailable() {
  const { HealthKit, GoogleFit } = getHealthLibs();
  return (Platform.OS === 'ios' && HealthKit) || (Platform.OS === 'android' && GoogleFit);
}

export async function getHealthSummary(userId) {
  const { data: weights } = await supabase.from('weight_logs').select('weight')
    .eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1);
  const { data: steps } = await supabase.from('step_logs').select('steps')
    .eq('user_id', userId).gte('recorded_at', new Date(Date.now() - 7 * 86400000).toISOString());
  const { data: calories } = await supabase.from('calorie_logs').select('calories')
    .eq('user_id', userId).gte('recorded_at', new Date(Date.now() - 7 * 86400000).toISOString());

  return {
    currentWeight: weights?.[0]?.weight || null,
    weeklySteps: (steps || []).reduce((sum, s) => sum + s.steps, 0),
    weeklyCalories: (calories || []).reduce((sum, c) => sum + c.calories, 0),
  };
}
