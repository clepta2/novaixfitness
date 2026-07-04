// __tests__/services/reactions.test.ts
// Mock: each terminal method (single/maybeSingle) returns its own promise
// The chain .then is only used when NO terminal method is called

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};

  const resetChain = () => {
    chain.from = jest.fn(() => chain);
    chain.select = jest.fn(() => chain);
    chain.eq = jest.fn(() => chain);
    chain.insert = jest.fn(() => chain);
    chain.update = jest.fn(() => chain);
    chain.delete = jest.fn(() => chain);
    chain.upsert = jest.fn(() => chain);
    chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
    chain.maybeSingle = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
    chain.or = jest.fn(() => chain);
    chain.gt = jest.fn(() => chain);
    chain.gte = jest.fn(() => chain);
    chain.lt = jest.fn(() => chain);
    chain.lte = jest.fn(() => chain);
    chain.limit = jest.fn(() => chain);
    chain.order = jest.fn(() => chain);
    chain.range = jest.fn(() => chain);
    // .then makes the chain thenable — resolves to {data, error} for chains
    // that end without single/maybeSingle (like .eq(...).delete() which returns void)
    chain.then = undefined;
  };

  resetChain();

  return {
    supabase: Object.defineProperties(chain, {
      _setData: { value: (d) => { state.data = d; } },
      _setError: { value: (e) => { state.error = e; } },
      _getState: { value: () => state },
      _reset: { value: () => { state.data = null; state.error = null; resetChain(); } },
    }),
  };
});

const { supabase } = require('../../src/config/supabase');
const { toggleReaction, getPostReactions, getUserReaction } = require('../../src/services/reactions');

describe('Reactions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    supabase._reset();
  });

  describe('toggleReaction', () => {
    it('should add a new reaction when none exists', async () => {
      supabase.maybeSingle.mockImplementation(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }));
      const result = await toggleReaction('post-1', 'user-1', 'fire');
      expect(result.action).toBe('added');
      expect(result.type).toBe('fire');
    });

    it('should remove reaction when same type exists', async () => {
      supabase.maybeSingle.mockImplementation(() => Promise.resolve({ data: { id: 'r1', type: 'fire' }, error: null }));
      const result = await toggleReaction('post-1', 'user-1', 'fire');
      expect(result.action).toBe('removed');
      expect(result.type).toBe('fire');
    });

    it('should change reaction when different type exists', async () => {
      supabase.maybeSingle.mockImplementation(() => Promise.resolve({ data: { id: 'r1', type: 'heart' }, error: null }));
      const result = await toggleReaction('post-1', 'user-1', 'fire');
      expect(result.action).toBe('changed');
      expect(result.type).toBe('fire');
    });
  });

  describe('getPostReactions', () => {
    it('should return reaction counts grouped by type', async () => {
      supabase._setData([
        { type: 'heart', user_id: 'u1' },
        { type: 'heart', user_id: 'u2' },
        { type: 'fire', user_id: 'u3' },
      ]);
      // getPostReactions ends with .eq() — no terminal method, so chain resolves
      // We need chain.then for this case
      chainThenResolver();
      const result = await getPostReactions('post-1');
      expect(result.reactions).toEqual({ heart: 2, fire: 1 });
    });

    it('should return empty object when no reactions', async () => {
      supabase._setData([]);
      chainThenResolver();
      const result = await getPostReactions('post-1');
      expect(result.reactions).toEqual({});
    });
  });

  describe('getUserReaction', () => {
    it('should return user reaction type', async () => {
      supabase.maybeSingle.mockImplementation(() => Promise.resolve({ data: { type: 'fire' }, error: null }));
      const result = await getUserReaction('post-1', 'user-1');
      expect(result).toBe('fire');
    });

    it('should return null when no reaction', async () => {
      supabase.maybeSingle.mockImplementation(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }));
      const result = await getUserReaction('post-1', 'user-1');
      expect(result).toBeNull();
    });
  });
});

// getPostReactions ends with .eq() — chain needs .then to be thenable
function chainThenResolver() {
  const { supabase: s } = require('../../src/config/supabase');
  s.then = (resolve) => Promise.resolve({ data: s._getState().data, error: s._getState().error }).then(resolve);
}
