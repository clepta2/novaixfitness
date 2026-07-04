// src/data/legal/index.ts
// Textos Legais — NOVAIX FITNESS

export { termsContent } from './terms';
export { privacyContent } from './privacy';
export { medicalContent } from './medical';

export const legalTabs = ['Termos de Uso', 'Privacidade', 'Aviso Médico'] as const;

// Legacy exports for backward compatibility
export { termsContent as TERMS_TEXT } from './terms';
export { privacyContent as PRIVACY_TEXT } from './privacy';
