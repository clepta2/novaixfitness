// src/services/offlineManager.js
// Gerenciador de modo offline - cache de treinos e dados

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

const CACHE_KEYS = {
  WORKOUTS: '@novaix:cached_workouts',
  PROFILE: '@novaix:cached_profile',
  LAST_SYNC: '@novaix:last_sync',
};

export async function cacheWorkouts(userId) {
  if (!userId) return;
  try {
    const { data } = await supabase.from('user_plans').select('*').eq('user_id', userId).eq('is_active', true);
    if (data) {
      await AsyncStorage.setItem(CACHE_KEYS.WORKOUTS, JSON.stringify({ data, timestamp: Date.now() }));
    }
  } catch (err) { console.error('Erro ao cachear treinos:', err); }
}

export async function getCachedWorkouts() {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.WORKOUTS);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return null;
    return data;
  } catch { return null; }
}

export async function cacheProfile(userId) {
  if (!userId) return;
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify({ data, timestamp: Date.now() }));
    }
  } catch (err) { console.error('Erro ao cachear perfil:', err); }
}

export async function getCachedProfile() {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.PROFILE);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) return null;
    return data;
  } catch { return null; }
}

export async function isOnline() {
  try {
    const response = await fetch('https://www.google.com', { method: 'HEAD', timeout: 5000 });
    return response.ok;
  } catch { return false; }
}

export async function syncOfflineData(userId) {
  if (!userId) return;
  const pending = await AsyncStorage.getItem('@novaix:pending_actions');
  if (!pending) return;
  const actions = JSON.parse(pending);
  for (const action of actions) {
    try {
      if (action.type === 'workout_complete') {
        await supabase.from('user_workouts').insert(action.data);
      }
    } catch (err) { console.error('Erro ao sincronizar:', err); }
  }
  await AsyncStorage.removeItem('@novaix:pending_actions');
}
