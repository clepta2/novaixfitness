const { cacheMiddleware, invalidateCache, clearCache, getCacheStats, cache } = require('../../src/middleware/cache');

describe('Cache Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', originalUrl: '/test', headers: {} };
    res = {
      statusCode: 200,
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      on: jest.fn(),
    };
    next = jest.fn();
    clearCache();
    jest.clearAllMocks();
  });

  describe('cacheMiddleware', () => {
    it('deve chamar next para requisições não-GET', () => {
      req.method = 'POST';
      const middleware = cacheMiddleware();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve chamar next quando não há cache', () => {
      const middleware = cacheMiddleware();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar cache quando existe', () => {
      cache.set('__cache__/test', { data: 'cached' }, 300);
      const middleware = cacheMiddleware();
      middleware(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ data: 'cached' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve cachear resposta bem-sucedida', () => {
      const middleware = cacheMiddleware(60);
      middleware(req, res, next);
      res.json({ data: 'new' });
      const cached = cache.get('__cache__/test');
      expect(cached).toEqual({ data: 'new' });
    });

    it('deve ignorar cache para status 400+', () => {
      const middleware = cacheMiddleware();
      middleware(req, res, next);
      res.statusCode = 400;
      res.json({ error: 'bad' });
      const cached = cache.get('__cache__/test');
      expect(cached).toBeUndefined();
    });
  });

  describe('invalidateCache', () => {
    it('deve invalidar chaves que casam com pattern', () => {
      cache.set('__cache__/api/users', { data: 1 });
      cache.set('__cache__/api/posts', { data: 2 });
      const middleware = invalidateCache('users');
      middleware(req, res, next);
      res.send('ok');
      expect(cache.get('__cache__/api/users')).toBeUndefined();
      expect(cache.get('__cache__/api/posts')).toBeDefined();
    });

    it('deve chamar next', () => {
      const middleware = invalidateCache('test');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('clearCache', () => {
    it('deve limpar todo o cache', () => {
      cache.set('key1', 'val1');
      cache.set('key2', 'val2');
      clearCache();
      expect(cache.keys().length).toBe(0);
    });
  });

  describe('getCacheStats', () => {
    it('deve retornar estatísticas', () => {
      cache.set('test', 'value');
      const stats = getCacheStats();
      expect(stats).toHaveProperty('keys');
      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
    });
  });
});
