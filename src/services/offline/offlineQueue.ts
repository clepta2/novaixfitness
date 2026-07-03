// src/services/offline/offlineQueue.ts
// Fila de ações pendentes para sincronização offline

import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@novaix:pending_actions';

interface PendingAction {
  id: string;
  type: string;
  timestamp: number;
  retries: number;
  [key: string]: unknown;
}

async function getQueue(): Promise<PendingAction[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY).catch(() => null);
  return raw ? JSON.parse(raw) : [];
}

async function saveQueue(queue: PendingAction[]) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue)).catch(() => {});
}

export async function addPendingAction(action: { type: string; [key: string]: unknown }) {
  const queue = await getQueue();
  const newItem: PendingAction = {
    type: action.type,
    ...action,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    retries: 0,
  };
  queue.push(newItem);
  await saveQueue(queue);
}

export async function getPendingActions() {
  return getQueue();
}

export async function getPendingActionsCount() {
  const queue = await getQueue();
  return queue.length;
}

export async function clearPendingAction(actionId: string) {
  const queue = await getQueue();
  await saveQueue(queue.filter(a => a.id !== actionId));
}

export async function clearAllPendingActions() {
  await AsyncStorage.removeItem(QUEUE_KEY).catch(() => {});
}
