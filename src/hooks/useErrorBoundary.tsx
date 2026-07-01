// src/hooks/useErrorBoundary.ts
// Hook para Error Boundary customizado - NOVAIX FITNESS

import { useState, useCallback, type ComponentType, type ReactNode } from 'react';
import React from 'react';
import { errorTracker, ERROR_SEVERITY } from '../services/errorTracker';

interface ErrorInfo {
  componentStack?: string | null;
}

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  const captureError = useCallback((err: Error, info: ErrorInfo | null = null) => {
    setError(err);
    setErrorInfo(info);

    errorTracker.trackError(err, {
      componentStack: info?.componentStack,
      type: 'react_error_boundary',
    }, ERROR_SEVERITY.HIGH);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);

  const capturePromiseError = useCallback((promise: Promise<unknown>, context: Record<string, unknown> = {}) => {
    return promise.catch((err) => {
      errorTracker.trackError(err instanceof Error ? err : new Error(String(err)), {
        ...context,
        type: 'unhandled_promise',
      }, ERROR_SEVERITY.HIGH);
      throw err;
    });
  }, []);

  return {
    error,
    errorInfo,
    captureError,
    resetError,
    capturePromiseError,
    hasError: error !== null,
  };
}

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

export function withErrorBoundary<P extends Record<string, unknown>>(
  Component: ComponentType<P & { onError: (err: Error) => void }>,
  FallbackComponent?: ComponentType<FallbackProps>
) {
  return function ErrorBoundaryWrapper(props: P) {
    const { error, captureError, resetError } = useErrorBoundary();

    if (error) {
      return FallbackComponent ? (
        React.createElement(FallbackComponent, { error, resetError })
      ) : null;
    }

    return React.createElement(Component, { ...props, onError: captureError });
  };
}
