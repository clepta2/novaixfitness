import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  WORKOUTS: '@novaix:workouts',
  WORKOUT_DETAILS: '@novaix:workout_details',
  FAVORITES: '@novaix:favorites',
  PROFILE: '@novaix:profile',
  LAST_SYNC: '@novaix:last_sync',
  PENDING_ACTIONS: '@novaix:pending_actions',
};

const MAX_CACHE_SIZE = 50 * 1024 * 1024;

export async function getCacheSize() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const novaixKeys = keys.filter(k => k.startsWith('@novaix:'));
    const items = await AsyncStorage.multiGet(novaixKeys);
    return items.reduce((total, [, val]) => total + (val ? val.length * 2 : 0), 0);
  } catch {
    return 0;
  }
}

export async function getCacheInfo() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const novaixKeys = keys.filter(k => k.startsWith('@novaix:'));
    const items = await AsyncStorage.multiGet(novaixKeys);
    const breakdown = {};
    let totalSize = 0;
    for (const [key, val] of items) {
      const size = val ? val.length * 2 : 0;
      totalSize += size;
      const shortKey = key.replace('@novaix:', '');
      breakdown[shortKey] = { size, count: val ? JSON.parse(val)?.length || 1 : 0 };
    }
    return { totalSize, breakdown, keyCount: novaixKeys.length, withinLimit: totalSize < MAX_CACHE_SIZE };
  } catch {
    return { totalSize: 0, breakdown: {}, keyCount: 0, withinLimit: true };
  }
}

export async function clearAllCache() {
  try {
    await AsyncStorage.multiRemove([
      CACHE_KEYS.WORKOUTS, CACHE_KEYS.WORKOUT_DETAILS, CACHE_KEYS.FAVORITES,
      CACHE_KEYS.PROFILE, CACHE_KEYS.LAST_SYNC, CACHE_KEYS.PENDING_ACTIONS,
    ]);
  } catch (err) {
    console.error('Erro ao limpar cache:', err);
  }
}

export async function clearWorkoutCache() {
  try {
    await AsyncStorage.multiRemove([CACHE_KEYS.WORKOUTS, CACHE_KEYS.WORKOUT_DETAILS]);
  } catch (err) {
    console.error('Erro ao limpar cache de treinos:', err);
  }
}
