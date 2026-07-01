// src/services/errorTracker.ts
// Servico centralizado de tracking de erros - NOVAIX FITNESS
// Coleta, categoriza e reporta erros para debugging e monitoramento

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ErrorEntry = {
  id: string;
  message: string;
  code?: string;
  severity: ErrorSeverity;
  source: string;
  timestamp: number;
  stack?: string;
  metadata?: Record<string, unknown>;
};

type ErrorReporter = (entry: ErrorEntry) => void;

let reporter: ErrorReporter | null = null;
const recentErrors: ErrorEntry[] = [];
const MAX_RECENT = 50;

function generateId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Registra callback customizado para reportar erros (ex: Sentry, LogRocket)
export function setErrorReporter(fn: ErrorReporter): void {
  reporter = fn;
}

// Registra um erro no sistema
export function trackError(
  error: unknown,
  source: string,
  severity: ErrorSeverity = 'medium',
  metadata?: Record<string, unknown>
): ErrorEntry {
  const message = error instanceof Error ? error.message : String(error);
  const code = error instanceof Error && 'code' in error ? (error as any).code : undefined;
  const stack = error instanceof Error ? error.stack : undefined;

  const entry: ErrorEntry = {
    id: generateId(),
    message,
    code,
    severity,
    source,
    timestamp: Date.now(),
    stack,
    metadata,
  };

  recentErrors.unshift(entry);
  if (recentErrors.length > MAX_RECENT) recentErrors.pop();

  if (__DEV__) {
    const prefix = severity === 'critical' ? '🚨' : severity === 'high' ? '⚠️' : 'ℹ️';
    console.error(`${prefix} [${source}]`, message, metadata || '');
  }

  reporter?.(entry);
  return entry;
}

// Obtem erros recentes
export function getRecentErrors(limit = 20): ErrorEntry[] {
  return recentErrors.slice(0, limit);
}

// Limpa erros armazenados
export function clearErrors(): void {
  recentErrors.length = 0;
}

// Converte erro Supabase em mensagem amigavel
export function classifySupabaseError(error: { message?: string; code?: string }): {
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
} {
  const msg = error.message || 'Erro desconhecido';
  const code = error.code || '';

  if (code === '23505') return { message: 'Registro duplicado', severity: 'low', retryable: false };
  if (code === '23503') return { message: 'Referencia invalida', severity: 'medium', retryable: false };
  if (code === '42501') return { message: 'Sem permissao', severity: 'high', retryable: false };
  if (code === 'PGRST301') return { message: 'Registro nao encontrado', severity: 'low', retryable: false };
  if (msg.includes('network') || msg.includes('fetch')) return { message: 'Erro de conexao', severity: 'medium', retryable: true };
  if (msg.includes('timeout')) return { message: 'Tempo esgotado', severity: 'medium', retryable: true };

  return { message: msg, severity: 'medium', retryable: true };
}

// Converte erro HTTP em mensagem amigavel
export function classifyHttpError(status: number): {
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
} {
  if (status === 400) return { message: 'Dados invalidos', severity: 'low', retryable: false };
  if (status === 401) return { message: 'Sessao expirada. Faca login novamente.', severity: 'high', retryable: false };
  if (status === 403) return { message: 'Sem permissao', severity: 'high', retryable: false };
  if (status === 404) return { message: 'Nao encontrado', severity: 'low', retryable: false };
  if (status === 429) return { message: 'Muitas requisicoes. Aguarde.', severity: 'medium', retryable: true };
  if (status >= 500) return { message: 'Erro no servidor. Tente novamente.', severity: 'high', retryable: true };
  return { message: `Erro HTTP ${status}`, severity: 'medium', retryable: false };
}
