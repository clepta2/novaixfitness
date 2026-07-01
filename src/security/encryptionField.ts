// src/security/encryptionField.ts
// Criptografia de campos com AES-GCM-256 — Zero-Knowledge Architecture
// Dados sao criptografados NO CLIENTE antes de enviar ao Supabase.
// O servidor NUNCA tem a chave — so recebe ciphertext.

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const KEY_STORAGE_PREFIX = 'enc_key_';
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

// Deriva chave de criptografia da senha do usuario via PBKDF2
// Esta chave NUNCA sai do dispositivo do usuario
async function deriveKey(password: string, salt: string): Promise<ArrayBuffer> {
  const passwordBytes = new TextEncoder().encode(password);
  const saltBytes = new TextEncoder().encode(salt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw', passwordBytes, 'PBKDF2', false, ['deriveBits']
  );

  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_LENGTH * 8
  );
}

// Gera IV criptograficamente seguro
function generateIV(): Uint8Array {
  const iv = new Uint8Array(IV_LENGTH);
  crypto.getRandomValues(iv);
  return iv;
}

// Converte ArrayBuffer para base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Converte base64 para ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Criptografa plaintext com AES-GCM-256
// Formato de saida: base64(iv):base64(ciphertext):base64(tag)
export async function encryptField(plaintext: string, userKey: string): Promise<string> {
  if (!plaintext) return plaintext;

  try {
    const iv = generateIV();
    const salt = bufferToBase64(crypto.getRandomValues(new Uint8Array(16)).buffer);
    const key = await deriveKey(userKey, salt);

    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'AES-GCM', length: KEY_LENGTH * 8 }, false, ['encrypt']
    );

    const encoded = new TextEncoder().encode(plaintext);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: TAG_LENGTH * 8 },
      cryptoKey,
      encoded
    );

    // Separa ciphertext e tag (ultimos 16 bytes)
    const encryptedBytes = new Uint8Array(encrypted);
    const ciphertext = encryptedBytes.slice(0, encryptedBytes.length - TAG_LENGTH);
    const tag = encryptedBytes.slice(encryptedBytes.length - TAG_LENGTH);

    return `${bufferToBase64(iv.buffer)}:${bufferToBase64(ciphertext.buffer)}:${bufferToBase64(tag.buffer)}:${salt}`;
  } catch {
    throw new Error('Falha na criptografia do campo');
  }
}

// Descriptografa ciphertext de volta ao plaintext original
export async function decryptField(encryptedText: string, userKey: string): Promise<string> {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 4) throw new Error('Formato de dados criptografados invalido');

    const [ivB64, ciphertextB64, tagB64, salt] = parts;
    const iv = new Uint8Array(base64ToBuffer(ivB64));
    const ciphertext = new Uint8Array(base64ToBuffer(ciphertextB64));
    const tag = new Uint8Array(base64ToBuffer(tagB64));

    const key = await deriveKey(userKey, salt);
    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'AES-GCM', length: KEY_LENGTH * 8 }, false, ['decrypt']
    );

    // Reconstroi o buffer completo (ciphertext + tag)
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext, 0);
    combined.set(tag, ciphertext.length);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: TAG_LENGTH * 8 },
      cryptoKey,
      combined
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error('Falha na descriptografia — chave incorreta ou dados corrompidos');
  }
}

// Armazena valor criptografado no SecureStore
export async function secureStoreEncrypt(key: string, value: unknown, userKey: string): Promise<boolean> {
  try {
    const encrypted = await encryptField(JSON.stringify(value), userKey);
    await SecureStore.setItemAsync(`${KEY_STORAGE_PREFIX}${key}`, encrypted);
    return true;
  } catch { return false; }
}

// Recupera e descriptografa valor do SecureStore
export async function secureStoreDecrypt(key: string, userKey: string): Promise<unknown> {
  try {
    const encrypted = await SecureStore.getItemAsync(`${KEY_STORAGE_PREFIX}${key}`);
    if (!encrypted) return null;
    const decrypted = await decryptField(encrypted, userKey);
    return JSON.parse(decrypted);
  } catch { return null; }
}

const SENSITIVE_FIELDS: Record<string, string[]> = {
  profiles: ['email', 'phone', 'cpf', 'address'],
  payments: ['card_number', 'card_holder', 'cvv', 'pix_key'],
  health: ['weight', 'height', 'medical_conditions'],
  auth: ['mfa_secret', 'backup_codes'],
};

export function getSensitiveFields(table: string): string[] { return SENSITIVE_FIELDS[table] || []; }

export async function encryptSensitiveData(table: string, data: Record<string, unknown>, userKey: string): Promise<Record<string, unknown>> {
  const sensitiveFields = getSensitiveFields(table);
  const encrypted = { ...data };
  for (const field of sensitiveFields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = await encryptField(encrypted[field] as string, userKey);
    }
  }
  return encrypted;
}

export async function decryptSensitiveData(table: string, data: Record<string, unknown>, userKey: string): Promise<Record<string, unknown>> {
  const sensitiveFields = getSensitiveFields(table);
  const decrypted = { ...data };
  for (const field of sensitiveFields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      decrypted[field] = await decryptField(decrypted[field] as string, userKey);
    }
  }
  return decrypted;
}
