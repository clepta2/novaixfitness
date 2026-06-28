jest.mock('../../src/config/supabase', () => ({}));

const { requireRole } = require('../../src/middleware/role');

describe('Role Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { app_metadata: { role: 'user' } } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('deve retornar 401 sem usuário', () => {
    req.user = null;
    const middleware = requireRole(['admin']);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('deve retornar 403 quando role não está na lista', () => {
    const middleware = requireRole(['admin', 'manager']);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('deve chamar next quando role está na lista', () => {
    req.user.app_metadata.role = 'admin';
    const middleware = requireRole(['admin', 'manager']);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.userRole).toBe('admin');
  });

  it('deve usar role padrão "user" quando não definido', () => {
    req.user.app_metadata = {};
    const middleware = requireRole(['user']);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.userRole).toBe('user');
  });
});
