// __tests__/routes/auth.test.js
// Testes das rotas de autenticação - NOVAIX FITNESS

const request = require('supertest');
const express = require('express');
const { mockUser } = require('../../test-utils/mocks');

jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});
jest.mock('../../src/middleware/rateLimiter', () => ({
  authLimiter: (req, res, next) => next(),
  passwordResetLimiter: (req, res, next) => next(),
}));

const mockSupabase = require('../../src/config/supabase');
const authRoutes = require('../../src/routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('deve retornar 400 sem campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({});

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 sem email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ password: '123456', name: 'Test' });

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 sem password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com', name: 'Test' });

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 sem name', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com', password: '123456' });

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'invalid', password: '123456', name: 'Test' });

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com senha curta', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com', password: '123', name: 'Test' });

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com name curto', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com', password: '123456', name: 'A' });

      expect(res.status).toBe(400);
    });

    it('deve cadastrar usuário com sucesso', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null
      });
      mockSupabase.rpc.mockResolvedValue({ error: null });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com', password: '123456', name: 'Test User' });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@test.com',
          password: '123456'
        })
      );
    });

    it('deve normalizar email para minúsculas', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null
      });
      mockSupabase.rpc.mockResolvedValue({ error: null });

      await request(app)
        .post('/api/auth/signup')
        .send({ email: 'TEST@TEST.COM', password: '123456', name: 'Test' });

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@test.com' })
      );
    });

    it('deve sanitizar nome', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null
      });
      mockSupabase.rpc.mockResolvedValue({ error: null });

      await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com', password: '123456', name: '<b>Test</b>' });

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            data: expect.objectContaining({
              name: expect.not.stringContaining('<')
            })
          })
        })
      );
    });

    it('deve retornar 400 quando Supabase retorna erro', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' }
      });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'existing@test.com', password: '123456', name: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('already registered');
    });

    it('deve chamar create_profile após cadastro', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null
      });
      mockSupabase.rpc.mockResolvedValue({ error: null });

      await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com', password: '123456', name: 'Test User' });

      expect(mockSupabase.rpc).toHaveBeenCalledWith('create_profile', {
        user_id: mockUser.id,
        user_email: 'test@test.com',
        user_name: 'Test User'
      });
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve retornar 400 sem campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 sem email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: '123456' });

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid', password: '123456' });

      expect(res.status).toBe(400);
    });

    it('deve fazer login com sucesso', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token123' } },
        error: null
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.session).toBeDefined();
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '123456'
      });
    });

    it('deve normalizar email para minúsculas', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token123' } },
        error: null
      });

      await request(app)
        .post('/api/auth/login')
        .send({ email: 'TEST@TEST.COM', password: '123456' });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@test.com' })
      );
    });

    it('deve retornar 400 quando credenciais são inválidas', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrongpass' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid login');
    });

    it('deve retornar 400 quando usuário não existe', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'User not found' }
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.com', password: '123456' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('deve retornar 400 sem email', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({});

      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'invalid' });

      expect(res.status).toBe(400);
    });

    it('deve enviar email de recuperação com sucesso', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'test@test.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('recuperação');
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('deve normalizar email para minúsculas', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'TEST@TEST.COM' });

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('deve retornar 400 quando Supabase retorna erro', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'Email not found' }
      });

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'nonexistent@test.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('not found');
    });
  });
});
