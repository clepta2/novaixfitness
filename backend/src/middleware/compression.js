// src/middleware/compression.js
// Middleware de compressão de respostas - NOVAIX FITNESS

const compression = require('compression');

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024,
  level: 6,
  memLevel: 8,
});

const aggressiveCompression = compression({
  filter: shouldCompress,
  threshold: 512,
  level: 9,
  memLevel: 9,
});

module.exports = {
  compressionMiddleware,
  aggressiveCompression,
};
