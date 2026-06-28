jest.mock('compression', () => {
  const compression = jest.fn(() => (req, res, next) => next());
  compression.filter = jest.fn(() => true);
  return compression;
});

const { compressionMiddleware, aggressiveCompression } = require('../../src/middleware/compression');

describe('Compression Middleware', () => {
  it('deve exportar compressionMiddleware', () => {
    expect(typeof compressionMiddleware).toBe('function');
  });

  it('deve exportar aggressiveCompression', () => {
    expect(typeof aggressiveCompression).toBe('function');
  });

  it('compressionMiddleware deve ser um middleware válido', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn(), getHeader: jest.fn() };
    const next = jest.fn();
    compressionMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('aggressiveCompression deve ser um middleware válido', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn(), getHeader: jest.fn() };
    const next = jest.fn();
    aggressiveCompression(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
