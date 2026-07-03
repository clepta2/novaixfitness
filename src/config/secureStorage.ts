// src/config/secureStorage.ts
// Storage adapter para Supabase Auth usando expo-secure-store (dados criptografados no dispositivo)

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SECURE_PREFIX = 'sb_';
const MAX_SECURE_SIZE = 1900;

interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export const secureStorage: StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      const secureKey = SECURE_PREFIX + key;
      const encrypted = await SecureStore.getItemAsync(secureKey);
      if (encrypted) return encrypted;

      const fallback = await AsyncStorage.getItem(key);
      if (fallback) {
        await SecureStore.setItemAsync(secureKey, fallback);
        await AsyncStorage.removeItem(key);
        return fallback;
      }
      return null;
    } catch {
      return AsyncStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      const secureKey = SECURE_PREFIX + key;
      if (value && value.length > MAX_SECURE_SIZE) {
        await AsyncStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(secureKey, value);
    } catch {
      await AsyncStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SECURE_PREFIX + key);
    } catch {}
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};
