// src/utils/performance.ts
// Utilitários de performance - NOVAIX FITNESS

interface PerformanceEntry {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private entries: PerformanceEntry[] = [];
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (startTime === undefined) {
      if (__DEV__) console.warn(`Mark "${startMark}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.entries.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    this.marks.delete(startMark);
    return duration;
  }

  getEntries(name?: string): PerformanceEntry[] {
    if (name) {
      return this.entries.filter(e => e.name === name);
    }
    return [...this.entries];
  }

  getAverageDuration(name: string): number {
    const entries = this.getEntries(name);
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, e) => sum + e.duration, 0);
    return total / entries.length;
  }

  clear(): void {
    this.entries = [];
    this.marks.clear();
  }

  logSlowOperations(threshold: number = 100): void {
    const slowOps = this.entries.filter(e => e.duration > threshold);
    if (slowOps.length > 0) {
      if (__DEV__) console.warn(`[Performance] ${slowOps.length} slow operations detected:`);
      slowOps.forEach(op => {
        if (__DEV__) console.warn(`  ${op.name}: ${op.duration.toFixed(2)}ms`);
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Helper para medir tempo de funções
export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      performanceMonitor['entries'].push({
        name,
        duration,
        timestamp: Date.now(),
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Helper para medir tempo de funções síncronas
export function measureSync<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  performanceMonitor['entries'].push({
    name,
    duration,
    timestamp: Date.now(),
  });
  return result;
}

// Debounce para otimização
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle para otimização
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}
