const {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
} = require('../../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { originalUrl: '/test' };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Error Classes', () => {
    it('AppError deve ter statusCode e code padrão', () => {
      const err = new AppError('Test');
      expect(err.message).toBe('Test');
      expect(err.statusCode).toBe(500);
      expect(err.code).toBe('INTERNAL_ERROR');
      expect(err.isOperational).toBe(true);
    });

    it('AppError deve aceitar statusCode customizado', () => {
      const err = new AppError('Test', 400, 'CUSTOM');
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('CUSTOM');
    });

    it('ValidationError deve ter details', () => {
      const err = new ValidationError('Invalid', { field: 'email' });
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.details).toEqual({ field: 'email' });
    });

    it('NotFoundError deve ter mensagem padrão', () => {
      const err = new NotFoundError();
      expect(err.message).toBe('Recurso não encontrado');
      expect(err.statusCode).toBe(404);
      expect(err.code).toBe('NOT_FOUND');
    });

    it('NotFoundError deve aceitar resource customizado', () => {
      const err = new NotFoundError('Usuário');
      expect(err.message).toBe('Usuário não encontrado');
    });

    it('UnauthorizedError deve ter mensagem padrão', () => {
      const err = new UnauthorizedError();
      expect(err.message).toBe('Não autorizado');
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('UNAUTHORIZED');
    });

    it('ForbiddenError deve ter mensagem padrão', () => {
      const err = new ForbiddenError();
      expect(err.message).toBe('Acesso negado');
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe('FORBIDDEN');
    });

    it('ConflictError deve ter mensagem padrão', () => {
      const err = new ConflictError();
      expect(err.message).toBe('Conflito de dados');
      expect(err.statusCode).toBe(409);
      expect(err.code).toBe('CONFLICT');
    });

    it('RateLimitError deve ter mensagem padrão', () => {
      const err = new RateLimitError();
      expect(err.message).toBe('Muitas requisições');
      expect(err.statusCode).toBe(429);
      expect(err.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('errorHandler', () => {
    it('deve retornar erro operacional com statusCode', () => {
      const err = new AppError('Test error', 400, 'TEST');
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Test error', code: 'TEST' });
    });

    it('deve incluir details quando disponível', () => {
      const err = new ValidationError('Invalid', { field: 'email' });
      errorHandler(err, req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid', code: 'VALIDATION_ERROR', details: { field: 'email' } });
    });

    it('deve retornar 500 para erros não tratados', () => {
      const err = new Error('Unexpected error');
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor', code: 'INTERNAL_ERROR' });
    });
  });

  describe('notFoundHandler', () => {
    it('deve retornar 404 com path', () => {
      notFoundHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Rota não encontrada', code: 'ROUTE_NOT_FOUND', path: '/test' });
    });
  });

  describe('asyncHandler', () => {
    it('deve chamar next com erro', async () => {
      const fn = async () => { throw new Error('Async error'); };
      const handler = asyncHandler(fn);
      await handler(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Async error');
    });

    it('deve executar função sem erro', async () => {
      const fn = async () => { res.json({ ok: true }); };
      const handler = asyncHandler(fn);
      await handler(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ ok: true });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
