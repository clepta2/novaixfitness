// src/services/performanceMonitor.ts
// Performance Monitoring — captura de erros, metricas de tela, trace de operacoes
// Compativel com Sentry/LogRocket, mas funciona offline

type MetricEntry = {
  name: string;
  duration: number;
  timestamp: number;
  screen?: string;
  success: boolean;
  metadata?: Record<string, unknown>;
};

type ErrorEntry = {
  id: string;
  message: string;
  stack?: string;
  screen?: string;
  userId?: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: Record<string, unknown>;
};

type ScreenTiming = {
  screen: string;
  mountTime: number;
  renderCount: number;
  lastRender: number;
};

const metrics: MetricEntry[] = [];
const errors: ErrorEntry[] = [];
const screenTimings = new Map<string, ScreenTiming>();
const MAX_METRICS = 200;
const MAX_ERRORS = 100;

function generateId(): string {
  return `perf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Registra duracao de uma operacao
export function trackOperation(name: string, duration: number, options: { screen?: string; success?: boolean; metadata?: Record<string, unknown> } = {}) {
  const entry: MetricEntry = {
    name,
    duration,
    timestamp: Date.now(),
    screen: options.screen,
    success: options.success !== false,
    metadata: options.metadata,
  };
  metrics.push(entry);
  if (metrics.length > MAX_METRICS) metrics.shift();

  if (__DEV__ && duration > 1000) {
    console.warn(`[perf] ${name} levou ${duration.toFixed(0)}ms`);
  }
}

// Cronometra uma operacao async
export async function measureOperation<T>(name: string, fn: () => Promise<T>, screen?: string): Promise<T> {
  const start = performance.now();
  let success = true;
  try {
    const result = await fn();
    return result;
  } catch (err) {
    success = false;
    throw err;
  } finally {
    trackOperation(name, performance.now() - start, { screen, success });
  }
}

// Registra erro com contexto
export function trackError(error: unknown, options: {
  screen?: string;
  userId?: string;
  severity?: ErrorEntry['severity'];
  context?: Record<string, unknown>;
} = {}) {
  const err = error instanceof Error ? error : new Error(String(error));
  const entry: ErrorEntry = {
    id: generateId(),
    message: err.message,
    stack: err.stack,
    screen: options.screen,
    userId: options.userId,
    timestamp: Date.now(),
    severity: options.severity || 'medium',
    context: options.context || {},
  };
  errors.push(entry);
  if (errors.length > MAX_ERRORS) errors.shift();

  if (__DEV__) {
    console.error(`[error:${entry.severity}] ${entry.message}`, entry.context);
  }
}

// Registra timing de tela
export function trackScreenMount(screen: string) {
  const existing = screenTimings.get(screen);
  if (existing) {
    existing.renderCount++;
    existing.lastRender = Date.now();
  } else {
    screenTimings.set(screen, {
      screen,
      mountTime: performance.now(),
      renderCount: 1,
      lastRender: Date.now(),
    });
  }
}

// Obtem metricas para envio
export function getMetricsForExport(): { metrics: MetricEntry[]; errors: ErrorEntry[]; screens: ScreenTiming[] } {
  return {
    metrics: [...metrics],
    errors: [...errors],
    screens: [...screenTimings.values()],
  };
}

// Limpa dados antigos
export function clearOldData(maxAgeMs: number = 24 * 60 * 60 * 1000) {
  const cutoff = Date.now() - maxAgeMs;
  const mLen = metrics.length;
  const eLen = errors.length;
  while (metrics.length && metrics[0].timestamp < cutoff) metrics.shift();
  while (errors.length && errors[0].timestamp < cutoff) errors.shift();
  for (const [key, timing] of screenTimings) {
    if (timing.lastRender < cutoff) screenTimings.delete(key);
  }
  if (__DEV__ && (metrics.length !== mLen || errors.length !== eLen)) {
    console.info(`[perf] Limpeza: ${mLen - metrics.length} metricas, ${eLen - errors.length} erros removidos`);
  }
}

// Limpa tudo (para testes)
export function resetAll() {
  metrics.length = 0;
  errors.length = 0;
  screenTimings.clear();
}

// Performance marks (moved from monitoring.ts)

interface PerformanceMark {
  start: number;
  end?: number;
  duration?: number;
}

interface PerfEntry {
  name: string;
  duration: number;
  timestamp: number;
}

const performanceMarks: Record<string, PerformanceMark> = {};

export function markStart(name: string): void {
  performanceMarks[name] = { start: Date.now() };
}

export function markEnd(name: string): void {
  if (performanceMarks[name]) {
    performanceMarks[name].end = Date.now();
    performanceMarks[name].duration = performanceMarks[name].end! - performanceMarks[name].start;
  }
}

export function getPerformanceReport(): PerfEntry[] {
  return Object.entries(performanceMarks)
    .filter(([, v]) => v.duration)
    .sort((a, b) => b[1].duration! - a[1].duration!)
    .slice(0, 20)
    .map(([name, data]) => ({ name, duration: data.duration!, timestamp: data.start }));
}

// Obtem resumo de performance
export function getPerformanceSummary(): {
  totalOperations: number;
  avgDuration: number;
  slowOperations: Array<{ name: string; avgDuration: number; count: number }>;
  totalErrors: number;
  errorsByScreen: Record<string, number>;
  screensLoaded: number;
} {
  const opMap = new Map<string, { total: number; count: number }>();
  for (const m of metrics) {
    const existing = opMap.get(m.name) || { total: 0, count: 0 };
    existing.total += m.duration;
    existing.count++;
    opMap.set(m.name, existing);
  }

  const slowOperations = [...opMap.entries()]
    .map(([name, data]) => ({ name, avgDuration: data.total / data.count, count: data.count }))
    .filter(op => op.avgDuration > 500)
    .sort((a, b) => b.avgDuration - a.avgDuration)
    .slice(0, 10);

  const errorsByScreen: Record<string, number> = {};
  for (const e of errors) {
    const screen = e.screen || 'unknown';
    errorsByScreen[screen] = (errorsByScreen[screen] || 0) + 1;
  }

  const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);

  return {
    totalOperations: metrics.length,
    avgDuration: metrics.length > 0 ? totalDuration / metrics.length : 0,
    slowOperations,
    totalErrors: errors.length,
    errorsByScreen,
    screensLoaded: screenTimings.size,
  };
}
