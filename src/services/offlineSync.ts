// src/services/offlineSync.ts
// Sincronizacao offline com fila de acoes pendentes e deteccao de conexao
// Service worker equivalente para React Native

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

const QUEUE_KEY = '@novaix:sync_queue';
const LAST_SYNC_KEY = '@novaix:last_full_sync';
const PENDING_KEY = '@novaix:pending_actions';

type PendingAction = {
  id: string;
  type: string;
  table: string;
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'failed';
};

type SyncResult = {
  synced: number;
  failed: number;
  pending: number;
};

let isSyncing = false;

// Adiciona acao a fila de sincronizacao
export async function queueAction(type: string, table: string, data: Record<string, unknown>): Promise<string> {
  const action: PendingAction = {
    id: `action_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    table,
    data,
    timestamp: Date.now(),
    retries: 0,
    status: 'pending',
  };

  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    const queue: PendingAction[] = raw ? JSON.parse(raw) : [];
    queue.push(action);
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(queue));
    return action.id;
  } catch {
    return action.id;
  }
}

// Obtem acoes pendentes
export async function getPendingActions(): Promise<PendingAction[]> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Sincroniza acoes pendentes com o servidor
export async function syncPendingActions(): Promise<SyncResult> {
  if (isSyncing) return { synced: 0, failed: 0, pending: 0 };
  isSyncing = true;

  let synced = 0;
  let failed = 0;

  try {
    const queue = await getPendingActions();
    const pending = queue.filter(a => a.status === 'pending');

    for (const action of pending) {
      try {
        action.status = 'syncing';
        await saveQueue(queue);

        const { error } = await supabase.from(action.table).upsert(action.data);

        if (error) throw error;

        action.status = 'synced';
        synced++;
      } catch (err) {
        action.retries++;
        action.status = action.retries >= 3 ? 'failed' : 'pending';
        failed++;

        if (__DEV__) console.warn(`[sync] Falha ao sincronizar ${action.id}:`, err);
      }
    }

    await saveQueue(queue);
    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());

    return { synced, failed, pending: queue.filter(a => a.status === 'pending').length };
  } catch (err) {
    if (__DEV__) console.error('[sync] Erro geral na sincronizacao:', err);
    return { synced, failed, pending: 0 };
  } finally {
    isSyncing = false;
  }
}

// Remove acoes sincronizadas da fila
export async function cleanupSyncedActions(): Promise<number> {
  try {
    const queue = await getPendingActions();
    const before = queue.length;
    const remaining = queue.filter(a => a.status !== 'synced');
    await saveQueue(remaining);
    return before - remaining.length;
  } catch {
    return 0;
  }
}

// Remove todas as acoes pendentes
export async function clearPendingActions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PENDING_KEY);
  } catch {}
}

// Obtem timestamp do ultimo sync completo
export async function getLastSyncTime(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return raw ? parseInt(raw, 10) : null;
  } catch {
    return null;
  }
}

// Verifica se ha acoes pendentes
export async function hasPendingActions(): Promise<boolean> {
  const queue = await getPendingActions();
  return queue.some(a => a.status === 'pending');
}

// Conta acoes por status
export async function getQueueStats(): Promise<{ pending: number; syncing: number; failed: number; total: number }> {
  const queue = await getPendingActions();
  return {
    pending: queue.filter(a => a.status === 'pending').length,
    syncing: queue.filter(a => a.status === 'syncing').length,
    failed: queue.filter(a => a.status === 'failed').length,
    total: queue.length,
  };
}

async function saveQueue(queue: PendingAction[]): Promise<void> {
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(queue));
}

// Retry de acoes que falharam
export async function retryFailedActions(): Promise<SyncResult> {
  try {
    const queue = await getPendingActions();
    for (const action of queue) {
      if (action.status === 'failed') {
        action.status = 'pending';
        action.retries = 0;
      }
    }
    await saveQueue(queue);
    return syncPendingActions();
  } catch {
    return { synced: 0, failed: 0, pending: 0 };
  }
}
