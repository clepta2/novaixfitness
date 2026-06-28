import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  WORKOUTS: '@novaix:workouts',
  WORKOUT_DETAILS: '@novaix:workout_details',
  FAVORITES: '@novaix:favorites',
  PROFILE: '@novaix:profile',
  LAST_SYNC: '@novaix:last_sync',
  PENDING_ACTIONS: '@novaix:pending_actions',
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
const MAX_CACHED_DETAILS = 30;

export async function cacheWorkouts(workouts) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.WORKOUTS, JSON.stringify({ workouts, timestamp: Date.now() }));
  } catch (err) {
    console.error('Erro ao cachear workouts:', err);
  }
}

export async function getCachedWorkouts() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUTS);
    if (!raw) return null;
    const { workouts, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return workouts;
  } catch (err) {
    console.error('Erro ao ler workouts cache:', err);
    return null;
  }
}

export async function cacheFavorites(favorites) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify({ favorites, timestamp: Date.now() }));
  } catch (err) {
    console.error('Erro ao cachear favoritos:', err);
  }
}

export async function getCachedFavorites() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.FAVORITES);
    if (!raw) return null;
    const { favorites, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return favorites;
  } catch (err) {
    console.error('Erro ao ler favoritos cache:', err);
    return null;
  }
}

export async function cacheProfile(profile) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify({ profile, timestamp: Date.now() }));
  } catch (err) {
    console.error('Erro ao cachear perfil:', err);
  }
}

export async function getCachedProfile() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PROFILE);
    if (!raw) return null;
    const { profile, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return profile;
  } catch (err) {
    console.error('Erro ao ler perfil cache:', err);
    return null;
  }
}

export async function addPendingAction(action) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_ACTIONS);
    const actions = raw ? JSON.parse(raw) : [];
    actions.push({ ...action, id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now() });
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_ACTIONS, JSON.stringify(actions));
  } catch (err) {
    console.error('Erro ao adicionar ação pendente:', err);
  }
}

export async function getPendingActions() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_ACTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Erro ao ler ações pendentes:', err);
    return [];
  }
}

export async function clearPendingAction(actionId) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_ACTIONS);
    const actions = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_ACTIONS, JSON.stringify(actions.filter(a => a.id !== actionId)));
  } catch (err) {
    console.error('Erro ao remover ação pendente:', err);
  }
}

export async function clearAllPendingActions() {
  try {
    await AsyncStorage.removeItem(CACHE_KEYS.PENDING_ACTIONS);
  } catch (err) {
    console.error('Erro ao limpar ações pendentes:', err);
  }
}

export async function updateLastSync() {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
  } catch (err) {
    console.error('Erro ao atualizar último sync:', err);
  }
}

export async function getLastSync() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
    return raw ? parseInt(raw, 10) : null;
  } catch (err) {
    console.error('Erro ao ler último sync:', err);
    return null;
  }
}

export async function cacheWorkoutDetail(workout) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    const cache = raw ? JSON.parse(raw) : {};
    cache[workout.id] = { workout, timestamp: Date.now() };
    const ids = Object.keys(cache);
    if (ids.length > MAX_CACHED_DETAILS) {
      const sorted = ids.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
      for (let i = 0; i < ids.length - MAX_CACHED_DETAILS; i++) delete cache[sorted[i]];
    }
    await AsyncStorage.setItem(CACHE_KEYS.WORKOUT_DETAILS, JSON.stringify(cache));
  } catch (err) {
    console.error('Erro ao cachear detalhe do treino:', err);
  }
}

export async function getCachedWorkoutDetail(workoutId) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const entry = cache[workoutId];
    if (!entry || Date.now() - entry.timestamp > CACHE_EXPIRY) return null;
    return entry.workout;
  } catch (err) {
    console.error('Erro ao ler detalhe do treino:', err);
    return null;
  }
}

export async function isWorkoutCached(workoutId) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    if (!raw) return false;
    const cache = JSON.parse(raw);
    return !!cache[workoutId] && (Date.now() - cache[workoutId].timestamp <= CACHE_EXPIRY);
  } catch {
    return false;
  }
}

export async function cacheExerciseLogs(userWorkoutId, exerciseName, logs) {
  try {
    const key = `${CACHE_KEYS.PENDING_ACTIONS}_logs:${userWorkoutId}:${exerciseName}`;
    await AsyncStorage.setItem(key, JSON.stringify(logs));
  } catch (err) {
    console.error('Erro ao cachear logs de exercicios:', err);
  }
}

export async function getCachedExerciseLogs(userWorkoutId, exerciseName) {
  try {
    const key = `${CACHE_KEYS.PENDING_ACTIONS}_logs:${userWorkoutId}:${exerciseName}`;
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
