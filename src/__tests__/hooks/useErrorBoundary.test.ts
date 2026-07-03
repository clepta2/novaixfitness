// src/__tests__/hooks/useErrorBoundary.test.ts
// Testes para useErrorBoundary - NOVAIX FITNESS

import { renderHook, act } from '@testing-library/react-hooks';
import { useErrorBoundary } from '../../hooks/useErrorBoundary';

describe('useErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorBoundary());
    
    expect(result.current.error).toBeNull();
    expect(result.current.errorInfo).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should capture error when captureError is called', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');
    
    act(() => {
      result.current.captureError(testError);
    });
    
    expect(result.current.error).toBe(testError);
    expect(result.current.isError).toBe(true);
    expect(result.current.errorInfo).toBeDefined();
    expect(result.current.errorInfo?.message).toBe('Test error');
  });

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');
    
    act(() => {
      result.current.captureError(testError);
    });
    
    expect(result.current.isError).toBe(true);
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should retry and clear error', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');
    
    act(() => {
      result.current.captureError(testError);
    });
    
    expect(result.current.isError).toBe(true);
    
    act(() => {
      result.current.retry();
    });
    
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should store error info with timestamp', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');
    const before = Date.now();
    
    act(() => {
      result.current.captureError(testError);
    });
    
    const after = Date.now();
    
    expect(result.current.errorInfo?.timestamp).toBeGreaterThanOrEqual(before);
    expect(result.current.errorInfo?.timestamp).toBeLessThanOrEqual(after);
  });

  it('should store stack trace when available', () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error('Test error');
    testError.stack = 'Error: Test error\n    at test.js:1:1';
    
    act(() => {
      result.current.captureError(testError);
    });
    
    expect(result.current.errorInfo?.stack).toBe(testError.stack);
  });
});
