import { exportUserData, deleteAccount, getConsentSettings, updateConsentSettings, requestDataDeletion } from '../../src/services/lgpd';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      admin: { deleteUser: jest.fn() },
      signOut: jest.fn(),
    },
  },
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock/',
  writeAsStringAsync: jest.fn(),
  EncodingType: { UTF8: 'utf8' },
}));

const mockChain = (data = null, error = null) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
    maybeSingle: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LGPD Service', () => {
  describe('exportUserData', () => {
    it('throws for null userId', async () => {
      await expect(exportUserData(null)).rejects.toThrow('Usuário não autenticado');
    });

    it('exports user data as JSON string', async () => {
      const profileData = { name: 'Test', email: 'test@test.com' };
      const emptyData = [];

      supabase.from
        .mockReturnValueOnce(mockChain(profileData))
        .mockReturnValueOnce(mockChain(emptyData))
        .mockReturnValueOnce(mockChain(emptyData))
        .mockReturnValueOnce(mockChain(emptyData))
        .mockReturnValueOnce(mockChain(emptyData))
        .mockReturnValueOnce(mockChain(emptyData))
        .mockReturnValueOnce(mockChain(null));

      const result = await exportUserData('user-1');
      const parsed = JSON.parse(result);
      expect(parsed.app).toBe('NOVAIX FITNESS');
      expect(parsed.profile.name).toBe('Test');
      expect(parsed).toHaveProperty('exportDate');
      expect(parsed).toHaveProperty('workouts');
      expect(parsed).toHaveProperty('favorites');
      expect(parsed).toHaveProperty('posts');
      expect(parsed).toHaveProperty('payments');
    });
  });

  describe('deleteAccount', () => {
    it('throws for null userId', async () => {
      await expect(deleteAccount(null)).rejects.toThrow('Usuário não autenticado');
    });

    it('deletes data from all tables and signs out', async () => {
      supabase.from.mockReturnValue(mockChain());
      supabase.auth.admin.deleteUser.mockResolvedValue({ error: null });
      supabase.auth.signOut.mockResolvedValue({ error: null });

      const result = await deleteAccount('user-1');
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledTimes(11);
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('getConsentSettings', () => {
    it('returns null for null userId', async () => {
      const result = await getConsentSettings(null);
      expect(result).toBeNull();
    });

    it('returns consent settings with defaults', async () => {
      supabase.from.mockReturnValue(mockChain(null));
      const result = await getConsentSettings('user-1');
      expect(result).toHaveProperty('marketing', false);
      expect(result).toHaveProperty('analytics', false);
      expect(result).toHaveProperty('thirdParty', false);
    });

    it('returns actual consent values from database', async () => {
      supabase.from.mockReturnValue(mockChain({
        consent_marketing: false,
        consent_analytics: true,
        consent_third_party: true,
        consent_updated_at: '2024-01-01',
      }));
      const result = await getConsentSettings('user-1');
      expect(result.marketing).toBe(false);
      expect(result.analytics).toBe(true);
      expect(result.thirdParty).toBe(true);
    });
  });

  describe('updateConsentSettings', () => {
    it('throws for null userId', async () => {
      await expect(updateConsentSettings(null, {})).rejects.toThrow('Usuário não autenticado');
    });

    it('updates consent settings', async () => {
      supabase.from.mockReturnValue(mockChain());
      const result = await updateConsentSettings('user-1', {
        marketing: false,
        analytics: true,
        thirdParty: false,
      });
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('requestDataDeletion', () => {
    it('throws for null userId', async () => {
      await expect(requestDataDeletion(null)).rejects.toThrow('Usuário não autenticado');
    });

    it('creates deletion request', async () => {
      supabase.from.mockReturnValue(mockChain());
      const result = await requestDataDeletion('user-1');
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('data_deletion_requests');
    });
  });
});
