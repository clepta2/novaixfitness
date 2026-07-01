// src/services/syncQueue.js
// Fila de acoes offline e sincronizacao automatica

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = '@novaix:sync_queue';

interface SyncAction {
  type: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
}

interface QueuedAction extends SyncAction {
  id: string;
  timestamp: number;
  retries: number;
}

export async function queueOfflineAction(action: SyncAction): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: QueuedAction[] = raw ? JSON.parse(raw) : [];
    queue.push({
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      retries: 0,
    } as QueuedAction);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return true;
  } catch (err: unknown) {
    if (__DEV__) console.error('Erro ao enfileirar acao:', err);
    return false;
  }
}

export async function getSyncQueue(): Promise<QueuedAction[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedAction[]) : [];
  } catch { return []; }
}

export async function removeSyncAction(actionId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: QueuedAction[] = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue.filter(a => a.id !== actionId)));
  } catch (err: unknown) {
    if (__DEV__) console.error('Erro ao remover acao:', err);
  }
}

export async function clearSyncQueue(): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([]));
  } catch (err: unknown) {
    if (__DEV__) console.error('Erro ao limpar fila:', err);
  }
}

export async function syncPendingActions(executeActionFn: (action: QueuedAction) => Promise<void>): Promise<{ synced: number; failed: number }> {
  const queue = await getSyncQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  for (const action of queue) {
    try {
      await executeActionFn(action);
      await removeSyncAction(action.id);
      synced++;
    } catch {
      action.retries = (action.retries || 0) + 1;
      if (action.retries >= 3) { await removeSyncAction(action.id); failed++; }
    }
  }
  return { synced, failed };
}

export async function isOnline(): Promise<boolean> {
  try { const state = await NetInfo.fetch(); return state.isConnected; }
  catch { return true; }
}

export async function waitForOnline(callback: () => void, checkInterval: number = 5000): Promise<() => void> {
  const interval = setInterval(async () => {
    if (await isOnline()) { clearInterval(interval); callback(); }
  }, checkInterval);
  return () => clearInterval(interval);
}
