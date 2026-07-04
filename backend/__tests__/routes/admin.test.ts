const request = require('supertest');
const express = require('express');
const { mockUser, mockProfile, createChainable } = require('../../test-utils/mocks');

jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});

jest.mock('../../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'No token' });
    req.user = { id: 'user-123', email: 'test@test.com', app_metadata: { role: req.headers['x-user-role'] || 'admin' } };
    next();
  }
}));

jest.mock('../../src/middleware/role', () => ({
  requireRole: (roles) => (req, res, next) => {
    const userRole = req.user?.app_metadata?.role || 'user';
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    req.userRole = userRole;
    next();
  }
}));

const mockSupabase = require('../../src/config/supabase');
const adminRoutes = require('../../src/routes/admin');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

describe('Admin Routes', () => {
  beforeEach(() => jest.clearAllMocks());
  jest.setTimeout(60000);

  describe('POST /users', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/admin/users').send({ email: 'a@b.com', password: '123456', name: 'Test' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 para role user', async () => {
      const res = await request(app).post('/api/admin/users').set('Authorization', 'Bearer token').set('x-user-role', 'user').send({ email: 'a@b.com', password: '123456', name: 'Test' });
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 sem campos obrigatórios', async () => {
      const res = await request(app).post('/api/admin/users').set('Authorization', 'Bearer token').send({ name: 'Test' });
      expect(res.status).toBe(400);
    });

    it('deve criar usuário com sucesso', async () => {
      mockSupabase.auth.admin.createUser.mockResolvedValue({ data: { user: { id: 'new-user' } }, error: null });
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      chain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/admin/users').set('Authorization', 'Bearer token').send({ email: 'new@test.com', password: '123456', name: 'New User' });
      expect(res.status).toBe(201);
      expect(res.body.message).toContain('sucesso');
    });

    it('deve retornar 400 quando createUser falha', async () => {
      mockSupabase.auth.admin.createUser.mockResolvedValue({ data: null, error: { message: 'Email already exists' } });
      const res = await request(app).post('/api/admin/users').set('Authorization', 'Bearer token').send({ email: 'existing@test.com', password: '123456', name: 'Test' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 403 quando manager tenta criar admin', async () => {
      const res = await request(app).post('/api/admin/users').set('Authorization', 'Bearer token').set('x-user-role', 'manager').send({ email: 'a@b.com', password: '123456', name: 'Test', role: 'admin' });
      expect(res.status).toBe(403);
    });

    it('deve retornar 403 quando employee tenta criar non-user', async () => {
      const res = await request(app).post('/api/admin/users').set('Authorization', 'Bearer token').set('x-user-role', 'employee').send({ email: 'a@b.com', password: '123456', name: 'Test', role: 'manager' });
      expect(res.status).toBe(403);
    });
  });

  describe('PUT /users/:id', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).put('/api/admin/users/user-123').send({ name: 'New' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 para role user', async () => {
      const res = await request(app).put('/api/admin/users/user-123').set('Authorization', 'Bearer token').set('x-user-role', 'user').send({ name: 'New' });
      expect(res.status).toBe(403);
    });

    it('deve retornar 404 quando usuário não existe', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/admin/users/nonexistent').set('Authorization', 'Bearer token').send({ name: 'Test' });
      expect(res.status).toBe(404);
    });

    it('deve atualizar usuário com sucesso', async () => {
      const targetChain = createChainable();
      targetChain.single.mockResolvedValue({ data: { role: 'user' }, error: null });
      const updateChain = createChainable();
      updateChain.single.mockResolvedValue({ data: { ...mockProfile, name: 'Updated' }, error: null });
      updateChain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValueOnce(targetChain).mockReturnValueOnce(updateChain);
      mockSupabase.auth.admin.updateUserById.mockResolvedValue({ error: null });
      const res = await request(app).put('/api/admin/users/user-456').set('Authorization', 'Bearer token').send({ name: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('sucesso');
    });

    it('deve retornar 403 quando manager tenta modificar admin', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { role: 'admin' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/admin/users/user-456').set('Authorization', 'Bearer token').set('x-user-role', 'manager').send({ name: 'Test' });
      expect(res.status).toBe(403);
    });

    it('deve retornar 403 quando manager tenta promover a admin', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { role: 'user' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/admin/users/user-456').set('Authorization', 'Bearer token').set('x-user-role', 'manager').send({ role: 'admin' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).delete('/api/admin/users/user-123');
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 para role manager', async () => {
      const res = await request(app).delete('/api/admin/users/user-123').set('Authorization', 'Bearer token').set('x-user-role', 'manager');
      expect(res.status).toBe(403);
    });

    it('deve deletar usuário com sucesso', async () => {
      mockSupabase.auth.admin.deleteUser.mockResolvedValue({ error: null });
      const res = await request(app).delete('/api/admin/users/user-456').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('sucesso');
      expect(mockSupabase.auth.admin.deleteUser).toHaveBeenCalledWith('user-456');
    });

    it('deve retornar 400 quando deleteUser falha', async () => {
      mockSupabase.auth.admin.deleteUser.mockResolvedValue({ error: { message: 'User not found' } });
      const res = await request(app).delete('/api/admin/users/nonexistent').set('Authorization', 'Bearer token');
      expect(res.status).toBe(400);
    });
  });
});
