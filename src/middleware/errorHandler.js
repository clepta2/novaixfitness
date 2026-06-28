// src/middleware/errorHandler.js
// Middleware de tratamento de erros

export function handleApiError(error, context = '') {
  console.error(`[ERROR] ${context}:`, error.message);
  
  if (error.message?.includes('JWT')) {
    return { status: 401, message: 'Sessão expirada. Faça login novamente.' };
  }
  if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
    return { status: 403, message: 'Sem permissão para esta ação.' };
  }
  if (error.message?.includes('not found')) {
    return { status: 404, message: 'Recurso não encontrado.' };
  }
  if (error.message?.includes('duplicate')) {
    return { status: 409, message: 'Registro já existe.' };
  }
  if (error.message?.includes('validation') || error.message?.includes('invalid')) {
    return { status: 400, message: 'Dados inválidos. Verifique as informações.' };
  }
  
  return { status: 500, message: 'Erro interno. Tente novamente.' };
}

export function formatUserError(error) {
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
