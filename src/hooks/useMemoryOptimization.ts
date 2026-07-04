// src/hooks/useMemoryOptimization.ts
// Hook para otimização de memória - NOVAIX FITNESS

import { useEffect, useRef, useCallback } from 'react';

interface UseMemoryOptimizationOptions {
  componentName: string;
  cleanupOnUnmount?: boolean;
}

/**
 * Hook para otimização de memória
 * - Limpa referências ao desmontar
 * - Gerencia listeners e timers
 * - Evita memory leaks
 */
export function useMemoryOptimization({
  componentName,
  cleanupOnUnmount = true,
}: UseMemoryOptimizationOptions) {
  const cleanupFnsRef = useRef<Array<() => void>>([]);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  // Registrar função de cleanup
  const addCleanup = useCallback((fn: () => void) => {
    cleanupFnsRef.current.push(fn);
  }, []);

  // Criar timer gerenciado
  const createTimer = useCallback((fn: () => void, delay: number): ReturnType<typeof setTimeout> => {
    const timer = setTimeout(fn, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  // Limpar timer
  const clearTimer = useCallback((timer: ReturnType<typeof setTimeout>) => {
    clearTimeout(timer);
    timersRef.current = timersRef.current.filter(t => t !== timer);
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    if (!cleanupOnUnmount) return;

    return () => {
      // Executar todas as funções de cleanup
      cleanupFnsRef.current.forEach(fn => {
        try {
          fn();
        } catch (err) {
          if (__DEV__) console.error(`[Memory] Error in cleanup for ${componentName}:`, err);
        }
      });

      // Limpar todos os timers
      timersRef.current.forEach(timer => {
        clearTimeout(timer);
      });

      // Limpar arrays
      cleanupFnsRef.current = [];
      timersRef.current = [];
    };
  }, [componentName, cleanupOnUnmount]);

  return {
    addCleanup,
    createTimer,
    clearTimer,
  };
}

export default useMemoryOptimization;
