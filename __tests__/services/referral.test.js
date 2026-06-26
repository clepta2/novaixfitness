import { generateReferralCode } from '../../src/services/referral';

describe('Referral Service', () => {
  describe('generateReferralCode', () => {
    it('generates code with NOVAIX prefix', () => {
      const code = generateReferralCode('12345678-1234-1234-1234-123456789012');
      expect(code).toMatch(/^NOVAIX/);
    });

    it('uses first 8 chars of userId', () => {
      const code = generateReferralCode('ABCDEFGH-1234-1234-1234-123456789012');
      expect(code).toBe('NOVAIXABCDEFGH');
    });

    it('converts to uppercase', () => {
      const code = generateReferralCode('abcdef12-1234-1234-1234-123456789012');
      expect(code).toBe('NOVAIXABCDEF12');
    });

    it('returns null for null userId', () => {
      expect(generateReferralCode(null)).toBeNull();
    });

    it('returns null for undefined userId', () => {
      expect(generateReferralCode(undefined)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(generateReferralCode('')).toBeNull();
    });

    it('generates consistent code for same userId', () => {
      const userId = 'test-user-12345';
      const code1 = generateReferralCode(userId);
      const code2 = generateReferralCode(userId);
      expect(code1).toBe(code2);
    });

    it('generates different codes for different userIds', () => {
      const code1 = generateReferralCode('user-11111');
      const code2 = generateReferralCode('user-22222');
      expect(code1).not.toBe(code2);
    });
  });
});
