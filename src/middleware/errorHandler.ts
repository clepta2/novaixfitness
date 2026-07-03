// src/middleware/errorHandler.ts
// Middleware de tratamento de erros

interface ApiErrorResult {
  status: number;
  message: string;
}

export function handleApiError(error: any, context: string = ''): ApiErrorResult {
  if (__DEV__) console.error(`[ERROR] ${context}:`, error.message);
  
  const msg = error.message || '';
  
  if (msg.includes('JWT')) {
    return { status: 401, message: 'Sessão expirada. Faça login novamente.' };
  }
  if (msg.includes('permission denied') || msg.includes('RLS')) {
    return { status: 403, message: 'Sem permissão para esta ação.' };
  }
  if (msg.includes('not found')) {
    return { status: 404, message: 'Recurso não encontrado.' };
  }
  if (msg.includes('duplicate')) {
    return { status: 409, message: 'Registro já existe.' };
  }
  if (msg.includes('validation') || msg.includes('invalid')) {
    return { status: 400, message: 'Dados inválidos. Verifique as informações.' };
  }
  
  return { status: 500, message: 'Erro interno. Tente novamente.' };
}

export function formatUserError(error: any): string {
  if (!error) return 'Ocorreu um erro inesperado.';
  
  const msg = error.message || error.error || String(error);
  
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Sem conexão com a internet. Verifique sua rede.';
  }
  if (msg.includes('timeout')) {
    return 'Requisição demorou muito. Tente novamente.';
  }
  
  return 'Algo deu errado. Tente novamente em alguns instantes.';
}
