// src/security/encryption.ts
// Criptografia - re-exportacao

export { encryptField, decryptField, secureStoreEncrypt, secureStoreDecrypt, getSensitiveFields, encryptSensitiveData, decryptSensitiveData } from './encryptionField';
export { anonymizeEmail, anonymizePhone, anonymizeName, anonymizeCPF, anonymizeData } from './encryptionAnon';
export { exportUserData, deleteUserData, getDataRetentionReport } from './encryptionGDPR';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

let currentEncryptionKey: string | null = null;

export async function rotateEncryptionKey() {
  const newKey = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${Date.now()}:${Math.random()}`);
  const oldKey = currentEncryptionKey;
  currentEncryptionKey = newKey;
  await SecureStore.setItemAsync('encryption_key', newKey);
  return { rotated: true, oldKeyExists: !!oldKey };
}

export async function getEncryptionKey() {
  if (currentEncryptionKey) return currentEncryptionKey;
  try { currentEncryptionKey = await SecureStore.getItemAsync('encryption_key'); } catch {}
  if (!currentEncryptionKey) await rotateEncryptionKey();
  return currentEncryptionKey;
}
