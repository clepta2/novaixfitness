// src/services/cache/CacheManager.ts
// Sistema de cache centralizado e tipado - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

export class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private stats = { hits: 0, misses: 0 };
  private prefix: string;

  constructor(prefix = '@novaix:cache:') {
    this.prefix = prefix;
  }

  async get<T>(key: string): Promise<T | null> {
    // Verificar cache em memória primeiro
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && Date.now() - memoryEntry.timestamp < memoryEntry.ttl) {
      this.stats.hits++;
      return memoryEntry.data as T;
    }

    // Verificar AsyncStorage
    try {
      const raw = await AsyncStorage.getItem(`${this.prefix}${key}`);
      if (!raw) {
        this.stats.misses++;
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() - entry.timestamp > entry.ttl) {
        await AsyncStorage.removeItem(`${this.prefix}${key}`);
        this.stats.misses++;
        return null;
      }

      // Promover para memória
      this.memoryCache.set(key, entry);
      this.stats.hits++;
      return entry.data;
    } catch {
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };

    // Salvar em memória
    this.memoryCache.set(key, entry);

    // Salvar em AsyncStorage
    try {
      await AsyncStorage.setItem(`${this.prefix}${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    try {
      await AsyncStorage.removeItem(`${this.prefix}${key}`);
    } catch {}
  }

  async clear(pattern?: string): Promise<void> {
    if (pattern) {
      // Limpar por padrão
      for (const key of this.memoryCache.keys()) {
        if (key.includes(pattern)) {
          this.memoryCache.delete(key);
        }
      }

      const keys = await AsyncStorage.getAllKeys();
      const matchingKeys = keys.filter(k => k.startsWith(this.prefix) && k.includes(pattern));
      await AsyncStorage.multiRemove(matchingKeys);
    } else {
      // Limpar tudo
      this.memoryCache.clear();
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(this.prefix));
      await AsyncStorage.multiRemove(cacheKeys);
    }
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.memoryCache.size,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }

  resetStats(): void {
    this.stats = { hits: 0, misses: 0 };
  }
}

// Instância singleton para uso global
export const cacheManager = new CacheManager();

// Funções de conveniência
export async function getCachedData<T>(key: string): Promise<T | null> {
  return cacheManager.get<T>(key);
}

export async function setCachedData<T>(key: string, data: T, ttl?: number): Promise<void> {
  return cacheManager.set(key, data, ttl);
}

export async function clearCachedData(pattern?: string): Promise<void> {
  return cacheManager.clear(pattern);
}
