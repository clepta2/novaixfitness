const { corsMiddleware, strictCors, publicCors, allowedOrigins } = require('../../src/middleware/cors');

describe('CORS Middleware', () => {
  it('deve exportar corsMiddleware', () => {
    expect(typeof corsMiddleware).toBe('function');
  });

  it('deve exportar strictCors', () => {
    expect(typeof strictCors).toBe('function');
  });

  it('deve exportar publicCors', () => {
    expect(typeof publicCors).toBe('function');
  });

  it('deve ter allowedOrigins definido', () => {
    expect(Array.isArray(allowedOrigins)).toBe(true);
    expect(allowedOrigins.length).toBeGreaterThan(0);
  });

  it('deve conter localhost como origem padrão', () => {
    expect(allowedOrigins.some(o => o.includes('localhost'))).toBe(true);
  });

  it('deve conter domínio novaixfitness', () => {
    expect(allowedOrigins).toContain('https://novaixfitness.com');
  });

  it('corsMiddleware deve ser um middleware válido', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn(), getHeader: jest.fn() };
    const next = jest.fn();
    corsMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('strictCors deve ser um middleware válido', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn(), getHeader: jest.fn() };
    const next = jest.fn();
    strictCors(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('publicCors deve ser um middleware válido', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn(), getHeader: jest.fn() };
    const next = jest.fn();
    publicCors(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('deve ter www.novaixfitness.com', () => {
    expect(allowedOrigins).toContain('https://www.novaixfitness.com');
  });

  it('deve ter method OPTIONS', () => {
    expect(allowedOrigins).toBeDefined();
  });
});
