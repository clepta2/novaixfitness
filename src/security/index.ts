// src/security/index.js
// Exportações centralizadas de segurança

// Anti-tampering
export {
  verifyAppIntegrity,
  detectTampering,
  handleThreatResponse,
} from './antiTamper';

// Request signing
export {
  signRequest,
  verifySignature,
  encryptPayload,
  decryptPayload,
  generateApiKey,
  validateApiKey,
  revokeApiKey,
  createSecureFetcher,
} from './requestSigning';

// Encryption
export {
  encryptField,
  decryptField,
  secureStoreEncrypt,
  secureStoreDecrypt,
  encryptSensitiveData,
  decryptSensitiveData,
  anonymizeEmail,
  anonymizePhone,
  anonymizeName,
  anonymizeCPF,
  anonymizeData,
  exportUserData,
  deleteUserData,
  getDataRetentionReport,
  rotateEncryptionKey,
  getEncryptionKey,
} from './encryption';

// Threat detection
export {
  detectAnomalies,
  checkBruteForce,
  checkAccountTakeover,
  getSecurityEvents,
  getThreatSummary,
} from './threatDetection';

// Mandatory patterns
export {
  requireAuth,
  rateLimit,
  validateInput,
  auditLog,
  encryptSensitiveData as encryptResponse,
  sanitizeResponse,
  CORS_CONFIG,
  securityHeaders,
  isValidUUID,
  validateUUID,
  safeQuery,
  securityMiddleware,
} from './mandatoryPatterns';
