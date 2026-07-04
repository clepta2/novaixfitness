const {
  defaultLimiter,
  authLimiter,
  passwordResetLimiter,
  contentCreationLimiter,
  uploadLimiter,
  paymentLimiter,
  publicApiLimiter,
  webhookLimiter,
} = require('../../src/middleware/rateLimiter');

describe('Rate Limiter Middleware', () => {
  it('deve exportar todos os limiters', () => {
    expect(typeof defaultLimiter).toBe('function');
    expect(typeof authLimiter).toBe('function');
    expect(typeof passwordResetLimiter).toBe('function');
    expect(typeof contentCreationLimiter).toBe('function');
    expect(typeof uploadLimiter).toBe('function');
    expect(typeof paymentLimiter).toBe('function');
    expect(typeof publicApiLimiter).toBe('function');
    expect(typeof webhookLimiter).toBe('function');
  });

  it('deve ter 8 limiters exportados', () => {
    const limiters = require('../../src/middleware/rateLimiter');
    expect(Object.keys(limiters)).toHaveLength(8);
  });
});
