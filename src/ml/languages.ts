// src/ml/languages.ts
// Idiomas suportados pelo sistema de tradução

export interface Language {
  code: string;
  label: string;
  native: string;
  flag: string;
  available: boolean; // Modelo disponível para download
}

export const SUPPORTED_LANGUAGES: Language[] = [
  // Idioma base (sem download necessário)
  { code: 'pt', label: 'Português', native: 'Português', flag: '🇧🇷', available: true },

  // Idiomas com modelo disponível
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸', available: true },
  { code: 'ca', label: 'Català', native: 'Català', flag: '🏴', available: true },

  // Idiomas que serão adicionados
  { code: 'es', label: 'Español', native: 'Español', flag: '🇪🇸', available: false },
  { code: 'fr', label: 'Français', native: 'Français', flag: '🇫🇷', available: false },
  { code: 'de', label: 'Deutsch', native: 'Deutsch', flag: '🇩🇪', available: false },
  { code: 'it', label: 'Italiano', native: 'Italiano', flag: '🇮🇹', available: false },
  { code: 'ja', label: '日本語', native: '日本語', flag: '🇯🇵', available: false },
  { code: 'ko', label: '한국어', native: '한국어', flag: '🇰🇷', available: false },
  { code: 'zh', label: '中文', native: '中文', flag: '🇨🇳', available: false },
  { code: 'ar', label: 'العربية', native: 'العربية', flag: '🇸🇦', available: false },
  { code: 'ru', label: 'Русский', native: 'Русский', flag: '🇷🇺', available: false },
];

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

export function getLanguagePairKey(from: string, to: string): string {
  return `${from}-${to}`;
}

export function getAvailableLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.available);
}
