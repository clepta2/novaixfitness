const {
  blockBlacklistedIP,
  whitelistOnly,
  addToBlacklist,
  removeFromBlacklist,
  addToWhitelist,
  removeFromWhitelist,
  sanitizeInput,
  detectSQLInjection,
} = require('../../src/middleware/security');

describe('Security Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { ip: '192.168.1.1', body: {}, query: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe('blockBlacklistedIP', () => {
    it('deve bloquear IP na blacklist', () => {
      addToBlacklist('192.168.1.1');
      blockBlacklistedIP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      removeFromBlacklist('192.168.1.1');
    });

    it('deve permitir IP não listado', () => {
      blockBlacklistedIP(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('whitelistOnly', () => {
    it('deve bloquear IP não na whitelist', () => {
      req.ip = '10.0.0.1';
      whitelistOnly(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve permitir localhost', () => {
      req.ip = '127.0.0.1';
      whitelistOnly(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('sanitizeInput', () => {
    it('deve remover scripts do body', () => {
      req.body = { name: '<script>alert(1)</script>Test' };
      sanitizeInput(req, res, next);
      expect(req.body.name).not.toContain('<script>');
      expect(next).toHaveBeenCalled();
    });

    it('deve remover javascript:', () => {
      req.body = { url: 'javascript:alert(1)' };
      sanitizeInput(req, res, next);
      expect(req.body.url).not.toContain('javascript:');
    });

    it('deve remover on* handlers', () => {
      req.body = { div: 'onclick=alert(1)' };
      sanitizeInput(req, res, next);
      expect(req.body.div).not.toContain('onclick=');
    });

    it('deve sanitizar query e params', () => {
      req.query = { q: '<script>alert(1)</script>' };
      req.params = { id: '<script>x</script>' };
      sanitizeInput(req, res, next);
      expect(req.query.q).not.toContain('<script>');
      expect(req.params.id).not.toContain('<script>');
    });

    it('deve preservar objetos aninhados', () => {
      req.body = { nested: { value: '<script>ok</script>' } };
      sanitizeInput(req, res, next);
      expect(req.body.nested.value).not.toContain('<script>');
    });
  });

  describe('detectSQLInjection', () => {
    it('deve detectar SELECT', () => {
      req.body = { query: 'SELECT * FROM users' };
      detectSQLInjection(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve detectar UNION', () => {
      req.body = { search: '1 UNION SELECT password' };
      detectSQLInjection(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve detectar OR 1=1', () => {
      req.query = { id: "1' OR 1=1--" };
      detectSQLInjection(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve detectar DROP', () => {
      req.body = { table: 'DROP TABLE users' };
      detectSQLInjection(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve chamar next para entradas limpas', () => {
      req.body = { name: 'João', age: 25 };
      detectSQLInjection(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
