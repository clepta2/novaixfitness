// src/utils/storage.ts
// Utilitários de armazenamento - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@novaix:';

interface StorageOptions {
  expiry?: number; // em milissegundos
}

interface StorageEntry<T> {
  data: T;
  timestamp: number;
  expiry?: number;
}

/**
 * Storage wrapper com tipagem e expiração
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(`${PREFIX}${key}`);
      if (!raw) return null;

      const entry: StorageEntry<T> = JSON.parse(raw);
      
      // Verificar expiração
      if (entry.expiry && Date.now() - entry.timestamp > entry.expiry) {
        await AsyncStorage.removeItem(`${PREFIX}${key}`);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, data: T, options?: StorageOptions): Promise<void> {
    try {
      const entry: StorageEntry<T> = {
        data,
        timestamp: Date.now(),
        expiry: options?.expiry,
      };
      await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(entry));
    } catch (error) {
      if (__DEV__) console.error('Storage set error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${PREFIX}${key}`);
    } catch (error) {
      if (__DEV__) console.error('Storage remove error:', error);
    }
  },

  async clear(pattern?: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = pattern
        ? keys.filter(k => k.startsWith(PREFIX) && k.includes(pattern))
        : keys.filter(k => k.startsWith(PREFIX));
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      if (__DEV__) console.error('Storage clear error:', error);
    }
  },

  async getAll<T>(pattern?: string): Promise<Record<string, T>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const filteredKeys = pattern
        ? keys.filter(k => k.startsWith(PREFIX) && k.includes(pattern))
        : keys.filter(k => k.startsWith(PREFIX));
      
      const entries = await AsyncStorage.multiGet(filteredKeys);
      const result: Record<string, T> = {};
      
      for (const [key, value] of entries) {
        if (value) {
          try {
            const parsed: StorageEntry<T> = JSON.parse(value);
            if (!parsed.expiry || Date.now() - parsed.timestamp <= parsed.expiry) {
              const shortKey = key.replace(PREFIX, '');
              result[shortKey] = parsed.data;
            }
          } catch {}
        }
      }
      
      return result;
    } catch {
      return {};
    }
  },

  async getSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const novaixKeys = keys.filter(k => k.startsWith(PREFIX));
      const items = await AsyncStorage.multiGet(novaixKeys);
      return items.reduce((total, [, val]) => total + (val ? val.length * 2 : 0), 0);
    } catch {
      return 0;
    }
  },
};

export default storage;
