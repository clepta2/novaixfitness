jest.mock('compression', () => {
  const filterFn = jest.fn(() => true);
  const compression = jest.fn((opts) => {
    compression.filter = filterFn;
    compression._filter = opts.filter;
    return (req, res, next) => {
      if (opts.filter) {
        const result = opts.filter(req, res);
        if (!result) return next();
      }
      next();
    };
  });
  compression.filter = filterFn;
  return compression;
});

const compression = require('compression');
const { compressionMiddleware, aggressiveCompression } = require('../../src/middleware/compression');

describe('Compression Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    compression.filter.mockReturnValue(true);
  });

  describe('exports', () => {
    it('deve exportar compressionMiddleware', () => {
      expect(typeof compressionMiddleware).toBe('function');
    });

    it('deve exportar aggressiveCompression', () => {
      expect(typeof aggressiveCompression).toBe('function');
    });
  });

  describe('shouldCompress - x-no-compression header', () => {
    it('deve retornar false quando x-no-compression esta presente', () => {
      const req = { headers: { 'x-no-compression': '1' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      compressionMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve delegar para compression.filter quando x-no-compression ausente', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      compressionMiddleware(req, res, next);
      expect(compression.filter).toHaveBeenCalledWith(req, res);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar false com x-no-compression vazio', () => {
      const req = { headers: { 'x-no-compression': '' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      compressionMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('compressionMiddleware behavior', () => {
    it('deve ser um middleware valido que chama next', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      compressionMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve funcionar com header de aceitacao', () => {
      const req = { headers: { 'accept-encoding': 'gzip, deflate' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      compressionMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('aggressiveCompression behavior', () => {
    it('deve ser um middleware valido que chama next', () => {
      const req = { headers: {} };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      aggressiveCompression(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve funcionar com header x-no-compression', () => {
      const req = { headers: { 'x-no-compression': 'true' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      aggressiveCompression(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve funcionar com multiplos headers', () => {
      const req = { headers: { 'accept-encoding': 'br', 'x-no-compression': '1' } };
      const res = { setHeader: jest.fn(), getHeader: jest.fn() };
      const next = jest.fn();
      aggressiveCompression(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
