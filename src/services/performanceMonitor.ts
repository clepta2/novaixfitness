// src/services/performanceMonitor.js
// Monitor de performance - NOVAIX FITNESS

import { startTransaction } from '../config/sentry';
import { InteractionManager } from 'react-native';

interface Metric {
  type: string;
  name: string;
  duration: number;
  timestamp: number;
  success?: boolean;
  error?: string;
}

interface PerformanceSummary {
  totalMetrics: number;
  renders: { count: number; avgDuration: number; slow: number };
  asyncOps: { count: number; avgDuration: number; failures: number };
  interactions: { count: number; avgDuration: number };
}

class PerformanceMonitor {
  metrics: Metric[] = [];
  maxMetrics = 500;
  activeTransactions = new Map<string, ReturnType<typeof startTransaction>>();

  startTransaction(name: string, op = 'task') {
    const transaction = startTransaction(name, op);
    this.activeTransactions.set(name, transaction);
    return transaction;
  }

  finishTransaction(name: string) {
    const transaction = this.activeTransactions.get(name);
    if (transaction) {
      transaction.finish();
      this.activeTransactions.delete(name);
    }
  }

  measureRender<T>(componentName: string, renderFn: () => T): T {
    const start = performance.now();
    const result = renderFn();
    const duration = performance.now() - start;

    this.recordMetric({
      type: 'render',
      name: componentName,
      duration,
      timestamp: Date.now(),
    });

    if (duration > 16) {
      if (__DEV__) console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  async measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const duration = performance.now() - start;

      this.recordMetric({
        type: 'async',
        name,
        duration,
        success: true,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      const message = error instanceof Error ? error.message : String(error);

      this.recordMetric({
        type: 'async',
        name,
        duration,
        success: false,
        error: message,
        timestamp: Date.now(),
      });

      throw error;
    }
  }

  measureAPICall<T>(endpoint: string, method: string, apiFn: () => Promise<T>) {
    return this.measureAsync<T>(`API:${method}:${endpoint}`, apiFn);
  }

  measureScreenLoad<T>(screenName: string, loadFn: () => Promise<T>) {
    return this.measureAsync<T>(`Screen:${screenName}`, loadFn);
  }

  measureInteraction<T>(interactionName: string, interactionFn: () => T) {
    return new Promise<T>((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        const start = performance.now();
        const result = interactionFn();
        const duration = performance.now() - start;

        this.recordMetric({
          type: 'interaction',
          name: interactionName,
          duration,
          timestamp: Date.now(),
        });

        resolve(result);
      });
    });
  }

  recordMetric(metric: Metric) {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getMetrics(type?: string | null) {
    if (type) {
      return this.metrics.filter(m => m.type === type);
    }
    return this.metrics;
  }

  getAverageDuration(type: string, name?: string | null) {
    const filtered = this.metrics.filter(m =>
      m.type === type && (!name || m.name === name)
    );

    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum: number, m: Metric) => sum + m.duration, 0);
    return total / filtered.length;
  }

  getSlowOperations(threshold = 1000) {
    return this.metrics.filter(m => m.duration > threshold);
  }

  getPerformanceSummary(): PerformanceSummary {
    const renders = this.getMetrics('render');
    const asyncOps = this.getMetrics('async');
    const interactions = this.getMetrics('interaction');

    return {
      totalMetrics: this.metrics.length,
      renders: {
        count: renders.length,
        avgDuration: this.getAverageDuration('render'),
        slow: renders.filter((m: Metric) => m.duration > 16).length,
      },
      asyncOps: {
        count: asyncOps.length,
        avgDuration: this.getAverageDuration('async'),
        failures: asyncOps.filter((m: Metric) => !m.success).length,
      },
      interactions: {
        count: interactions.length,
        avgDuration: this.getAverageDuration('interaction'),
      },
    };
  }

  clearMetrics() {
    this.metrics = [];
  }

  async exportMetrics() {
    return {
      timestamp: new Date().toISOString(),
      summary: this.getPerformanceSummary(),
      slowOperations: this.getSlowOperations(),
      recentMetrics: this.metrics.slice(-50),
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
