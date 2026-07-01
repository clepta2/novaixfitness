// __tests__/services/moderation.test.js

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.upsert = jest.fn(() => chain);
  chain.delete = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.then = (resolve, reject) =>
    Promise.resolve({ data: state.data, error: state.error }).then(resolve, reject);
  chain._setData = (d) => { state.data = d; };
  chain._setError = (e) => { state.error = e; };
  chain._reset = () => {
    state.data = null; state.error = null;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.upsert.mockReturnValue(chain);
    chain.delete.mockReturnValue(chain);
    chain.single.mockImplementation(() =>
      Promise.resolve({ data: null, error: null }));
  };
  chain._reset();
  return { supabase: chain };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
const { reportContent, blockUser, unblockUser, getBlockedUsers, isBlockedBy } = require('../../src/services/moderation');

describe('Moderation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase._reset();
  });

  describe('reportContent', () => {
    it('should insert a report', async () => {
      const result = await reportContent('reporter-1', {
        reason: 'spam', details: 'Post is spam',
        targetUser: { id: 'user-1' }, targetPost: { id: 'post-1' },
      });
      expect(mockSupabase.from).toHaveBeenCalledWith('reports');
      expect(mockSupabase.insert).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw on error', async () => {
      mockSupabase.insert.mockImplementation(() => {
        const err = new Error('Insert failed');
        return Promise.reject(err);
      });
      await expect(
        reportContent('reporter-1', { reason: 'spam' })
      ).rejects.toThrow();
    });
  });

  describe('blockUser', () => {
    it('should upsert a block', async () => {
      const result = await blockUser('user-1', 'user-2');
      expect(mockSupabase.from).toHaveBeenCalledWith('blocked_users');
      expect(result).toBe(true);
    });
  });

  describe('unblockUser', () => {
    it('should delete a block', async () => {
      const result = await unblockUser('user-1', 'user-2');
      expect(mockSupabase.from).toHaveBeenCalledWith('blocked_users');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('getBlockedUsers', () => {
    it('should return list of blocked user IDs', async () => {
      mockSupabase._setData([{ blocked_id: 'user-2' }, { blocked_id: 'user-3' }]);
      const result = await getBlockedUsers('user-1');
      expect(result).toEqual(['user-2', 'user-3']);
    });

    it('should return empty array when no blocks', async () => {
      mockSupabase._setData([]);
      const result = await getBlockedUsers('user-1');
      expect(result).toEqual([]);
    });
  });

  describe('isBlockedBy', () => {
    it('should return true if blocked', async () => {
      mockSupabase.single.mockImplementation(() =>
        Promise.resolve({ data: { id: 'some-id' }, error: null }));
      const result = await isBlockedBy('user-1', 'user-2');
      expect(result).toBe(true);
    });

    it('should return false if not blocked', async () => {
      mockSupabase.single.mockImplementation(() =>
        Promise.resolve({ data: null, error: { code: 'PGRST116' } }));
      const result = await isBlockedBy('user-1', 'user-2');
      expect(result).toBe(false);
    });
  });
});
