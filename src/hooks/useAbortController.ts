// src/hooks/useAbortController.ts
// Hook para gerenciar AbortController em fetches

import { useRef, useEffect, useCallback } from 'react';

export function useAbortController() {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const getSignal = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  }, []);

  return { signal: getSignal() };
}