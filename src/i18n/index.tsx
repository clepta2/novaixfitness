// src/i18n/index.js
// Sistema de internacionalizacao - NOVAIX FITNESS

import * as Localization from 'expo-localization';
import { useState, useCallback, createContext, useContext } from 'react';
import pt from './pt.json';
import en from './en.json';
import es from './es.json';

const translations = { pt, en, es };

interface I18nContextValue {
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
  changeLocale: (locale: string) => void;
}
const I18nContext = createContext<I18nContextValue | null>(null);

const DEFAULT_LOCALE = 'pt-BR';

function getDeviceLocale() {
  try {
    const locale = Localization.getLocales()?.[0]?.languageCode || DEFAULT_LOCALE;
    return locale.startsWith('en') ? 'en' : locale.startsWith('es') ? 'es' : 'pt';
  } catch (e) {
    if (__DEV__) console.warn('i18n:', e);
    return 'pt';
  }
}

export function I18nProvider({ children, initialLocale }) {
  const [locale, setLocale] = useState(initialLocale || getDeviceLocale());

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') return key;

    return value.replace(/\{(\w+)\}/g, (_, param) => params[param] ?? `{${param}}`);
  }, [locale]);

  const changeLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}

export const LOCALES = [
  { code: 'pt', label: 'Portugues', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Espanol', flag: '🇪🇸' },
];

export default { I18nProvider, useI18n, LOCALES };
