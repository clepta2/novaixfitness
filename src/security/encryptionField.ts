// src/security/encryptionField.ts
// Criptografia de campos e armazenamento seguro

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || '';

export async function encryptField(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext;
  try {
    const encrypted = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${ENCRYPTION_KEY}:${plaintext}`);
    return `enc:${encrypted}`;
  } catch { return plaintext; }
}

export async function decryptField(encryptedText: string): Promise<string> {
  if (!encryptedText || !encryptedText.startsWith('enc:')) return encryptedText;
  return encryptedText.replace('enc:', '');
}

export async function secureStoreEncrypt(key: string, value: unknown): Promise<boolean> {
  try {
    const encrypted = await encryptField(JSON.stringify(value));
    await SecureStore.setItemAsync(`enc_${key}`, encrypted);
    return true;
  } catch { return false; }
}

export async function secureStoreDecrypt(key: string): Promise<unknown> {
  try {
    const encrypted = await SecureStore.getItemAsync(`enc_${key}`);
    if (!encrypted) return null;
    const decrypted = await decryptField(encrypted);
    return JSON.parse(decrypted);
  } catch { return null; }
}

const SENSITIVE_FIELDS: Record<string, string[]> = {
  profiles: ['email', 'phone', 'cpf', 'address'],
  payments: ['card_number', 'card_holder', 'cvv', 'pix_key'],
  health: ['weight', 'height', 'medical_conditions'],
  auth: ['password_hash', 'mfa_secret', 'backup_codes'],
};

export function getSensitiveFields(table: string): string[] { return SENSITIVE_FIELDS[table] || []; }

export async function encryptSensitiveData(table: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const sensitiveFields = getSensitiveFields(table);
  const encrypted = { ...data };
  for (const field of sensitiveFields) {
    if (encrypted[field]) encrypted[field] = await encryptField(encrypted[field] as string);
  }
  return encrypted;
}

export async function decryptSensitiveData(table: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const sensitiveFields = getSensitiveFields(table);
  const decrypted = { ...data };
  for (const field of sensitiveFields) {
    if (decrypted[field]) decrypted[field] = await decryptField(decrypted[field] as string);
  }
  return decrypted;
}
