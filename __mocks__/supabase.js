const createMockQuery = (returnData = null, shouldError = false) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(
      shouldError ? { data: null, error: { message: 'Mock error' } } : { data: returnData, error: null }
    ),
    then: jest.fn().mockImplementation((resolve) =>
      resolve(
        shouldError ? { data: null, error: { message: 'Mock error' } } : { data: returnData, error: null }
      )
    ),
  };
  return chain;
};

const mockSupabase = {
  from: jest.fn().mockReturnValue(createMockQuery()),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@test.com' } }, error: null }),
    getSession: jest.fn().mockResolvedValue({
      data: { session: { access_token: 'mock-token', user: { id: 'test-user-id', email: 'test@test.com' } } },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' }, session: {} }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' }, session: {} }, error: null }),
    signInWithOAuth: jest.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
  },
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
};

module.exports = { supabase: mockSupabase, createMockQuery };
