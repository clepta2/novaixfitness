const { corsMiddleware, strictCors, publicCors, allowedOrigins } = require('../../src/middleware/cors');

describe('CORS Middleware', () => {
  describe('exports', () => {
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

    it('deve conter localhost como origem padrao', () => {
      expect(allowedOrigins.some(o => o.includes('localhost'))).toBe(true);
    });

    it('deve conter dominio novaixfitness', () => {
      expect(allowedOrigins).toContain('https://novaixfitness.com');
    });

    it('deve ter www.novaixfitness.com', () => {
      expect(allowedOrigins).toContain('https://www.novaixfitness.com');
    });
  });

  describe('corsMiddleware - origin validation', () => {
    it('deve ser um middleware valido que chama next', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      corsMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve permitir origem ausente (null/undefined)', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      corsMiddleware(req, res, next);
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('deve permitir origem da lista de permitidas', () => {
      const req = { headers: { origin: 'https://novaixfitness.com' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      corsMiddleware(req, res, next);
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('deve rejeitar origem nao permitida', () => {
      const req = { headers: { origin: 'https://evil.com' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      corsMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('deve permitir localhost', () => {
      const req = { headers: { origin: 'http://localhost:3000' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      corsMiddleware(req, res, next);
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('strictCors - origin validation', () => {
    it('deve ser um middleware valido que chama next', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      strictCors(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve rejeitar quando origin nao existe', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      strictCors(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('deve rejeitar origin nao permitida', () => {
      const req = { headers: { origin: 'https://malicious.com' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      strictCors(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('deve permitir origem da lista', () => {
      const req = { headers: { origin: 'https://novaixfitness.com' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      strictCors(req, res, next);
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('publicCors - allows any origin', () => {
    it('deve ser um middleware valido que chama next', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      publicCors(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve permitir qualquer origem', () => {
      const req = { headers: { origin: 'https://any-origin.com' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      publicCors(req, res, next);
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('deve funcionar sem origin', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      publicCors(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
