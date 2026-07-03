// src/hooks/usePrevious.ts
// Hook para obter valor anterior - NOVAIX FITNESS

import { useRef, useEffect } from 'react';

/**
 * Hook que retorna o valor anterior de uma variável
 * Útil para comparar valores entre renders
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
