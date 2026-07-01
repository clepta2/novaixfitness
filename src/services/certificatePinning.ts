// src/services/certificatePinning.js
// Pinning de certificados SSL para API e Supabase

import { Platform } from 'react-native';

const PINNED_CERTIFICATES = {
  'api.novaixfitness.com': ['sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='],
  'supabase.co': ['sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB='],
};

export function getCertificatePinningConfig() {
  if (Platform.OS === 'ios') {
    return { urlSessionConfiguration: {} };
  }
  return { sslPinning: { certificates: Object.values(PINNED_CERTIFICATES).flat() } };
}

export function verifyCertificate(hostname) {
  const pins = PINNED_CERTIFICATES[hostname];
  if (!pins) {
    if (__DEV__) console.warn(`No pins configured for ${hostname}`);
    return false;
  }
  if (__DEV__) console.warn('Certificate pinning nao implementado - retornando false');
  return false;
}
