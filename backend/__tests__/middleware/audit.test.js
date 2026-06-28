jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});

const { logAudit, audit, auditAuth, auditProfile } = require('../../src/middleware/audit');
const mockSupabase = require('../../src/config/supabase');

describe('Audit Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { id: 'user-123' }, method: 'POST', path: '/test', ip: '127.0.0.1', body: { data: 'test' }, get: jest.fn().mockReturnValue('Mozilla') };
    res = { statusCode: 200, send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('logAudit', () => {
    it('deve registrar auditoria no Supabase', async () => {
      const chain = { then: jest.fn((resolve) => resolve({ data: null, error: null })) };
      mockSupabase.from.mockReturnValue(chain);
      await logAudit('user-123', 'test_action', { ip: '127.0.0.1' });
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs');
    });

    it('deve tratar erros silenciosamente', async () => {
      mockSupabase.from.mockImplementation(() => { throw new Error('DB Error'); });
      await logAudit('user-123', 'test_action');
    });
  });

  describe('audit middleware', () => {
    it('deve chamar next', () => {
      const middleware = audit('test_action');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve registrar auditoria em res.send bem-sucedido', () => {
      mockSupabase.from.mockReturnValue({ then: jest.fn((resolve) => resolve({})) });
      const middleware = audit('test_action');
      middleware(req, res, next);
      res.send('ok');
      expect(mockSupabase.from).toHaveBeenCalled();
    });

    it('deve ignorar para status 400+', () => {
      const middleware = audit('test_action');
      middleware(req, res, next);
      res.statusCode = 400;
      res.send('error');
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('deve usar anonymous quando não há user', () => {
      req.user = null;
      mockSupabase.from.mockReturnValue({ then: jest.fn((resolve) => resolve({})) });
      const middleware = audit('test_action');
      middleware(req, res, next);
      res.send('ok');
      expect(mockSupabase.from).toHaveBeenCalled();
    });
  });

  describe('auditAuth', () => {
    it('deve ser uma instância de audit', () => {
      expect(typeof auditAuth).toBe('function');
    });
  });

  describe('auditProfile', () => {
    it('deve ser uma instância de audit', () => {
      expect(typeof auditProfile).toBe('function');
    });
  });
});
