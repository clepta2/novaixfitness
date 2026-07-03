// src/__tests__/hooks/useLazyLoad.test.ts
// Testes para useLazyLoad - NOVAIX FITNESS

import { renderHook, act } from '@testing-library/react-hooks';
import { useLazyLoad } from '../../hooks/useLazyLoad';

describe('useLazyLoad', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return shouldLoad as false initially when waitUntilInteraction is true', () => {
    const { result } = renderHook(() => useLazyLoad({ waitUntilInteraction: true }));
    
    expect(result.current.shouldLoad).toBe(false);
    expect(result.current.isLoaded).toBe(false);
  });

  it('should return shouldLoad as true immediately when waitUntilInteraction is false', () => {
    const { result } = renderHook(() => useLazyLoad({ waitUntilInteraction: false }));
    
    expect(result.current.shouldLoad).toBe(true);
  });

  it('should respect delay option', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useLazyLoad({ 
      delay: 1000, 
      waitUntilInteraction: false 
    }));
    
    expect(result.current.shouldLoad).toBe(false);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.shouldLoad).toBe(true);
    
    jest.useRealTimers();
  });

  it('should mark as loaded when markAsLoaded is called', () => {
    const { result } = renderHook(() => useLazyLoad({ waitUntilInteraction: false }));
    
    expect(result.current.isLoaded).toBe(false);
    
    act(() => {
      result.current.markAsLoaded();
    });
    
    expect(result.current.isLoaded).toBe(true);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useLazyLoad({ waitUntilInteraction: true }));
    
    expect(() => unmount()).not.toThrow();
  });
});
