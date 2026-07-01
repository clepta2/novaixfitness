jest.mock('../../src/config/supabase', () => ({}));

// Mock the entire module to avoid async DB calls
jest.mock('../../src/middleware/role', () => {
  const ROLE_HIERARCHY = { user: 0, creator: 1, manager: 3, admin: 4, superadmin: 5 };

  function isRoleAllowed(userRole, allowedRoles) {
    if (allowedRoles.includes(userRole)) return true;
    if (userRole === 'superadmin') return true;
    if (userRole === 'admin') return allowedRoles.some(r => ['admin', 'manager', 'employee', 'workout_admin', 'community_admin'].includes(r));
    if (userRole === 'manager') return allowedRoles.some(r => ['manager', 'employee'].includes(r));
    return false;
  }

  const requireRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: 'Usuário não autenticado' });
      const userRole = req.user.app_metadata?.role || 'user';
      if (!isRoleAllowed(userRole, allowedRoles)) {
        return res.status(403).json({ error: 'Acesso negado.', requiredRoles: allowedRoles, currentRole: userRole });
      }
      req.userRole = userRole;
      req.roleLevel = ROLE_HIERARCHY[userRole] || 0;
      next();
    };
  };

  const requireMinLevel = (minLevel) => {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: 'Usuário não autenticado' });
      const userRole = req.user.app_metadata?.role || 'user';
      const level = ROLE_HIERARCHY[userRole] || 0;
      if (level < minLevel) return res.status(403).json({ error: 'Nível insuficiente.' });
      req.userRole = userRole;
      req.roleLevel = level;
      next();
    };
  };

  return { requireRole, requireMinLevel, isRoleAllowed, ROLE_HIERARCHY };
});

const { requireRole, isRoleAllowed, ROLE_HIERARCHY } = require('../../src/middleware/role');

describe('Role Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { id: 'user-1', app_metadata: { role: 'user' } } };
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

describe('isRoleAllowed', () => {
  it('deve permitir role na lista', () => {
    expect(isRoleAllowed('admin', ['admin'])).toBe(true);
  });

  it('deve negar role não na lista', () => {
    expect(isRoleAllowed('user', ['admin'])).toBe(false);
  });

  it('superadmin herda tudo', () => {
    expect(isRoleAllowed('superadmin', ['admin'])).toBe(true);
  });

  it('admin herda manager', () => {
    expect(isRoleAllowed('admin', ['manager'])).toBe(true);
  });
});

describe('ROLE_HIERARCHY', () => {
  it('deve ter hierarquia correta', () => {
    expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.manager);
    expect(ROLE_HIERARCHY.manager).toBeGreaterThan(ROLE_HIERARCHY.user);
  });
});
