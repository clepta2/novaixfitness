// src/i18n/index.tsx
// Shim que usa TradNinja como engine de tradução
// Mantém a mesma interface para compatibilidade

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createTranslator } from 'tradninja';
import type { Language } from 'tradninja';

interface I18nContextValue {
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
  changeLocale: (locale: string) => void;
  translator: any;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const translator = createTranslator({ defaultTarget: 'en' });

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: string }) {
  const [locale, setLocale] = useState(initialLocale || 'pt');

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const result = translator.translate(key, { source: 'pt', target: locale as Language, params });
    return result.text;
  }, [locale]);

  const changeLocale = useCallback((newLocale: string) => {
    setLocale(newLocale);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale, translator }}>
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
