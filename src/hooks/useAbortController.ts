// src/hooks/useAbortController.ts
// Hook para gerenciar AbortController em fetches - NOVAIX FITNESS

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Hook que fornece um AbortController limpo automaticamente
 * Uso: const { signal, abort, isAborted } = useAbortController();
 */
export function useAbortController() {
  const controllerRef = useRef<AbortController | null>(null);
  const [isAborted, setIsAborted] = useState(false);

  useEffect(() => {
    controllerRef.current = new AbortController();
    setIsAborted(false);
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    setIsAborted(true);
    controllerRef.current = new AbortController();
  }, []);

  return {
    signal: controllerRef.current?.signal,
    abort,
    isAborted,
  };
}

export default useAbortController;
