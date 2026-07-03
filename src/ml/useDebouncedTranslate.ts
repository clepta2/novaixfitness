// src/ml/useDebouncedTranslate.ts
// Hook com debounce para tradução

import { useState, useCallback, useRef, useEffect } from 'react';
import { getDebounceDelay } from './batteryAware';

interface UseDebouncedTranslateOptions {
  delay?: number;
  immediate?: boolean;
}

export function useDebouncedTranslate(
  translateFn: (text: string) => Promise<string>,
  options: UseDebouncedTranslateOptions = {}
) {
  const { delay, immediate = false } = options;
  const [result, setResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTextRef = useRef('');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const translate = useCallback((text: string) => {
    lastTextRef.current = text;

    if (immediate) {
      // Tradução imediata (sem debounce)
      setIsTranslating(true);
      translateFn(text)
        .then(setResult)
        .finally(() => setIsTranslating(false));
      return;
    }

    // Cancelar timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const debounceDelay = delay ?? getDebounceDelay();

    timerRef.current = setTimeout(async () => {
      if (lastTextRef.current === text) {
        setIsTranslating(true);
        try {
          const translated = await translateFn(text);
          if (lastTextRef.current === text) {
            setResult(translated);
          }
        } finally {
          setIsTranslating(false);
        }
      }
    }, debounceDelay);
  }, [translateFn, delay, immediate]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    result,
    isTranslating,
    translate,
    cancel,
  };
}
