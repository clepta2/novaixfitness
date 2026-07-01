// src/security/antiTamper.ts
// Anti-tampering - re-exportacao

import { Platform } from 'react-native';
export { calculateAppHash, checkDebugger, checkEmulator, checkHookFramework, checkRoot, checkCodeInjection, checkMemoryPatching, type TamperCheck } from './antiTamperChecks';
export { reportTamperAttempt, handleThreatResponse } from './antiTamperReporting';
import { calculateAppHash, checkDebugger, checkEmulator, checkHookFramework, checkRoot, checkCodeInjection, checkMemoryPatching } from './antiTamperChecks';
import { reportTamperAttempt } from './antiTamperReporting';

const APP_HASHES = { android: process.env.EXPO_PUBLIC_APP_HASH_ANDROID || '', ios: process.env.EXPO_PUBLIC_APP_HASH_IOS || '' };

export async function verifyAppIntegrity() {
  try {
    const currentHash = await calculateAppHash();
    const expectedHash = APP_HASHES[Platform.OS as keyof typeof APP_HASHES];
    if (!expectedHash) return { valid: true, warning: 'hash_not_configured' };
    const valid = currentHash === expectedHash;
    if (!valid) await reportTamperAttempt({ type: 'integrity_violation', expected: expectedHash, actual: currentHash, platform: Platform.OS });
    return { valid, currentHash, expectedHash };
  } catch (err: any) { return { valid: false, error: err.message }; }
}

export async function detectTampering() {
  const checks = await Promise.all([checkDebugger(), checkEmulator(), checkHookFramework(), checkRoot(), checkCodeInjection(), checkMemoryPatching()]);
  const threats = checks.filter(c => c.detected);
  if (threats.length > 0) {
    await reportTamperAttempt({ type: 'tampering_detected', threats: threats.map(t => t.type), severity: threats.some(t => t.severity === 'critical') ? 'critical' : 'high' });
  }
  return { safe: threats.length === 0, threats, checkedAt: new Date().toISOString() };
}
