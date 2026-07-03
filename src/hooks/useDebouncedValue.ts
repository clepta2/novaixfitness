// src/hooks/useDebouncedValue.ts
// Hook para debounce de valores - NOVAIX FITNESS

import { useState, useEffect } from 'react';

/**
 * Hook que debounce um valor
 * @param value Valor a ser debounced
 * @param delay Delay em ms (padrão: 300ms)
 * @returns Valor debounced
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
