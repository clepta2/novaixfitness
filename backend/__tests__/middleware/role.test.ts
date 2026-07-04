// Testes simplificados para o middleware de roles
// Testa apenas a lógica de verificação de permissões

const { isRoleAllowed, ROLE_HIERARCHY } = require('../../src/middleware/role');

describe('Role Middleware - isRoleAllowed', () => {
  it('deve permitir role exata', () => {
    expect(isRoleAllowed('admin', ['admin'])).toBe(true);
  });

  it('deve negar role não listada', () => {
    expect(isRoleAllowed('user', ['admin'])).toBe(false);
  });

  it('deve permitir superadmin sempre', () => {
    expect(isRoleAllowed('superadmin', ['admin'])).toBe(true);
    expect(isRoleAllowed('superadmin', ['user'])).toBe(true);
  });

  it('deve permitir herança de admin', () => {
    expect(isRoleAllowed('admin', ['manager'])).toBe(true);
    expect(isRoleAllowed('admin', ['employee'])).toBe(true);
  });

  it('deve permitir herança de manager', () => {
    expect(isRoleAllowed('manager', ['employee'])).toBe(true);
  });

  it('deve negar herança de user', () => {
    expect(isRoleAllowed('user', ['admin'])).toBe(false);
  });
});

describe('Role Hierarchy', () => {
  it('tem hierarquia correta', () => {
    expect(ROLE_HIERARCHY.user).toBe(0);
    expect(ROLE_HIERARCHY.admin).toBe(4);
    expect(ROLE_HIERARCHY.superadmin).toBe(5);
  });
});
