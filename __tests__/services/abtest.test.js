import { getVariant, trackConversion, trackPaywallView, trackPaywallClick, trackPaywallSkip } from '../../src/services/abtest';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockChain = (data = null, error = null) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Math, 'random').mockReturnValue(0.3);
});

afterEach(() => {
  Math.random.mockRestore();
});

describe('A/B Test Service', () => {
  describe('getVariant', () => {
    it('returns control for unknown test', async () => {
      const result = await getVariant('user-1', 'unknown_test');
      expect(result).toBe('control');
    });

    it('returns existing variant if already assigned', async () => {
      supabase.from.mockReturnValue(mockChain({ variant: 'variant_b' }));
      const result = await getVariant('user-1', 'paywall');
      expect(result).toBe('variant_b');
    });

    it('assigns new variant when none exists', async () => {
      supabase.from.mockReturnValueOnce(mockChain(null))
        .mockReturnValueOnce(mockChain(null));
      const result = await getVariant('user-1', 'paywall');
      expect(result).toMatch(/^(control|variant_b)$/);
    });
  });

  describe('trackConversion', () => {
    it('does nothing for unknown test', async () => {
      await trackConversion('user-1', 'unknown_test', 'view');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('does nothing when no assignment exists', async () => {
      supabase.from.mockReturnValue(mockChain(null));
      await trackConversion('user-1', 'paywall', 'view');
      expect(supabase.from).not.toHaveBeenCalledWith('ab_test_events');
    });

    it('records event when assignment exists', async () => {
      supabase.from
        .mockReturnValueOnce(mockChain({ variant: 'control' }))
        .mockReturnValueOnce(mockChain(null));
      await trackConversion('user-1', 'paywall', 'click_subscribe');
      expect(supabase.from).toHaveBeenCalledWith('ab_test_events');
    });
  });

  describe('trackPaywallView', () => {
    it('calls trackConversion with view event', async () => {
      supabase.from.mockReturnValue(mockChain(null));
      await trackPaywallView('user-1');
      expect(supabase.from).toHaveBeenCalledWith('ab_test_assignments');
    });
  });

  describe('trackPaywallClick', () => {
    it('calls trackConversion with click_subscribe event', async () => {
      supabase.from.mockReturnValue(mockChain(null));
      await trackPaywallClick('user-1', 'intermediate');
      expect(supabase.from).toHaveBeenCalledWith('ab_test_assignments');
    });
  });

  describe('trackPaywallSkip', () => {
    it('calls trackConversion with skip event', async () => {
      supabase.from.mockReturnValue(mockChain(null));
      await trackPaywallSkip('user-1');
      expect(supabase.from).toHaveBeenCalledWith('ab_test_assignments');
    });
  });
});
