// __mocks__/supabase.js
// Mock global do Supabase — resposta dinâmica baseada em state compartilhado

const mockState = { data: null, error: null };

const createChain = () => {
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.delete = jest.fn(() => chain);
  chain.upsert = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.neq = jest.fn(() => chain);
  chain.gt = jest.fn(() => chain);
  chain.lt = jest.fn(() => chain);
  chain.gte = jest.fn(() => chain);
  chain.lte = jest.fn(() => chain);
  chain.like = jest.fn(() => chain);
  chain.ilike = jest.fn(() => chain);
  chain.in = jest.fn(() => chain);
  chain.is = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.limit = jest.fn(() => chain);
  chain.range = jest.fn(() => chain);
  chain.count = jest.fn(() => chain);
  chain.head = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: mockState.data, error: mockState.error }));
  chain.maybeSingle = jest.fn(() => Promise.resolve({ data: mockState.data, error: mockState.error }));
  chain.then = (resolve, reject) =>
    Promise.resolve({ data: mockState.data, error: mockState.error }).then(resolve, reject);
  chain.catch = (fn) =>
    Promise.resolve({ data: mockState.data, error: mockState.error }).catch(fn);
  return chain;
};

const chain = createChain();

const mockSupabase = {
  from: chain.from,
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
  channel: jest.fn().mockReturnValue({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
  }),
  _setData: (d) => { mockState.data = d; },
  _setError: (e) => { mockState.error = e; },
  _getState: () => mockState,
  _reset: () => {
    mockState.data = null;
    mockState.error = null;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.delete.mockReturnValue(chain);
    chain.upsert.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.neq.mockReturnValue(chain);
    chain.gt.mockReturnValue(chain);
    chain.lt.mockReturnValue(chain);
    chain.gte.mockReturnValue(chain);
    chain.lte.mockReturnValue(chain);
    chain.like.mockReturnValue(chain);
    chain.ilike.mockReturnValue(chain);
    chain.in.mockReturnValue(chain);
    chain.is.mockReturnValue(chain);
    chain.order.mockReturnValue(chain);
    chain.limit.mockReturnValue(chain);
    chain.range.mockReturnValue(chain);
    chain.count.mockReturnValue(chain);
    chain.head.mockReturnValue(chain);
    chain.single.mockImplementation(() => Promise.resolve({ data: mockState.data, error: mockState.error }));
    chain.maybeSingle.mockImplementation(() => Promise.resolve({ data: mockState.data, error: mockState.error }));
  },
};

module.exports = { supabase: mockSupabase, createMockQuery: () => chain, createMockSupabase: () => mockSupabase };
