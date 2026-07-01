jest.mock('../../src/config/supabase', () => {
  const makeChain = (resolveWith) => {
    const chain = {
      select: jest.fn(() => chain),
      eq: jest.fn(() => chain),
      single: jest.fn(() => Promise.resolve(resolveWith)),
      upsert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => chain),
      rpc: jest.fn().mockResolvedValue(1),
    };
    return chain;
  };

  const mockFrom = jest.fn(() => makeChain({ data: null, error: null }));
  return { supabase: { from: mockFrom, rpc: jest.fn().mockResolvedValue(1), __mocks: { mockFrom, makeChain } } };
});

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue({}),
}));

import {
  generateReferralCode,
  getReferralData,
  trackReferral,
  shareReferral,
  validateReferralCode,
  applyReferralBonus,
} from '../../src/services/referral';

const { supabase } = require('../../src/config/supabase');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Referral Service', () => {
  describe('generateReferralCode', () => {
    it('returns null for falsy userId', () => {
      expect(generateReferralCode(null)).toBeNull();
      expect(generateReferralCode(undefined)).toBeNull();
      expect(generateReferralCode('')).toBeNull();
    });

    it('generates code with NOVAIX prefix + first 8 chars uppercase', () => {
      expect(generateReferralCode('abc12345xyz')).toBe('NOVAIXABC12345');
    });

    it('handles short userId', () => {
      expect(generateReferralCode('abc')).toBe('NOVAIXABC');
    });
  });

  describe('getReferralData', () => {
    it('returns default data for no userId', async () => {
      const result = await getReferralData(null);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('referral_code');
    });

    it('returns default data when no record exists', async () => {
      const result = await getReferralData('u1');
      expect(result.referral_code).toBe('NOVAIXU1');
      expect(result.total_referrals).toBe(0);
      expect(result.successful_referrals).toBe(0);
      expect(result.bonus_days).toBe(0);
    });

    it('returns existing referral data', async () => {
      const existing = { referral_code: 'NOVAIXU1', total_referrals: 5, successful_referrals: 3, bonus_days: 90 };
      supabase.from.mockReturnValue({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: existing, error: null }) });

      const result = await getReferralData('u1');
      expect(result.total_referrals).toBe(5);
    });

    it('returns default on error', async () => {
      supabase.from.mockReturnValue({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }) });

      const result = await getReferralData('u1');
      expect(result.total_referrals).toBe(0);
    });
  });

  describe('trackReferral', () => {
    it('does nothing when no referrerId', async () => {
      await trackReferral(null);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('calls upsert with correct data', async () => {
      const upsertMock = jest.fn().mockResolvedValue({ error: null });
      supabase.from.mockReturnValue({ upsert: upsertMock });

      await trackReferral('u1');
      expect(supabase.from).toHaveBeenCalledWith('referrals');
      expect(upsertMock).toHaveBeenCalled();
    });
  });

  describe('shareReferral', () => {
    it('generates message with code and shares', async () => {
      const Sharing = require('expo-sharing');
      await shareReferral('u1');

      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalled();
      const msg = Sharing.shareAsync.mock.calls[0][0];
      expect(msg).toContain('NOVAIXU1');
      expect(msg).toContain('7 dias grátis');
    });

    it('calls trackReferral after sharing', async () => {
      await shareReferral('u1');
      expect(supabase.from).toHaveBeenCalledWith('referrals');
    });
  });

  describe('validateReferralCode', () => {
    it('returns null for short code', async () => {
      expect(await validateReferralCode('ABC')).toBeNull();
    });

    it('returns null for null code', async () => {
      expect(await validateReferralCode(null)).toBeNull();
    });

    it('returns referrer_id when valid', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { referrer_id: 'owner1' }, error: null }),
      });

      const result = await validateReferralCode('NOVAIXU1');
      expect(result).toBe('owner1');
    });

    it('returns null when code not found', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      });

      expect(await validateReferralCode('NOVAIXXXXXXXXX')).toBeNull();
    });
  });

  describe('applyReferralBonus', () => {
    it('returns false for missing params', async () => {
      expect(await applyReferralBonus(null, 'r1')).toBe(false);
      expect(await applyReferralBonus('u1', null)).toBe(false);
    });

    it('updates profiles for both users and referrals', async () => {
      let callCount = 0;
      supabase.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return { update: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({}) }) };
        }
        if (callCount === 2) {
          return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { bonus_days: 30 } }) }) }) };
        }
        return { update: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({}) }) };
      });

      const result = await applyReferralBonus('u1', 'r1');
      expect(result).toBe(true);
    });

    it('returns false on error', async () => {
      supabase.from.mockImplementation(() => {
        throw new Error('DB error');
      });

      const result = await applyReferralBonus('u1', 'r1');
      expect(result).toBe(false);
    });
  });
});
