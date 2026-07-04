// src/hooks/useErrorBoundary.ts
// Hook para Error Boundary - NOVAIX FITNESS

import { useState, useCallback } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
}

interface UseErrorBoundaryResult {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isError: boolean;
  captureError: (error: Error, errorInfo?: any) => void;
  clearError: () => void;
  retry: () => void;
}

/**
 * Hook para capturar e gerenciar erros
 */
export function useErrorBoundary(): UseErrorBoundaryResult {
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const captureError = useCallback((err: Error, info?: any) => {
    setError(err);
    setErrorInfo({
      message: err.message,
      stack: err.stack,
      componentStack: info?.componentStack,
      timestamp: Date.now(),
    });

    // Log do erro
    if (__DEV__) {
      if (__DEV__) console.error('[ErrorBoundary]', err, info);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);

  const retry = useCallback(() => {
    clearError();
    setRetryCount(prev => prev + 1);
  }, [clearError]);

  return {
    error,
    errorInfo,
    isError: error !== null,
    captureError,
    clearError,
    retry,
  };
}

export default useErrorBoundary;
