// src/services/jwtBlocklist.ts
// Blocklist de JWT tokens - NOVAIX FITNESS
// Regra 3: JWT com TTL curto + Blocklist

import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryIf } from '../utils/tryIf';

const BLOCKLIST_PREFIX = 'jwt:blocklist:';
const BLOCKLIST_TTL = 15 * 60 * 1000; // 15 minutos (máximo TTL do token)

type BlocklistEntry = {
  tokenId: string;
  blockedAt: number;
  reason: 'logout' | 'revoked' | 'compromised' | 'admin';
  userId?: string;
};

/**
 * Adiciona token à blocklist
 * Chamado ao deslogar ou bloquear usuário
 */
export async function addToBlocklist(
  tokenId: string,
  reason: BlocklistEntry['reason'] = 'logout',
  userId?: string
): Promise<{ ok: boolean; error?: string }> {
  const result = await tryIf(async () => {
    const entry: BlocklistEntry = {
      tokenId,
      blockedAt: Date.now(),
      reason,
      userId,
    };

    await AsyncStorage.setItem(
      `${BLOCKLIST_PREFIX}${tokenId}`,
      JSON.stringify(entry)
    );

    return entry;
  }, { retries: 2, baseDelay: 100 });

  return result.ok
    ? { ok: true }
    : { ok: false, error: result.error?.message || 'Erro ao adicionar à blocklist' };
}

/**
 * Verifica se token está bloqueado
 * Middleware deve verificar antes de aceitar token
 */
export async function isBlocked(
  tokenId: string
): Promise<{ blocked: boolean; reason?: string }> {
  const result = await tryIf(async () => {
    const stored = await AsyncStorage.getItem(`${BLOCKLIST_PREFIX}${tokenId}`);

    if (!stored) {
      return { blocked: false };
    }

    const entry: BlocklistEntry = JSON.parse(stored);
    const now = Date.now();

    // Auto-limpar tokens expirados
    if (now - entry.blockedAt > BLOCKLIST_TTL) {
      await AsyncStorage.removeItem(`${BLOCKLIST_PREFIX}${tokenId}`);
      return { blocked: false };
    }

    return {
      blocked: true,
      reason: entry.reason,
    };
  }, { retries: 1 });

  return result.ok
    ? result.data!
    : { blocked: false };
}

/**
 * Remove token da blocklist (após expiração)
 */
export async function removeFromBlocklist(
  tokenId: string
): Promise<{ ok: boolean; error?: string }> {
  const result = await tryIf(async () => {
    await AsyncStorage.removeItem(`${BLOCKLIST_PREFIX}${tokenId}`);
  }, { retries: 1 });

  return result.ok
    ? { ok: true }
    : { ok: false, error: result.error?.message || 'Erro ao remover da blocklist' };
}

/**
 * Limpa blocklist de tokens expirados
 */
export async function cleanupBlocklist(): Promise<{ removed: number }> {
  const result = await tryIf(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const blocklistKeys = keys.filter(k => k.startsWith(BLOCKLIST_PREFIX));

    let removed = 0;
    const now = Date.now();

    for (const key of blocklistKeys) {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const entry: BlocklistEntry = JSON.parse(stored);
        if (now - entry.blockedAt > BLOCKLIST_TTL) {
          await AsyncStorage.removeItem(key);
          removed++;
        }
      }
    }

    return { removed };
  }, { retries: 1 });

  return result.ok ? result.data! : { removed: 0 };
}

/**
 * Blocklist completa de um usuário
 * Usado para revogar todos os tokens ao bloquear conta
 */
export async function blockAllUserTokens(
  userId: string,
  tokenIds: string[],
  reason: BlocklistEntry['reason'] = 'admin'
): Promise<{ blocked: number }> {
  let blocked = 0;

  for (const tokenId of tokenIds) {
    const result = await addToBlocklist(tokenId, reason, userId);
    if (result.ok) blocked++;
  }

  return { blocked };
}

/**
 * Extrai token ID de um JWT (payload.jti)
 */
export function extractTokenId(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload.jti || null;
  } catch {
    return null;
  }
}

/**
 * Extrai tempo de expiração do JWT
 */
export function extractExpiration(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}
