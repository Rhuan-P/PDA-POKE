export class ApiError extends Error {
  constructor(message, status, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.originalError = originalError;
  }
}

export function handleApiError(error, context = '') {
  if (error instanceof ApiError) throw error;

  if (error.status === 404) {
    throw new ApiError(`[${context}] Recurso não encontrado.`, 404, error);
  }

  if (error.status >= 500) {
    throw new ApiError(`[${context}] Erro interno do servidor.`, error.status, error);
  }

  if (error.message === 'Request timeout') {
    throw new ApiError(`[${context}] Timeout na requisição.`, 408, error);
  }

  throw new ApiError(`[${context}] Erro inesperado: ${error.message}`, 0, error);
}