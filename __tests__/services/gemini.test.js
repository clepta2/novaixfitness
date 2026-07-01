// __tests__/services/gemini.test.js

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.neq = jest.fn(() => chain);
  chain.gt = jest.fn(() => chain);
  chain.lt = jest.fn(() => chain);
  chain.gte = jest.fn(() => chain);
  chain.lte = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.delete = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.limit = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.maybeSingle = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.thenFn = null;
  chain.then = (resolve, reject) => {
    if (chain.thenFn) return chain.thenFn(resolve, reject);
    return Promise.resolve({ data: state.data, error: state.error, count: state.count }).then(resolve, reject);
  };
  chain._setData = (d) => { state.data = d; };
  chain._setError = (e) => { state.error = e; };
  chain._setCount = (c) => { state.count = c; };
  chain._setThenFn = (fn) => { chain.thenFn = fn; };
  chain._reset = () => {
    state.data = null; state.error = null; state.count = null;
    chain.thenFn = null;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.neq.mockReturnValue(chain);
    chain.gt.mockReturnValue(chain);
    chain.lt.mockReturnValue(chain);
    chain.gte.mockReturnValue(chain);
    chain.lte.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.delete.mockReturnValue(chain);
    chain.order.mockReturnValue(chain);
    chain.limit.mockReturnValue(chain);
    chain.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));
    chain.maybeSingle.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  };
  chain._reset();
  return { supabase: Object.assign(chain, {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { access_token: 'mock-token', user: { id: 'test-user-id' } } },
        error: null,
      }),
    },
  }) };
});

jest.mock('../../src/config/app', () => ({
  APP_CONFIG: {
    plans: {
      free: { maxMessages: 0 },
      basic: { maxMessages: 0 },
      intermediate: { maxMessages: 10 },
      premium: { maxMessages: 20 },
      ultra: { maxMessages: 50 },
    },
  },
}));

jest.mock('../../src/config/api', () => ({
  GOOGLE_API_KEY: 'mock-api-key',
}));

jest.mock('../../src/utils/aiSanitize', () => ({
  sanitizeAIOutput: (s) => s,
}));

const { supabase: mockSupabase } = require('../../src/config/supabase');
const { askGeminiCoach, saveChatMessage, getChatHistory, clearChatHistory } = require('../../src/services/gemini');

describe('Gemini Service', () => {
  let originalFetch;

  beforeAll(() => { originalFetch = global.fetch; });
  afterAll(() => { global.fetch = originalFetch; });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase._reset();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ response: 'Resposta do Coach IA' }),
    });
  });

  describe('askGeminiCoach - Plan Limits', () => {
    it('throws LIMIT_EXCEEDED for free plan (limit 0)', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 1, error: null }).then(resolve));

      await expect(
        askGeminiCoach('Olá', { userId: 'user-free', subscriptionPlan: 'free' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });

    it('allows messages under the intermediate limit (limit 10)', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 5, error: null }).then(resolve));

      const reply = await askGeminiCoach('Olá', { userId: 'user-inter', subscriptionPlan: 'intermediate' });
      expect(reply).toBe('Resposta do Coach IA');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('throws LIMIT_EXCEEDED when exceeding intermediate limit (limit 10)', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 11, error: null }).then(resolve));

      await expect(
        askGeminiCoach('Olá', { userId: 'user-inter', subscriptionPlan: 'intermediate' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });

    it('allows messages under the premium limit (limit 20)', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 15, error: null }).then(resolve));

      const reply = await askGeminiCoach('Olá', { userId: 'user-prem', subscriptionPlan: 'premium' });
      expect(reply).toBe('Resposta do Coach IA');
    });

    it('throws LIMIT_EXCEEDED when exceeding premium limit (limit 20)', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 21, error: null }).then(resolve));

      await expect(
        askGeminiCoach('Olá', { userId: 'user-prem', subscriptionPlan: 'premium' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });

    it('allows messages under the ultra limit (limit 50)', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 40, error: null }).then(resolve));

      const reply = await askGeminiCoach('Olá', { userId: 'user-ultra', subscriptionPlan: 'ultra' });
      expect(reply).toBe('Resposta do Coach IA');
    });

    it('throws LIMIT_EXCEEDED when exceeding ultra limit (limit 50)', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 51, error: null }).then(resolve));

      await expect(
        askGeminiCoach('Olá', { userId: 'user-ultra', subscriptionPlan: 'ultra' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });

    it('skips limit check when no userId', async () => {
      const reply = await askGeminiCoach('Olá', {});
      expect(reply).toBe('Resposta do Coach IA');
    });
  });

  describe('askGeminiCoach - API Interaction', () => {
    it('sends correct fetch body with profile context', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 0, error: null }).then(resolve));

      await askGeminiCoach('Qual treino hoje?', { userId: 'u1', subscriptionPlan: 'premium', weight: 80, goal: 'Ganhar massa' });

      expect(global.fetch).toHaveBeenCalled();
      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.message).toBe('Qual treino hoje?');
      expect(body.weight).toBe(80);
      expect(body.goal).toBe('Ganhar massa');
    });

    it('returns error message on fetch failure', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 0, error: null }).then(resolve));
      global.fetch.mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Rate limited' }),
      });

      const reply = await askGeminiCoach('Olá', { userId: 'u1', subscriptionPlan: 'premium' });
      expect(reply).toBe('Erro ao conectar com o assistente. Verifique sua conexão e tente novamente.');
    });

    it('returns error message on network error', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ count: 0, error: null }).then(resolve));
      global.fetch.mockRejectedValue(new Error('Network error'));

      const reply = await askGeminiCoach('Olá', { userId: 'u1', subscriptionPlan: 'premium' });
      expect(reply).toBe('Erro ao conectar com o assistente. Verifique sua conexão e tente novamente.');
    });
  });

  describe('saveChatMessage, getChatHistory, clearChatHistory', () => {
    it('calls saveChatMessage successfully', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ error: null }).then(resolve));
      await saveChatMessage('user-id', 'Mensagem teste', true);
      expect(mockSupabase.from).toHaveBeenCalledWith('coach_chat_messages');
    });

    it('does nothing when userId is empty', async () => {
      await saveChatMessage('', 'Mensagem teste', true);
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('calls getChatHistory successfully', async () => {
      const mockData = [
        { id: 1, message: 'Olá', is_user: true },
        { id: 2, message: 'Oi', is_user: false },
      ];
      mockSupabase._setThenFn((resolve) => Promise.resolve({ data: mockData, error: null }).then(resolve));

      const history = await getChatHistory('user-id');
      expect(history).toHaveLength(2);
      expect(history[0].text).toBe('Olá');
      expect(history[0].isUser).toBe(true);
    });

    it('returns empty array when userId is empty', async () => {
      const history = await getChatHistory('');
      expect(history).toEqual([]);
    });

    it('calls clearChatHistory successfully', async () => {
      mockSupabase._setThenFn((resolve) => Promise.resolve({ error: null }).then(resolve));
      await clearChatHistory('user-id');
      expect(mockSupabase.from).toHaveBeenCalledWith('coach_chat_messages');
    });

    it('does nothing when clearChatHistory with empty userId', async () => {
      await clearChatHistory('');
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });
  });
});
