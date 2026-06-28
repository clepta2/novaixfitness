const { timeout, apiTimeout, longTimeout, shortTimeout } = require('../../src/middleware/timeout');

describe('Timeout Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      on: jest.fn(),
    };
    next = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve chamar next', () => {
    apiTimeout(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('deve registrar listeners de finish e close', () => {
    apiTimeout(req, res, next);
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(res.on).toHaveBeenCalledWith('close', expect.any(Function));
  });

  it('deve retornar 408 quando timeout expira', () => {
    apiTimeout(req, res, next);
    jest.advanceTimersByTime(30000);
    expect(res.status).toHaveBeenCalledWith(408);
    expect(res.json).toHaveBeenCalledWith({ error: 'Requisição expirou. Tente novamente.' });
  });

  it('deve ignorar se headers já enviados', () => {
    apiTimeout(req, res, next);
    res.headersSent = true;
    jest.advanceTimersByTime(30000);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('longTimeout deve ter 60s', () => {
    longTimeout(req, res, next);
    jest.advanceTimersByTime(59999);
    expect(res.status).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(res.status).toHaveBeenCalledWith(408);
  });

  it('shortTimeout deve ter 10s', () => {
    shortTimeout(req, res, next);
    jest.advanceTimersByTime(9999);
    expect(res.status).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(res.status).toHaveBeenCalledWith(408);
  });
});
