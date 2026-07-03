// src/hooks/useLazyLoad.ts
// Hook para lazy loading de componentes - NOVAIX FITNESS

import { useState, useEffect, useRef, useCallback } from 'react';
import { InteractionManager } from 'react-native';

interface UseLazyLoadOptions {
  delay?: number;
  waitUntilInteraction?: boolean;
}

interface UseLazyLoadResult {
  shouldLoad: boolean;
  isLoaded: boolean;
  markAsLoaded: () => void;
}

/**
 * Hook para lazy loading de componentes pesados
 * Espera a interação do usuário antes de carregar
 */
export function useLazyLoad(options: UseLazyLoadOptions = {}): UseLazyLoadResult {
  const { delay = 0, waitUntilInteraction = true } = options;
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const loadComponent = () => {
      if (!mountedRef.current) return;

      if (delay > 0) {
        setTimeout(() => {
          if (mountedRef.current) {
            setShouldLoad(true);
          }
        }, delay);
      } else {
        setShouldLoad(true);
      }
    };

    if (waitUntilInteraction) {
      const handle = InteractionManager.runAfterInteractions(() => {
        loadComponent();
      });
      return () => {
        mountedRef.current = false;
        handle.cancel();
      };
    } else {
      loadComponent();
      return () => {
        mountedRef.current = false;
      };
    }
  }, [delay, waitUntilInteraction]);

  const markAsLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return { shouldLoad, isLoaded, markAsLoaded };
}

export default useLazyLoad;
