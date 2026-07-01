// src/hooks/useServiceCall.ts
// Hook para chamadas a services com tratamento de erro integrado - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { formatError } from '../utils/asyncHandler';

type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function useServiceCall<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (fn: () => Promise<T>): Promise<ServiceResult<T>> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn();
      setLoading(false);
      return { ok: true, data };
    } catch (err) {
      const message = formatError(err);
      setError(message);
      setLoading(false);
      return { ok: false, error: message };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, call, clearError };
}
