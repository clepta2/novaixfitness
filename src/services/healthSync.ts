import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';

let HealthKit: any = null;
let GoogleFit: any = null;

if (Platform.OS === 'ios') {
  try { HealthKit = require('expo-health'); } catch (e: any) { if (__DEV__) console.warn('healthSync:', e); }
} else if (Platform.OS === 'android') {
  try { GoogleFit = require('react-native-google-fit'); } catch (e: any) { if (__DEV__) console.warn('healthSync:', e); }
}

export function getHealthLibs() {
  return { HealthKit, GoogleFit };
}

export async function syncWeightFromHealth(userId: string) {
  if (Platform.OS === 'ios' && HealthKit) {
    try {
      const end = new Date();
      const start = new Date(end.getTime() - 30 * 86400000);
      const samples = await HealthKit.getSamplesAsync(HealthKit.HealthkitQuantityTypeIdentifierBodyMass, start, end);
      for (const sample of samples) {
        await supabase.from(TABLES.WEIGHT_LOGS).upsert({
          user_id: userId, weight: sample.quantity, recorded_at: sample.startDate, source: 'apple_health',
        }, { onConflict: 'user_id,recorded_at' });
      }
      return samples.length;
    } catch (err: any) {
      if (__DEV__) console.warn('Erro ao sincronizar peso Apple Health:', err);
      return 0;
    }
  }
  if (Platform.OS === 'android' && GoogleFit) {
    try {
      const opt = { startDate: new Date(Date.now() - 30 * 86400000).toISOString(), endDate: new Date().toISOString() };
      const data = await GoogleFit.getWeightSamples(opt);
      for (const sample of data) {
        await supabase.from(TABLES.WEIGHT_LOGS).upsert({
          user_id: userId, weight: sample.value, recorded_at: sample.date, source: 'google_fit',
        }, { onConflict: 'user_id,recorded_at' });
      }
      return data.length;
    } catch (err: any) {
      if (__DEV__) console.warn('Erro ao sincronizar peso Google Fit:', err);
      return 0;
    }
  }
  return 0;
}

export async function syncStepsFromHealth(userId: string) {
  if (Platform.OS === 'ios' && HealthKit) {
    try {
      const end = new Date();
      const start = new Date(end.getTime() - 7 * 86400000);
      const samples = await HealthKit.getSamplesAsync(HealthKit.HealthkitQuantityTypeIdentifierStepCount, start, end);
      const dailySteps: Record<string, number> = {};
      for (const sample of samples) {
        const date = new Date(sample.startDate).toDateString();
        dailySteps[date] = (dailySteps[date] || 0) + (sample.quantity as number);
      }
      for (const [date, steps] of Object.entries(dailySteps)) {
        await supabase.from(TABLES.STEP_LOGS).upsert({
          user_id: userId, steps, recorded_at: new Date(date).toISOString(), source: 'apple_health',
        }, { onConflict: 'user_id,recorded_at' });
      }
      return Object.values(dailySteps).reduce((a, b) => a + b, 0);
    } catch (err: any) {
      if (__DEV__) console.warn('Erro ao sincronizar passos Apple Health:', err);
      return 0;
    }
  }
  if (Platform.OS === 'android' && GoogleFit) {
    try {
      const opt = { startDate: new Date(Date.now() - 7 * 86400000).toISOString(), endDate: new Date().toISOString() };
      const data = await GoogleFit.getDailyStepCountSamples(opt);
      let totalSteps = 0;
      for (const source of data) {
        if (source.steps) {
          for (const step of source.steps) {
            totalSteps += step.value;
            await supabase.from(TABLES.STEP_LOGS).upsert({
              user_id: userId, steps: step.value, recorded_at: step.date, source: 'google_fit',
            }, { onConflict: 'user_id,recorded_at' });
          }
        }
      }
      return totalSteps;
    } catch (err: any) {
      if (__DEV__) console.warn('Erro ao sincronizar passos Google Fit:', err);
      return 0;
    }
  }
  return 0;
}

export async function syncCaloriesFromHealth(userId: string) {
  if (Platform.OS === 'ios' && HealthKit) {
    try {
      const end = new Date();
      const start = new Date(end.getTime() - 7 * 86400000);
      const samples = await HealthKit.getSamplesAsync(HealthKit.HealthkitQuantityTypeIdentifierActiveEnergyBurned, start, end);
      const dailyCalories: Record<string, number> = {};
      for (const sample of samples) {
        const date = new Date(sample.startDate).toDateString();
        dailyCalories[date] = (dailyCalories[date] || 0) + (sample.quantity as number);
      }
      for (const [date, calories] of Object.entries(dailyCalories)) {
        await supabase.from(TABLES.CALORIE_LOGS).upsert({
          user_id: userId, calories: Math.round(calories), recorded_at: new Date(date).toISOString(), source: 'apple_health',
        }, { onConflict: 'user_id,recorded_at' });
      }
      return Object.values(dailyCalories).reduce((a, b) => a + b, 0);
    } catch (err: any) {
      if (__DEV__) console.warn('Erro ao sincronizar calorias Apple Health:', err);
      return 0;
    }
  }
  if (Platform.OS === 'android' && GoogleFit) {
    try {
      const opt = { startDate: new Date(Date.now() - 7 * 86400000).toISOString(), endDate: new Date().toISOString() };
      const data = await GoogleFit.getDailyCalorieSamples(opt);
      let totalCalories = 0;
      for (const sample of data) {
        totalCalories += Math.abs(sample.calorie);
        await supabase.from(TABLES.CALORIE_LOGS).upsert({
          user_id: userId, calories: Math.round(Math.abs(sample.calorie)), recorded_at: sample.date, source: 'google_fit',
        }, { onConflict: 'user_id,recorded_at' });
      }
      return totalCalories;
    } catch (err: any) {
      if (__DEV__) console.warn('Erro ao sincronizar calorias Google Fit:', err);
      return 0;
    }
  }
  return 0;
}
