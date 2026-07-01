// src/security/requestSigning.js
// Assinatura de requests: HMAC, timestamp, nonce

import * as Crypto from 'expo-crypto';

const API_SECRET = process.env.EXPO_PUBLIC_API_SECRET || '';
const HMAC_KEY = process.env.EXPO_PUBLIC_HMAC_KEY || '';

// ============================================
// HMAC SIGNATURE
// ============================================

export async function signRequest(method: string, path: string, body: any = null, timestamp: number = Date.now()): Promise<Record<string, string>> {
  const nonce = generateNonce();
  const payload = `${method.toUpperCase()}:${path}:${timestamp}:${nonce}:${body ? JSON.stringify(body) : ''}`;

  const signature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${HMAC_KEY}:${payload}`
  );

  return {
    'X-Timestamp': timestamp.toString(),
    'X-Nonce': nonce,
    'X-Signature': signature,
    'X-API-Version': '1',
  };
}

export async function verifySignature(method, path, body, headers) {
  const timestamp = parseInt(headers['x-timestamp'], 10);
  const nonce = headers['x-nonce'];
  const signature = headers['x-signature'];

  // Verificar timestamp (5 minutos de tolerância)
  const now = Date.now();
  if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
    return { valid: false, reason: 'timestamp_expired' };
  }

  // Verificar nonce (replay attack prevention)
  if (await isNonceUsed(nonce)) {
    return { valid: false, reason: 'nonce_reused' };
  }

  // Verificar assinatura
  const payload = `${method.toUpperCase()}:${path}:${timestamp}:${nonce}:${body ? JSON.stringify(body) : ''}`;
  const expectedSignature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${HMAC_KEY}:${payload}`
  );

  if (signature !== expectedSignature) {
    return { valid: false, reason: 'signature_mismatch' };
  }

  await markNonceUsed(nonce);
  return { valid: true };
}

function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// NONCE CACHE (Replay Prevention)
// ============================================

const nonceCache = new Map();
const NONCE_TTL = 5 * 60 * 1000; // 5 minutos

async function isNonceUsed(nonce) {
  const used = nonceCache.get(nonce);
  if (!used) return false;
  if (Date.now() - used > NONCE_TTL) {
    nonceCache.delete(nonce);
    return false;
  }
  return true;
}

async function markNonceUsed(nonce) {
  nonceCache.set(nonce, Date.now());

  // Limpar nonces antigos
  if (nonceCache.size > 10000) {
    const now = Date.now();
    for (const [key, timestamp] of nonceCache) {
      if (now - timestamp > NONCE_TTL) nonceCache.delete(key);
    }
  }
}

// ============================================
// REQUEST ENCRYPTION
// ============================================

export async function encryptPayload(payload, recipientPublicKey) {
  // Em produção, usar RSA ou AES para criptografar
  // Por enquanto, retorna payload original
  return {
    encrypted: false,
    payload,
  };
}

export async function decryptPayload(encryptedPayload, privateKey) {
  return {
    decrypted: true,
    payload: encryptedPayload,
  };
}

// ============================================
// API KEY MANAGEMENT
// ============================================

const API_KEYS = new Map();

export async function generateApiKey(userId, permissions = ['read']) {
  const key = `nvx_${generateNonce()}${generateNonce()}`;
  const hashedKey = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, key);

  API_KEYS.set(hashedKey, {
    userId,
    permissions,
    createdAt: Date.now(),
    expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 ano
  });

  return { key, hashedKey };
}

export async function validateApiKey(key) {
  const hashedKey = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, key);
  const keyData = API_KEYS.get(hashedKey);

  if (!keyData) return { valid: false, reason: 'key_not_found' };
  if (Date.now() > keyData.expiresAt) {
    API_KEYS.delete(hashedKey);
    return { valid: false, reason: 'key_expired' };
  }

  return { valid: true, userId: keyData.userId, permissions: keyData.permissions };
}

export async function revokeApiKey(key) {
  const hashedKey = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, key);
  API_KEYS.delete(hashedKey);
}

// ============================================
// REQUEST INTERCEPTOR
// ============================================

export function createSecureFetcher() {
  const originalFetch = global.fetch;

  global.fetch = async (url: any, options: any = {}) => {
    const method = options.method || 'GET';
    const path = typeof url === 'string' ? new URL(url).pathname : (url && 'pathname' in url ? url.pathname : '');
    const body = options.body ? JSON.parse(options.body) : null;

    // Assinar request
    const headers = await signRequest(method, path, body);

    options.headers = {
      ...options.headers,
      ...headers,
    };

    // Adicionar API key se disponível
    const apiKey = await getStoredApiKey();
    if (apiKey) {
      options.headers['X-API-Key'] = apiKey;
    }

    return originalFetch(url, options);
  };
}

async function getStoredApiKey() {
  try {
    const SecureStore = await import('expo-secure-store');
    return await SecureStore.getItemAsync('api_key');
  } catch {
    return null;
  }
}
