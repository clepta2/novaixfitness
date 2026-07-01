// src/security/dataProtection.ts
// Protecao de dados: criptografia real + sanitizacao + query segura

import { encryptField, decryptField, getSensitiveFields } from './encryptionField';

// Criptografa dados sensiveis com AES-GCM-256 real
export async function encryptSensitiveData(data: Record<string, unknown>, userKey: string): Promise<Record<string, unknown>> {
  const SENSITIVE_FIELDS = ['password', 'cpf', 'card_number', 'cvv', 'pix_key', 'email', 'phone'];
  const encrypted = { ...data };
  for (const field of SENSITIVE_FIELDS) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = await encryptField(encrypted[field] as string, userKey);
    }
  }
  return encrypted;
}

// Descriptografa dados sensiveis
export async function decryptSensitiveData(data: Record<string, unknown>, userKey: string): Promise<Record<string, unknown>> {
  const SENSITIVE_FIELDS = ['cpf', 'card_number', 'cvv', 'pix_key', 'email', 'phone'];
  const decrypted = { ...data };
  for (const field of SENSITIVE_FIELDS) {
    if (decrypted[field] && typeof decrypted[field] === 'string' && (decrypted[field] as string).includes(':')) {
      try {
        decrypted[field] = await decryptField(decrypted[field] as string, userKey);
      } catch {
        // Se falhar, mantem o valor original (pode ja estar em plaintext em dados antigos)
      }
    }
  }
  return decrypted;
}

// Remove campos internos antes de enviar ao cliente
export function sanitizeResponse(data: Record<string, unknown>): Record<string, unknown> {
  const internalFields = ['password_hash', 'mfa_secret', 'backup_codes', 'internal_id', 'created_by', 'updated_by', 'deleted_at', 'is_deleted'];
  const sanitized = { ...data };
  for (const field of internalFields) delete sanitized[field];
  return sanitized;
}

// Query segura — valida nome da tabela contra lista de tabelas permitidas
const ALLOWED_TABLES = [
  'profiles', 'user_workouts', 'workouts', 'exercises',
  'posts', 'post_likes', 'post_comments',
  'notifications', 'water_logs', 'meal_logs',
  'creator_profiles', 'creator_content', 'creator_subscriptions',
  'user_follows', 'friend_challenges', 'challenge_progress',
  'heart_rate_readings', 'daily_steps', 'sleep_data',
  'weight_logs', 'body_measurements', 'progress_photos',
  'reports', 'blocked_users', 'user_blocks',
  'ab_test_assignments', 'ab_test_conversions', 'feature_flags',
  'webhook_events', 'failed_events', 'audit_log',
];

export function safeQuery(supabase: any, table: string) {
  if (!ALLOWED_TABLES.includes(table)) {
    throw new Error(`Tabela nao permitida: ${table}`);
  }
  return supabase.from(table);
}
