// __tests__/services/gemini.test.js
import { askGeminiCoach, saveChatMessage, getChatHistory, clearChatHistory } from '../../src/services/gemini';
import { supabase } from '../../src/config/supabase';

const mockChain = {
  select: jest.fn(),
  eq: jest.fn(),
  gte: jest.fn(),
  order: jest.fn(),
  limit: jest.fn(),
  delete: jest.fn(),
  insert: jest.fn(),
};

// Configura o retorno padrão para permitir encadeamento
mockChain.select.mockReturnValue(mockChain);
mockChain.eq.mockReturnValue(mockChain);
mockChain.gte.mockReturnValue(mockChain);
mockChain.order.mockReturnValue(mockChain);
mockChain.limit.mockReturnValue(mockChain);
mockChain.delete.mockReturnValue(mockChain);
mockChain.insert.mockReturnValue(mockChain);

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockChain),
  },
}));

describe('Gemini Service', () => {
  let originalFetch;

  beforeAll(() => {
    process.env.EXPO_PUBLIC_GOOGLE_API_KEY = 'mock-api-key';
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Default resolve value
    mockChain.then = (onFulfilled) => Promise.resolve({ data: [], count: 0, error: null }).then(onFulfilled);
    
    // Mock global fetch for Gemini API
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        candidates: [{ content: { parts: [{ text: 'Resposta do Coach IA' }] } }]
      })
    });
  });

  describe('askGeminiCoach - Plan Limits', () => {
    it('throws LIMIT_EXCEEDED for free plan (limit 0)', async () => {
      // Configura para retornar que o usuário já mandou 1 mensagem hoje
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 1, error: null }).then(onFulfilled);

      await expect(
        askGeminiCoach('Olá', { userId: 'user-free', subscriptionPlan: 'free' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });

    it('allows messages under the intermediate limit (limit 10)', async () => {
      // 5 mensagens hoje
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 5, error: null }).then(onFulfilled);

      const reply = await askGeminiCoach('Olá', { userId: 'user-inter', subscriptionPlan: 'intermediate' });
      expect(reply).toBe('Resposta do Coach IA');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('throws LIMIT_EXCEEDED when exceeding intermediate limit (limit 10)', async () => {
      // 11 mensagens hoje
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 11, error: null }).then(onFulfilled);

      await expect(
        askGeminiCoach('Olá', { userId: 'user-inter', subscriptionPlan: 'intermediate' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });

    it('allows messages under the premium limit (limit 20)', async () => {
      // 15 mensagens hoje
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 15, error: null }).then(onFulfilled);

      const reply = await askGeminiCoach('Olá', { userId: 'user-prem', subscriptionPlan: 'premium' });
      expect(reply).toBe('Resposta do Coach IA');
    });

    it('throws LIMIT_EXCEEDED when exceeding premium limit (limit 20)', async () => {
      // 21 mensagens hoje
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 21, error: null }).then(onFulfilled);

      await expect(
        askGeminiCoach('Olá', { userId: 'user-prem', subscriptionPlan: 'premium' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });

    it('allows messages under the ultra limit (limit 50)', async () => {
      // 40 mensagens hoje
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 40, error: null }).then(onFulfilled);

      const reply = await askGeminiCoach('Olá', { userId: 'user-ultra', subscriptionPlan: 'ultra' });
      expect(reply).toBe('Resposta do Coach IA');
    });

    it('throws LIMIT_EXCEEDED when exceeding ultra limit (limit 50)', async () => {
      // 51 mensagens hoje
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 51, error: null }).then(onFulfilled);

      await expect(
        askGeminiCoach('Olá', { userId: 'user-ultra', subscriptionPlan: 'ultra' })
      ).rejects.toThrow('LIMIT_EXCEEDED');
    });
  });

  describe('askGeminiCoach - Context and History Slicing', () => {
    it('slices conversation history to at most 5 messages', async () => {
      mockChain.then = (onFulfilled) => Promise.resolve({ count: 1, error: null }).then(onFulfilled);

      const history = [
        { isUser: true, text: '1' },
        { isUser: false, text: '2' },
        { isUser: true, text: '3' },
        { isUser: false, text: '4' },
        { isUser: true, text: '5' },
        { isUser: false, text: '6' },
        { isUser: true, text: '7' },
      ];

      await askGeminiCoach('Olá', { userId: 'user-prem', subscriptionPlan: 'premium' }, history);

      expect(global.fetch).toHaveBeenCalled();
      const fetchCallArgs = JSON.parse(global.fetch.mock.calls[0][1].body);
      const contents = fetchCallArgs.contents;

      // O payload deve conter o histórico de tamanho 5 + a nova pergunta do usuário = 6 itens
      expect(contents).toHaveLength(6);
      expect(contents[0].parts[0].text).toBe('3');
      expect(contents[4].parts[0].text).toBe('7');
    });
  });

  describe('saveChatMessage, getChatHistory, clearChatHistory', () => {
    it('calls saveChatMessage successfully', async () => {
      mockChain.then = (onFulfilled) => Promise.resolve({ error: null }).then(onFulfilled);
      await saveChatMessage('user-id', 'Mensagem teste', true);
      expect(supabase.from).toHaveBeenCalledWith('coach_chat_messages');
    });

    it('calls getChatHistory successfully', async () => {
      const mockData = [
        { id: 1, message: 'Olá', is_user: true },
        { id: 2, message: 'Oi', is_user: false },
      ];
      mockChain.then = (onFulfilled) => Promise.resolve({ data: mockData, error: null }).then(onFulfilled);

      const history = await getChatHistory('user-id');
      expect(history).toHaveLength(2);
      expect(history[0].text).toBe('Olá');
      expect(history[0].isUser).toBe(true);
    });

    it('calls clearChatHistory successfully', async () => {
      mockChain.then = (onFulfilled) => Promise.resolve({ error: null }).then(onFulfilled);
      await clearChatHistory('user-id');
      expect(supabase.from).toHaveBeenCalledWith('coach_chat_messages');
    });
  });
});
