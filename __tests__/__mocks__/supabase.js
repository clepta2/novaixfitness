// __tests__/__mocks__/supabase.js
// Mock centralizado do Supabase para todos os testes

const createMockChain = (defaultData = null, defaultError = null) => {
  const chain = {};

  chain.select = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.delete = jest.fn(() => chain);
  chain.upsert = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.neq = jest.fn(() => chain);
  chain.gt = jest.fn(() => chain);
  chain.gte = jest.fn(() => chain);
  chain.lt = jest.fn(() => chain);
  chain.lte = jest.fn(() => chain);
  chain.like = jest.fn(() => chain);
  chain.ilike = jest.fn(() => chain);
  chain.in = jest.fn(() => chain);
  chain.is = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.limit = jest.fn(() => chain);
  chain.range = jest.fn(() => chain);
  chain.filter = jest.fn(() => chain);

  chain.single = jest.fn().mockResolvedValue({ data: defaultData, error: defaultError });
  chain.maybeSingle = jest.fn().mockResolvedValue({ data: defaultData, error: defaultError });
  chain.then = jest.fn((resolve) => resolve({ data: defaultData, error: defaultError }));

  return chain;
};

const createMockSupabase = (defaultData = null, defaultError = null) => {
  const chain = createMockChain(defaultData, defaultError);

  return {
    from: jest.fn(() => chain),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user', email: 'test@test.com' } }, error: null }),
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
      admin: { deleteUser: jest.fn().mockResolvedValue({ error: null }) },
    },
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    })),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  };
};

const mockSupabase = createMockSupabase();

describe('Supabase Mock', () => {
  it('is defined', () => {
    expect(mockSupabase).toBeDefined();
  });
});

module.exports = { supabase: mockSupabase, createMockChain, createMockSupabase };
