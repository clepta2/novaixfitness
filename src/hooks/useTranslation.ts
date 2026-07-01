// src/hooks/useTranslation.ts
// Hook para tradução em tempo real

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pt from '../i18n/pt.json';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const translations: Record<string, Record<string, unknown>> = { pt, en, es };
const STORAGE_KEY = '@novaix:language';

type SupportedLanguage = 'pt' | 'en' | 'es';

interface TranslationParams {
  [key: string]: string | number;
}

interface LanguageOption {
  id: string;
  label: string;
  flag: string;
  native: string;
}

function getNestedValue(obj: unknown, path: string): string | undefined {
  let current: unknown = obj;
  for (const key of path.split('.')) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

export function useTranslation() {
  const [language, setLanguage] = useState<SupportedLanguage>('pt');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) {
        setLanguage(saved as SupportedLanguage);
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar idioma:', err);
    }
    setIsLoaded(true);
  };

  const changeLanguage = useCallback(async (newLang: SupportedLanguage) => {
    if (!translations[newLang]) return;
    setLanguage(newLang);
    await AsyncStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const t = useCallback((key: string, params: TranslationParams = {}) => {
    const value = getNestedValue(translations[language], key);
    if (!value) return key;

    return value.replace(/\{(\w+)\}/g, (_, param) => {
      return params[param] !== undefined ? String(params[param]) : `{${param}}`;
    });
  }, [language]);

  const getAvailableLanguages = useCallback((): LanguageOption[] => [
    { id: 'pt', label: 'Português', flag: '🇧🇷', native: 'Português' },
    { id: 'en', label: 'Inglês', flag: '🇺🇸', native: 'English' },
    { id: 'es', label: 'Espanhol', flag: '🇪🇸', native: 'Español' },
  ], []);

  return {
    t,
    language,
    changeLanguage,
    isLoaded,
    getAvailableLanguages,
  };
}

export default useTranslation;
