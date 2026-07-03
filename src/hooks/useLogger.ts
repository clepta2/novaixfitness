// src/hooks/useLogger.ts
// Hook para logging contextual - NOVAIX FITNESS

import { useCallback, useRef } from 'react';
import { logger } from '../utils/logger';

interface UseLoggerOptions {
  component: string;
  userId?: string;
}

/**
 * Hook para logging contextual com nome do componente
 */
export function useLogger({ component, userId }: UseLoggerOptions) {
  const componentRef = useRef(component);
  componentRef.current = component;

  const debug = useCallback((message: string, data?: any) => {
    logger.debug(message, data, componentRef.current);
  }, []);

  const info = useCallback((message: string, data?: any) => {
    logger.info(message, data, componentRef.current);
  }, []);

  const warn = useCallback((message: string, data?: any) => {
    logger.warn(message, data, componentRef.current);
  }, []);

  const error = useCallback((message: string, err?: any) => {
    logger.error(message, err, componentRef.current);
  }, []);

  const userAction = useCallback((action: string, data?: any) => {
    logger.userAction(action, userId || 'unknown', { component: componentRef.current, ...data });
  }, [userId]);

  return {
    debug,
    info,
    warn,
    error,
    userAction,
  };
}

export default useLogger;
