// __tests__/services/chat.test.js

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.limit = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.gt = jest.fn(() => chain);
  chain.neq = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.then = (resolve) => Promise.resolve({ data: state.data, error: state.error }).then(resolve);
  chain._setData = (d) => { state.data = d; };
  chain._setError = (e) => { state.error = e; };
  chain._reset = () => {
    state.data = null; state.error = null;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.order.mockReturnValue(chain);
    chain.limit.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.gt.mockReturnValue(chain);
    chain.neq.mockReturnValue(chain);
    chain.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  };
  chain._reset();
  return { supabase: chain };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
const { sendMessage, getMessages, markAsRead } = require('../../src/services/chat');

describe('Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase._reset();
  });

  describe('sendMessage', () => {
    it('should send a text message', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({
        data: { id: 'msg-1', content: 'Hello!', type: 'text', user_id: 'user-1' }, error: null
      }));

      const result = await sendMessage('conv-1', 'user-1', 'Hello!');

      expect(mockSupabase.from).toHaveBeenCalledWith('messages');
      expect(result.content).toBe('Hello!');
    });

    it('should send a workout_share message', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({
        data: { id: 'msg-2', content: 'Check my workout!', type: 'workout_share' }, error: null
      }));

      const result = await sendMessage('conv-1', 'user-1', 'Check my workout!', 'workout_share');

      expect(result.type).toBe('workout_share');
    });
  });

  describe('getMessages', () => {
    it('should return messages for a conversation', async () => {
      mockSupabase._setData([
        { id: 'm1', content: 'Hi' },
        { id: 'm2', content: 'Hello' },
      ]);

      const result = await getMessages('conv-1');

      expect(result).toHaveLength(2);
      expect(mockSupabase.from).toHaveBeenCalledWith('messages');
    });
  });

  describe('markAsRead', () => {
    it('should update last_read_at', async () => {
      await markAsRead('conv-1', 'user-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('conversation_members');
      expect(mockSupabase.update).toHaveBeenCalled();
    });
  });
});
