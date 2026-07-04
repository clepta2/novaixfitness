// src/ml/TranslationContext.tsx
// React Context para uso nos componentes

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TranslationEngine } from './TranslationEngine';
import { ensureModel, isModelCached } from './ModelManager';
import { getModelConfig } from './models-config';
import { startBatteryMonitoring, getDebounceDelay } from './batteryAware';

const LOCALE_KEY = '@novaix:locale';

interface TranslationContextValue {
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  t: (text: string, params?: Record<string, string | number>) => string;
  translateText: (text: string) => Promise<string>;
  isModelLoaded: boolean;
  isLoadingModel: boolean;
  downloadProgress: number;
  isLowPower: boolean;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children, initialLocale = 'pt' }: {
  children: React.ReactNode;
  initialLocale?: string;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isLowPower, setIsLowPower] = useState(false);
  const engineRef = useRef<TranslationEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carregar idioma salvo
  useEffect(() => {
    AsyncStorage.getItem(LOCALE_KEY).then(saved => {
      if (saved) setLocaleState(saved);
    });
  }, []);

  // Monitorar bateria
  useEffect(() => {
    const unsub = startBatteryMonitoring((state) => {
      setIsLowPower(state.isLowPowerMode || state.level < 0.05);
    });
    return unsub;
  }, []);

  // Carregar modelo quando idioma muda
  useEffect(() => {
    if (locale === 'pt') {
      // PT é o idioma base, não precisa de modelo
      setIsModelLoaded(true);
      return;
    }

    loadModel(locale);
  }, [locale]);

  const loadModel = async (targetLocale: string) => {
    const config = getModelConfig('pt', targetLocale);
    if (!config) {
      console.warn(`[ML] Modelo pt-${targetLocale} não encontrado`);
      return;
    }

    setIsLoadingModel(true);
    setDownloadProgress(0);

    try {
      // Baixar modelo (encoder + decoder + tokenizer)
      const paths = await ensureModel(config, setDownloadProgress);

      // Inicializar engine
      if (!engineRef.current) {
        engineRef.current = new TranslationEngine();
      }
      await engineRef.current.initialize(paths, config);
      setIsModelLoaded(true);
    } catch (error) {
      if (__DEV__) console.error('[ML] Erro ao carregar modelo:', error);
    } finally {
      setIsLoadingModel(false);
      setDownloadProgress(0);
    }
  };

  const setLocale = useCallback(async (newLocale: string) => {
    setLocaleState(newLocale);
    await AsyncStorage.setItem(LOCALE_KEY, newLocale);
  }, []);

  // Função t() - traduz texto
  const t = useCallback((text: string, params?: Record<string, string | number>): string => {
    // Se locale é PT, retornar texto original
    if (locale === 'pt') {
      if (params) {
        return Object.entries(params).reduce(
          (str, [key, val]) => str.replace(`{${key}}`, String(val)),
          text
        );
      }
      return text;
    }

    // Em produção, usar cache de traduções para strings estáticas
    // Por agora, retornar texto original (placeholder para ONNX)
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(`{${key}}`, String(val)),
        text
      );
    }
    return text;
  }, [locale]);

  // Tradução de texto livre
  const translateText = useCallback(async (text: string): Promise<string> => {
    if (locale === 'pt' || !engineRef.current) return text;

    try {
      return await engineRef.current.translate(text, 'pt', locale);
    } catch (error) {
      if (__DEV__) console.error('[ML] Erro na tradução:', error);
      return text;
    }
  }, [locale]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      engineRef.current?.dispose();
    };
  }, []);

  return (
    <TranslationContext.Provider value={{
      locale,
      setLocale,
      t,
      translateText,
      isModelLoaded,
      isLoadingModel,
      downloadProgress,
      isLowPower,
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within TranslationProvider');
  }
  return context;
}
