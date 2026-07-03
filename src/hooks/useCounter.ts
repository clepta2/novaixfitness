// src/hooks/useCounter.ts
// Hook para contadores - NOVAIX FITNESS

import { useState, useCallback } from 'react';

interface UseCounterOptions {
  initialValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

interface UseCounterResult {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

/**
 * Hook para gerenciar contadores com limites
 */
export function useCounter(options: UseCounterOptions = {}): UseCounterResult {
  const {
    initialValue = 0,
    minValue = -Infinity,
    maxValue = Infinity,
    step = 1,
  } = options;

  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => Math.min(prev + step, maxValue));
  }, [step, maxValue]);

  const decrement = useCallback(() => {
    setCount(prev => Math.max(prev - step, minValue));
  }, [step, minValue]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value: number) => {
    setCount(Math.max(minValue, Math.min(maxValue, value)));
  }, [minValue, maxValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    set,
    canIncrement: count < maxValue,
    canDecrement: count > minValue,
  };
}

export default useCounter;
