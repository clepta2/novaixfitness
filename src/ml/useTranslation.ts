// src/ml/useTranslation.ts
// Hook público para tradução

import { useCallback } from 'react';
import { useTranslationContext } from './TranslationContext';
import { useDebouncedTranslate } from './useDebouncedTranslate';

export function useTranslation() {
  const {
    locale,
    setLocale,
    t,
    translateText,
    isModelLoaded,
    isLoadingModel,
    downloadProgress,
    isLowPower,
  } = useTranslationContext();

  // Tradução com debounce para input de texto
  const debounced = useDebouncedTranslate(translateText);

  // Tradução imediata (sem debounce)
  const translateImmediate = useCallback(async (text: string): Promise<string> => {
    return translateText(text);
  }, [translateText]);

  return {
    // Função t() para strings estáticas
    t,

    // Tradução de texto livre (com debounce)
    translateText: debounced.translate,
    translatedText: debounced.result,
    isTranslating: debounced.isTranslating,
    cancelTranslation: debounced.cancel,

    // Tradução imediata (sem debounce)
    translateImmediate,

    // Idioma
    locale,
    setLocale,

    // Status do modelo
    isModelLoaded,
    isLoadingModel,
    downloadProgress,

    // Status da bateria
    isLowPower,
  };
}
