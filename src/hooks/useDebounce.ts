// src/hooks/useDebounce.ts
// Hook para debounce de valores - NOVAIX FITNESS

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useDebouncedCallback<T extends (...args: never[]) => void>(callback: T, delay = 300) {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => callback(...args), delay);
    setTimer(newTimer);
  };
}
