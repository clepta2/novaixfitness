// src/hooks/useDebounce.js
// Hook para debounce de valores - NOVAIX FITNESS

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useDebouncedCallback(callback, delay = 300) {
  const [timer, setTimer] = useState(null);

  return (...args) => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => callback(...args), delay);
    setTimer(newTimer);
  };
}
