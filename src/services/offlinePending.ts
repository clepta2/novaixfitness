// src/services/offlinePending.ts
// Acoes pendentes e logs de exercicios

import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_KEY = '@novaix:pending_actions';

interface PendingAction {
  id: string;
  type: string;
  timestamp: number;
  [key: string]: unknown;
}

interface ExerciseLog {
  set_number: number;
  reps_done: number;
  weight_kg: number;
}

export async function addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    const actions: PendingAction[] = raw ? JSON.parse(raw) : [];
    actions.push({ ...action, id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now() } as PendingAction);
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(actions));
  } catch (err) {
    if (__DEV__) console.error('Erro ao adicionar acao pendente:', err);
  }
}

export async function getPendingActions(): Promise<PendingAction[]> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function clearPendingAction(actionId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    const actions: PendingAction[] = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(actions.filter(a => a.id !== actionId)));
  } catch (err) {
    if (__DEV__) console.error('Erro ao remover acao pendente:', err);
  }
}

export async function clearAllPendingActions(): Promise<void> {
  try { await AsyncStorage.removeItem(PENDING_KEY); }
  catch (err) { if (__DEV__) console.error('Erro ao limpar acoes pendentes:', err); }
}

export async function cacheExerciseLogs(userWorkoutId: string, exerciseName: string, logs: ExerciseLog[]): Promise<void> {
  try {
    const key = `${PENDING_KEY}_logs:${userWorkoutId}:${exerciseName}`;
    await AsyncStorage.setItem(key, JSON.stringify(logs));
  } catch (err) {
    if (__DEV__) console.error('Erro ao cachear logs de exercicios:', err);
  }
}

export async function getCachedExerciseLogs(userWorkoutId: string, exerciseName: string): Promise<ExerciseLog[]> {
  try {
    const key = `${PENDING_KEY}_logs:${userWorkoutId}:${exerciseName}`;
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
