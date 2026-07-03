// src/utils/asyncHandler.ts
// Utilitarios para tratamento seguro de funcoes assincronas - NOVAIX FITNESS

// Resultado padrao de operacao
export type Result<T> = { success: true; data: T } | { success: false; error: string; code?: string };

// Executa funcao async com tratamento de erro padronizado
export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    if (__DEV__) console.error('[safeAsync]', message, err);
    return { success: false, error: message };
  }
}

// Executa funcao async com retry automatico
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<Result<T>> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const data = await fn();
      return { success: true, data };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  return { success: false, error: lastError?.message || 'Falha apos tentativas' };
}

// Verifica se valor nao e nulo/undefined
export function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} e obrigatorio`);
  }
}

// Converte erro para mensagem amigavel
export function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Ocorreu um erro inesperado';
}

// Executa callback com protecao contra erros
export function protectedCallback<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

// Debounce simples
export function debounce<F extends (...args: any[]) => any>(fn: F, ms: number): F {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as F;
}
