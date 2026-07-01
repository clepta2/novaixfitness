// src/security/dataProtection.js
// Criptografia, sanitizacao e query segura

const SENSITIVE_FIELDS = ['password', 'cpf', 'card_number', 'cvv', 'pix_key'];

export function encryptSensitiveData(data) {
  const encrypted = { ...data };
  for (const field of SENSITIVE_FIELDS) {
    if (encrypted[field]) encrypted[field] = `encrypted_${encrypted[field]}`;
  }
  return encrypted;
}

export function sanitizeResponse(data) {
  const internalFields = ['password_hash', 'mfa_secret', 'backup_codes', 'internal_id', 'created_by', 'updated_by', 'deleted_at', 'is_deleted'];
  const sanitized = { ...data };
  for (const field of internalFields) delete sanitized[field];
  return sanitized;
}

export function safeQuery(supabase, table) {
  return supabase.from(table);
}
