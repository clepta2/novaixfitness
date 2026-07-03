// src/utils/queue.ts
// Fila de operações pendentes com persistência - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@novaix:operation_queue';
const MAX_QUEUE_SIZE = 1000;

interface QueueItem {
  id: string;
  key: string;
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

let queue: QueueItem[] = [];
let isLoaded = false;
let isSaving = false;

async function loadQueue(): Promise<void> {
  if (isLoaded) return;
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) queue = parsed;
    }
  } catch {
    queue = [];
  } finally {
    isLoaded = true;
  }
}

async function saveQueue(): Promise<void> {
  if (isSaving) return;
  isSaving = true;
  try {
    const snapshot = [...queue];
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(snapshot));
  } finally {
    isSaving = false;
  }
}

/**
 * Adiciona item à fila
 */
export async function enqueue(item: Omit<QueueItem, 'id' | 'timestamp' | 'retries'>): Promise<void> {
  await loadQueue();

  const newItem: QueueItem = {
    ...item,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    retries: 0,
  };

  queue.push(newItem);

  if (queue.length > MAX_QUEUE_SIZE) {
    queue.shift();
  }

  await saveQueue();
}

/**
 * Remove item da fila por key
 */
export async function dequeue(key: string): Promise<QueueItem | null> {
  await loadQueue();
  const index = queue.findIndex(item => item.key === key);
  if (index === -1) return null;
  return queue.splice(index, 1)[0];
}

/**
 * Processa toda a fila com callback
 */
export async function processQueue(
  processor: (item: QueueItem) => Promise<boolean>
): Promise<{ processed: number; failed: number }> {
  await loadQueue();

  const toProcess = [...queue];
  const remaining: QueueItem[] = [];
  let processed = 0;
  let failed = 0;

  for (const item of toProcess) {
    try {
      const success = await processor(item);
      if (success) {
        processed++;
      } else {
        item.retries++;
        if (item.retries < 3) remaining.push(item);
        else failed++;
      }
    } catch {
      item.retries++;
      if (item.retries < 3) remaining.push(item);
      else failed++;
    }
  }

  queue = remaining;
  await saveQueue();
  return { processed, failed };
}

/**
 * Retorna tamanho da fila
 */
export async function getQueueSize(): Promise<number> {
  await loadQueue();
  return queue.length;
}

/**
 * Limpa toda a fila
 */
export async function clearQueue(): Promise<void> {
  queue = [];
  await AsyncStorage.removeItem(QUEUE_KEY);
}
