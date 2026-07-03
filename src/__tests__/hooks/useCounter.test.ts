// src/__tests__/hooks/useCounter.test.ts
// Testes para useCounter - NOVAIX FITNESS

import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from '../../hooks/useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 10 }));
    
    expect(result.current.count).toBe(10);
  });

  it('should increment', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 0 }));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should decrement', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 5 }));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 10 }));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(13);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });

  it('should set specific value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 0 }));
    
    act(() => {
      result.current.set(42);
    });
    
    expect(result.current.count).toBe(42);
  });

  it('should respect maxValue', () => {
    const { result } = renderHook(() => useCounter({ 
      initialValue: 9, 
      maxValue: 10 
    }));
    
    expect(result.current.canIncrement).toBe(true);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(10);
    expect(result.current.canIncrement).toBe(false);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(10);
  });

  it('should respect minValue', () => {
    const { result } = renderHook(() => useCounter({ 
      initialValue: 1, 
      minValue: 0 
    }));
    
    expect(result.current.canDecrement).toBe(true);
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(0);
    expect(result.current.canDecrement).toBe(false);
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(0);
  });

  it('should use custom step', () => {
    const { result } = renderHook(() => useCounter({ 
      initialValue: 0, 
      step: 5 
    }));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(5);
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(0);
  });

  it('should respect minValue when setting', () => {
    const { result } = renderHook(() => useCounter({ 
      initialValue: 5, 
      minValue: 0,
      maxValue: 10
    }));
    
    act(() => {
      result.current.set(-5);
    });
    
    expect(result.current.count).toBe(0);
  });

  it('should respect maxValue when setting', () => {
    const { result } = renderHook(() => useCounter({ 
      initialValue: 5, 
      minValue: 0,
      maxValue: 10
    }));
    
    act(() => {
      result.current.set(100);
    });
    
    expect(result.current.count).toBe(10);
  });
});
