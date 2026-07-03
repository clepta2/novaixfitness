// src/hooks/useOptimistic.ts
// Hook para updates otimistas - NOVAIX FITNESS

import { useState, useCallback, useRef } from 'react';

interface UseOptimisticOptions<T, R> {
  onMutate: (data: T) => Promise<R>;
  onError?: (error: Error, data: T, previousState: R) => void;
  onSettled?: (result: R | null, data: T) => void;
}

interface UseOptimisticResult<T, R> {
  data: R | null;
  isPending: boolean;
  error: Error | null;
  mutate: (data: T) => Promise<R | null>;
  reset: () => void;
}

/**
 * Hook para updates otimistas com rollback automático
 * Atualiza a UI imediatamente e reverte em caso de erro
 */
export function useOptimistic<T, R>(
  initialState: R,
  options: UseOptimisticOptions<T, R>
): UseOptimisticResult<T, R> {
  const [data, setData] = useState<R>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const previousDataRef = useRef<R>(initialState);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const mutate = useCallback(async (mutationData: T): Promise<R | null> => {
    setIsPending(true);
    setError(null);
    previousDataRef.current = data;

    try {
      const result = await optionsRef.current.onMutate(mutationData);
      setData(result);
      optionsRef.current.onSettled?.(result, mutationData);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setData(previousDataRef.current);
      optionsRef.current.onError?.(error, mutationData, previousDataRef.current);
      optionsRef.current.onSettled?.(null, mutationData);
      return null;
    } finally {
      setIsPending(false);
    }
  }, [data]);

  const reset = useCallback(() => {
    setData(initialState);
    setIsPending(false);
    setError(null);
    previousDataRef.current = initialState;
  }, [initialState]);

  return { data, isPending, error, mutate, reset };
}

export default useOptimistic;
