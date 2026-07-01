import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  WORKOUTS: '@novaix:workouts',
  WORKOUT_DETAILS: '@novaix:workout_details',
  FAVORITES: '@novaix:favorites',
  PROFILE: '@novaix:profile',
  LAST_SYNC: '@novaix:last_sync',
  PENDING_ACTIONS: '@novaix:pending_actions',
} as const;

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
const MAX_CACHED_DETAILS = 30;

interface CachedItem<T> { data: T; timestamp: number; }
interface WorkoutCacheEntry { workout: unknown; timestamp: number; }
interface WorkoutDetailCache { [workoutId: string]: WorkoutCacheEntry; }
interface PendingAction { id: string; timestamp: number; type: string; [key: string]: unknown; }

export async function cacheWorkouts(workouts: unknown[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.WORKOUTS, JSON.stringify({ workouts, timestamp: Date.now() }));
  } catch (err) { console.error('Erro ao cachear workouts:', err); }
}

export async function getCachedWorkouts(): Promise<unknown[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUTS);
    if (!raw) return null;
    const { workouts, timestamp } = JSON.parse(raw) as CachedItem<unknown[]>;
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return workouts;
  } catch (err) { console.error('Erro ao ler workouts cache:', err); return null; }
}

export async function cacheFavorites(favorites: unknown[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify({ favorites, timestamp: Date.now() }));
  } catch (err) { console.error('Erro ao cachear favoritos:', err); }
}

export async function getCachedFavorites(): Promise<unknown[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.FAVORITES);
    if (!raw) return null;
    const { favorites, timestamp } = JSON.parse(raw) as CachedItem<unknown[]>;
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return favorites;
  } catch (err) { console.error('Erro ao ler favoritos cache:', err); return null; }
}

export async function cacheProfile(profile: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify({ profile, timestamp: Date.now() }));
  } catch (err) { console.error('Erro ao cachear perfil:', err); }
}

export async function getCachedProfile(): Promise<unknown | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PROFILE);
    if (!raw) return null;
    const { profile, timestamp } = JSON.parse(raw) as CachedItem<unknown>;
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return profile;
  } catch (err) { console.error('Erro ao ler perfil cache:', err); return null; }
}

export async function addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_ACTIONS);
    const actions: PendingAction[] = raw ? JSON.parse(raw) : [];
    actions.push({ ...action, id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now() });
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_ACTIONS, JSON.stringify(actions));
  } catch (err) { console.error('Erro ao adicionar ação pendente:', err); }
}

export async function getPendingActions(): Promise<PendingAction[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_ACTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) { console.error('Erro ao ler ações pendentes:', err); return []; }
}

export async function clearPendingAction(actionId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PENDING_ACTIONS);
    const actions: PendingAction[] = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_ACTIONS, JSON.stringify(actions.filter(a => a.id !== actionId)));
  } catch (err) { console.error('Erro ao remover ação pendente:', err); }
}

export async function clearAllPendingActions(): Promise<void> {
  try { await AsyncStorage.removeItem(CACHE_KEYS.PENDING_ACTIONS); } catch (err) { console.error('Erro ao limpar ações pendentes:', err); }
}

export async function updateLastSync(): Promise<void> {
  try { await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString()); } catch (err) { console.error('Erro ao atualizar último sync:', err); }
}

export async function getLastSync(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
    return raw ? parseInt(raw, 10) : null;
  } catch (err) { console.error('Erro ao ler último sync:', err); return null; }
}

export async function cacheWorkoutDetail(workout: { id: string; [key: string]: unknown }): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    const cache: WorkoutDetailCache = raw ? JSON.parse(raw) : {};
    cache[workout.id] = { workout, timestamp: Date.now() };
    const ids = Object.keys(cache);
    if (ids.length > MAX_CACHED_DETAILS) {
      const sorted = ids.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
      for (let i = 0; i < ids.length - MAX_CACHED_DETAILS; i++) delete cache[sorted[i]];
    }
    await AsyncStorage.setItem(CACHE_KEYS.WORKOUT_DETAILS, JSON.stringify(cache));
  } catch (err) { console.error('Erro ao cachear detalhe do treino:', err); }
}

export async function getCachedWorkoutDetail(workoutId: string): Promise<unknown | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    if (!raw) return null;
    const cache: WorkoutDetailCache = JSON.parse(raw);
    const entry = cache[workoutId];
    if (!entry || Date.now() - entry.timestamp > CACHE_EXPIRY) return null;
    return entry.workout;
  } catch (err) { console.error('Erro ao ler detalhe do treino:', err); return null; }
}

export async function isWorkoutCached(workoutId: string): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    if (!raw) return false;
    const cache: WorkoutDetailCache = JSON.parse(raw);
    return !!cache[workoutId] && (Date.now() - cache[workoutId].timestamp <= CACHE_EXPIRY);
  } catch { return false; }
}

export async function cacheExerciseLogs(userWorkoutId: string, exerciseName: string, logs: unknown[]): Promise<void> {
  try {
    const key = `${CACHE_KEYS.PENDING_ACTIONS}_logs:${userWorkoutId}:${exerciseName}`;
    await AsyncStorage.setItem(key, JSON.stringify(logs));
  } catch (err) { console.error('Erro ao cachear logs de exercicios:', err); }
}

export async function getCachedExerciseLogs(userWorkoutId: string, exerciseName: string): Promise<unknown[]> {
  try {
    const key = `${CACHE_KEYS.PENDING_ACTIONS}_logs:${userWorkoutId}:${exerciseName}`;
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
