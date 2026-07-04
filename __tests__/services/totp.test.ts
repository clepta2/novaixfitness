jest.mock('otpauth', () => {
  class MockSecret {
    constructor() { this.base32 = 'JBSWY3DPEHPK3PXP'; }
    static fromBase32(s) { return new MockSecret(); }
  }
  class MockTOTP {
    constructor(opts) { this.opts = opts; this.secret = new MockSecret(); }
    toString() { return 'otpauth://totp/test'; }
    validate({ token }) { return token === '123456' ? 0 : null; }
  }
  return { TOTP: MockTOTP, Secret: MockSecret };
});

jest.mock('../../src/config/supabase', () => {
  const chain = {
    select: jest.fn(() => chain),
    eq: jest.fn(() => chain),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    upsert: jest.fn().mockResolvedValue({ error: null }),
    update: jest.fn(() => chain),
  };
  return { supabase: { from: jest.fn(() => chain) } };
});

import {
  generateSecret,
  verifyToken,
  setup2FA,
  confirm2FA,
  verify2FA,
  is2FAEnabled,
  disable2FA,
} from '../../src/services/totp';

const { supabase } = require('../../src/config/supabase');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TOTP Service', () => {
  describe('generateSecret', () => {
    it('returns secret and uri', () => {
      const result = generateSecret('u1');
      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('uri');
      expect(typeof result.secret).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('returns true for valid token', () => {
      expect(verifyToken('JBSWY3DPEHPK3PXP', '123456')).toBe(true);
    });

    it('returns false for invalid token', () => {
      expect(verifyToken('JBSWY3DPEHPK3PXP', '000000')).toBe(false);
    });
  });

  describe('setup2FA', () => {
    it('creates 2FA record and returns secret+uri', async () => {
      const result = await setup2FA('u1');
      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('uri');
      expect(supabase.from).toHaveBeenCalledWith('admin_2fa');
    });
  });

  describe('confirm2FA', () => {
    it('enables 2FA with valid token', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { secret: 'JBSWY3DPEHPK3PXP' }, error: null });
      const result = await confirm2FA('u1', '123456');
      expect(result).toBe(true);
    });

    it('throws when not found', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      await expect(confirm2FA('u1', '123456')).rejects.toThrow('Configuração 2FA');
    });

    it('throws for invalid token', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { secret: 'JBSWY3DPEHPK3PXP' }, error: null });
      await expect(confirm2FA('u1', '000000')).rejects.toThrow('Código inválido');
    });
  });

  describe('verify2FA', () => {
    it('returns true for valid token when enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { secret: 'JBSWY3DPEHPK3PXP', enabled: true }, error: null });
      const result = await verify2FA('u1', '123456');
      expect(result).toBe(true);
    });

    it('returns false when not found', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      expect(await verify2FA('u1', '123456')).toBe(false);
    });

    it('returns false when disabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { secret: 'JBSWY3DPEHPK3PXP', enabled: false }, error: null });
      expect(await verify2FA('u1', '123456')).toBe(false);
    });
  });

  describe('is2FAEnabled', () => {
    it('returns true when enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { enabled: true }, error: null });
      expect(await is2FAEnabled('u1')).toBe(true);
    });

    it('returns false when not enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { enabled: false }, error: null });
      expect(await is2FAEnabled('u1')).toBe(false);
    });
  });

  describe('disable2FA', () => {
    it('disables 2FA', async () => {
      const result = await disable2FA('u1');
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('admin_2fa');
    });
  });
});
