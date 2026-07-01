// src/hooks/useAsyncOperation.ts
// Hook para operacoes assincronas seguras com tratamento de erro - NOVAIX FITNESS

import { useState, useCallback } from 'react';

type AsyncResult<T> = { success: true; data: T } | { success: false; error: string };

export function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (fn: () => Promise<T>): Promise<AsyncResult<T>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
