// __tests__/services/reactions.test.js
// Testes do sistema de reações

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  const makeChain = () => {
    chain.from = jest.fn(() => chain);
    chain.select = jest.fn(() => chain);
    chain.eq = jest.fn(() => chain);
    chain.insert = jest.fn(() => chain);
    chain.update = jest.fn(() => chain);
    chain.delete = jest.fn(() => chain);
    chain.upsert = jest.fn(() => chain);
    chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
    chain.maybeSingle = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
    chain.then = function(resolve, reject) {
      return Promise.resolve({ data: state.data, error: state.error }).then(resolve, reject);
    };
    chain.catch = function(fn) {
      return Promise.resolve({ data: state.data, error: state.error }).catch(fn);
    };
  };
  makeChain();
  return {
    supabase: Object.assign(chain, {
      _setData: (d) => { state.data = d; },
      _setError: (e) => { state.error = e; },
      _getState: () => state,
    }),
  };
});

const { supabase } = require('../../src/config/supabase');
const { toggleReaction, getPostReactions, getUserReaction } = require('../../src/services/reactions');

describe('Reactions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    supabase._setData(null);
    supabase._setError(null);
    supabase.from.mockReturnValue(supabase);
    supabase.select.mockReturnValue(supabase);
    supabase.eq.mockReturnValue(supabase);
    supabase.insert.mockReturnValue(supabase);
    supabase.update.mockReturnValue(supabase);
    supabase.delete.mockReturnValue(supabase);
    supabase.upsert.mockReturnValue(supabase);
    supabase.single.mockImplementation(() => Promise.resolve({ data: supabase._getState().data, error: supabase._getState().error }));
  });

  describe('toggleReaction', () => {
    it('should add a new reaction when none exists', async () => {
      supabase._setError({ code: 'PGRST116' });
      supabase.single.mockImplementation(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }));

      const result = await toggleReaction('post-1', 'user-1', 'fire');

      expect(supabase.from).toHaveBeenCalledWith('post_reactions');
      expect(result.action).toBe('added');
      expect(result.type).toBe('fire');
    });

    it('should remove reaction when same type exists', async () => {
      supabase.single.mockImplementation(() => Promise.resolve({ data: { id: 'r1', type: 'fire' }, error: null }));

      const result = await toggleReaction('post-1', 'user-1', 'fire');

      expect(result.action).toBe('removed');
      expect(result.type).toBe('fire');
    });

    it('should change reaction when different type exists', async () => {
      supabase.single.mockImplementation(() => Promise.resolve({ data: { id: 'r1', type: 'heart' }, error: null }));

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

      const result = await getPostReactions('post-1');

      expect(result.reactions).toEqual({ heart: 2, fire: 1 });
    });

    it('should return empty object when no reactions', async () => {
      supabase._setData([]);

      const result = await getPostReactions('post-1');

      expect(result.reactions).toEqual({});
    });
  });

  describe('getUserReaction', () => {
    it('should return user reaction type', async () => {
      supabase.single.mockImplementation(() => Promise.resolve({ data: { type: 'fire' }, error: null }));

      const result = await getUserReaction('post-1', 'user-1');

      expect(result).toBe('fire');
    });

    it('should return null when no reaction', async () => {
      supabase.single.mockImplementation(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }));

      const result = await getUserReaction('post-1', 'user-1');

      expect(result).toBeNull();
    });
  });
});
