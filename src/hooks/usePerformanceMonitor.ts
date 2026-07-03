// src/hooks/usePerformanceMonitor.ts
// Hook para monitoramento de performance - NOVAIX FITNESS

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastRenderDuration: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  logThreshold?: number; // ms - só loga se passar deste threshold
  enabled?: boolean;
}

/**
 * Hook para monitorar performance de componentes
 */
export function usePerformanceMonitor({
  componentName,
  logThreshold = 16, // 60fps = 16ms por frame
  enabled = __DEV__,
}: UsePerformanceMonitorOptions): PerformanceMetrics {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    mountTime: Date.now(),
    updateCount: 0,
    lastRenderDuration: 0,
  });

  const renderStartRef = useRef<number>(0);

  // Medir tempo de render
  useEffect(() => {
    if (!enabled) return;

    renderStartRef.current = performance.now();

    return () => {
      const duration = performance.now() - renderStartRef.current;
      metricsRef.current.lastRenderDuration = duration;
      metricsRef.current.renderTime += duration;
      metricsRef.current.updateCount++;

      // Log se passar do threshold
      if (duration > logThreshold) {
        console.warn(
          `[Performance] ${componentName} render took ${duration.toFixed(2)}ms`,
          metricsRef.current
        );
      }
    };
  });

  // Log de métricas ao desmontar
  useEffect(() => {
    if (!enabled) return;

    return () => {
      const totalTime = Date.now() - metricsRef.current.mountTime;
      console.log(
        `[Performance] ${componentName} lifecycle:`,
        {
          mountTime: metricsRef.current.mountTime,
          totalTime,
          updates: metricsRef.current.updateCount,
          avgRenderTime: metricsRef.current.renderTime / (metricsRef.current.updateCount || 1),
        }
      );
    };
  }, [componentName, enabled]);

  return metricsRef.current;
}

/**
 * Hook para medir tempo de uma operação
 */
export function useMeasureTime() {
  const measure = useCallback(async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      if (__DEV__) {
        console.log(`[Timer] ${name}: ${duration.toFixed(2)}ms`);
      }
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      if (__DEV__) {
        console.error(`[Timer] ${name} failed after ${duration.toFixed(2)}ms`);
      }
      throw error;
    }
  }, []);

  return { measure };
}

export default usePerformanceMonitor;
