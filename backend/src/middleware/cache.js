// src/middleware/cache.js
// Middleware de cache para respostas - NOVAIX FITNESS

const NodeCache = require('node-cache');

const cache = new NodeCache({ 
  stdTTL: 60 * 5, 
  checkperiod: 60 * 10, 
  useClones: false 
});

const cacheMiddleware = (ttl = 300) => (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = `__cache__${req.originalUrl}`;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      cache.set(key, body, ttl);
    }
    return originalJson(body);
  };

  next();
};

const invalidateCache = (pattern) => (req, res, next) => {
  const originalSend = res.send.bind(res);
  res.send = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      const keys = cache.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      matchingKeys.forEach(key => cache.del(key));
    }
    return originalSend(body);
  };
  next();
};

const clearCache = () => {
  cache.flushAll();
};

const getCacheStats = () => ({
  keys: cache.keys().length,
  hits: cache.getStats().hits,
  misses: cache.getStats().misses,
  ksize: cache.getStats().ksize,
  vsize: cache.getStats().vsize,
});

module.exports = {
  cacheMiddleware,
  invalidateCache,
  clearCache,
  getCacheStats,
  cache,
};
