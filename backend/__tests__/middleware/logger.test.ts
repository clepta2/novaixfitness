const { requestLogger } = require('../../src/middleware/logger');

describe('Logger Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', originalUrl: '/test', ip: '127.0.0.1', get: jest.fn().mockReturnValue('Mozilla'), user: { id: 'user-123' } };
    res = { statusCode: 200, on: jest.fn() };
    next = jest.fn();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve chamar next', () => {
    requestLogger(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('deve registrar listener de finish', () => {
    requestLogger(req, res, next);
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('deve logar erro para status 400+', () => {
    requestLogger(req, res, next);
    res.statusCode = 500;
    const finishCallback = res.on.mock.calls.find(c => c[0] === 'finish')[1];
    finishCallback();
    expect(console.error).toHaveBeenCalled();
  });

  it('deve logar request em desenvolvimento', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    requestLogger(req, res, next);
    res.statusCode = 200;
    const finishCallback = res.on.mock.calls.find(c => c[0] === 'finish')[1];
    finishCallback();
    
    expect(console.info).toHaveBeenCalled();
    process.env.NODE_ENV = originalEnv;
  });

  it('deve ignorar request em produção para status 200', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    requestLogger(req, res, next);
    res.statusCode = 200;
    const finishCallback = res.on.mock.calls.find(c => c[0] === 'finish')[1];
    finishCallback();
    
    expect(console.log).not.toHaveBeenCalled();
    process.env.NODE_ENV = originalEnv;
  });

  it('deve logar erro mesmo em produção', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    requestLogger(req, res, next);
    res.statusCode = 500;
    const finishCallback = res.on.mock.calls.find(c => c[0] === 'finish')[1];
    finishCallback();
    
    expect(console.error).toHaveBeenCalled();
    process.env.NODE_ENV = originalEnv;
  });
});
