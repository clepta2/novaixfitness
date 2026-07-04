import { getVariant, trackConversion, trackPaywallView, trackPaywallClick, trackPaywallSkip } from '../../src/services/abtest';

jest.mock('../../src/config/supabase', () => {
  const { createServiceMock } = require('../../__mocks__/supabase-test');
  return { supabase: createServiceMock() };
});

const { supabase } = require('../../src/config/supabase');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Math, 'random').mockReturnValue(0.3);
  supabase._reset();
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
      supabase._setData({ variant: 'variant_b' });
      const result = await getVariant('user-1', 'paywall');
      expect(result).toBe('variant_b');
    });

    it('assigns new variant when none exists', async () => {
      supabase._setData(null);
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
      supabase._setData(null);
      await trackConversion('user-1', 'paywall', 'view');
    });

    it('records event when assignment exists', async () => {
      supabase._setData({ variant: 'control' });
      await trackConversion('user-1', 'paywall', 'click_subscribe');
      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('trackPaywallView', () => {
    it('calls trackConversion with view event', async () => {
      supabase._setData({ variant: 'control' });
      await trackPaywallView('user-1');
      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('trackPaywallClick', () => {
    it('calls trackConversion with click_subscribe event', async () => {
      supabase._setData({ variant: 'control' });
      await trackPaywallClick('user-1', 'premium');
      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('trackPaywallSkip', () => {
    it('calls trackConversion with skip event', async () => {
      supabase._setData({ variant: 'control' });
      await trackPaywallSkip('user-1');
      expect(supabase.from).toHaveBeenCalled();
    });
  });
});
