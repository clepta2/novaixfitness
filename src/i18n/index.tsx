// src/i18n/index.tsx
// Sistema de internacionalizacao — TradNinja + ML ONNX

import * as Localization from 'expo-localization';
import { useState, useCallback, createContext, useContext, useMemo, useRef } from 'react';
import { createTranslator } from 'tradninja';
import { TranslationEngine } from '../ml/TranslationEngine';
import { ensureModel, isModelCached } from '../ml/ModelManager';
import pt from './pt.json';
import en from './en.json';
import es from './es.json';

const translations = { pt, en, es };

interface I18nContextValue {
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
  translateText: (text: string) => Promise<string>;
  changeLocale: (locale: string) => void;
  translator: ReturnType<typeof createTranslator>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const DEFAULT_LOCALE = 'pt-BR';

function getDeviceLocale() {
  try {
    const locale = Localization.getLocales()?.[0]?.languageCode || DEFAULT_LOCALE;
    return locale.startsWith('en') ? 'en' : locale.startsWith('es') ? 'es' : 'pt';
  } catch {
    return 'pt';
  }
}

function buildDictionary(source: Record<string, unknown>, target: Record<string, unknown>): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  function flatten(obj: Record<string, unknown>, prefix: string) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        const targetValue = getNestedValue(target, fullKey);
        result[value] = {
          en: typeof targetValue === 'string' ? targetValue : value,
          es: typeof targetValue === 'string' ? targetValue : value,
        };
      } else if (typeof value === 'object' && value !== null) {
        flatten(value as Record<string, unknown>, fullKey);
      }
    }
  }

  flatten(source, '');
  return result;
}

function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let value: unknown = obj;
  for (const k of keys) {
    if (value === null || value === undefined || typeof value !== 'object') return undefined;
    value = (value as Record<string, unknown>)[k];
  }
  return value;
}

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: string }) {
  const [locale, setLocale] = useState(initialLocale || getDeviceLocale());
  const engineRef = useRef<TranslationEngine | null>(null);

  const dictionary = useMemo(() => buildDictionary(pt, en), []);

  const translator = useMemo(() => createTranslator({
    source: 'pt',
    target: locale as any,
    dictionary,
  }), [locale]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const result = translator.translate(key, { target: locale as any });
    if (result.text !== key) {
      if (params) {
        return result.text.replace(/\{(\w+)\}/g, (_, param) => params[param] !== undefined ? String(params[param]) : `{${param}}`);
      }
      return result.text;
    }

    const value = getNestedValue(translations[locale], key);
    if (typeof value === 'string') {
      if (params) {
        return value.replace(/\{(\w+)\}/g, (_, param) => params[param] !== undefined ? String(params[param]) : `{${param}}`);
      }
      return value;
    }

    return key;
  }, [locale, translator]);

  const translateText = useCallback(async (text: string): Promise<string> => {
    if (locale === 'pt') return text;

    try {
      if (!engineRef.current) {
        engineRef.current = new TranslationEngine();
        const modelId = `pt-${locale}`;
        const cached = await isModelCached(modelId);
        if (!cached) {
          await ensureModel(modelId);
        }
        await engineRef.current.initialize(modelId);
      }
      return await engineRef.current.translate(text);
    } catch {
      return text;
    }
  }, [locale]);

  const changeLocale = useCallback((newLocale: string) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      engineRef.current = null;
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, translateText, changeLocale, translator }}>
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
