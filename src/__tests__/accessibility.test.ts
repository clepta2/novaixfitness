import {
  MIN_TOUCH_TARGET,
  getAccessibilityProps,
  ROLES,
  getState,
  ensureTouchTarget,
  getHint,
  getContrastRatio,
  meetsWCAG_AA,
  meetsWCAG_AAA,
} from '../utils/accessibility';

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  AccessibilityInfo: {
    isScreenReaderEnabled: jest.fn().mockResolvedValue(false),
    isReduceMotionEnabled: jest.fn().mockResolvedValue(false),
    announceForAccessibility: jest.fn(),
    setAccessibilityFocus: jest.fn(),
  },
}));

describe('accessibility utils', () => {
  describe('MIN_TOUCH_TARGET', () => {
    it('is 44 points', () => {
      expect(MIN_TOUCH_TARGET).toBe(44);
    });
  });

  describe('getAccessibilityProps', () => {
    it('returns label, role, and state', () => {
      const result = getAccessibilityProps('Iniciar treino', 'button', { disabled: false });
      expect(result).toEqual({
        accessibilityLabel: 'Iniciar treino',
        accessibilityRole: 'button',
        accessibilityState: { disabled: false },
      });
    });

    it('defaults state to empty object', () => {
      const result = getAccessibilityProps('OK', 'button');
      expect(result.accessibilityState).toEqual({});
    });
  });

  describe('ROLES', () => {
    it('has expected roles', () => {
      expect(ROLES.BUTTON).toBe('button');
      expect(ROLES.HEADER).toBe('header');
      expect(ROLES.IMAGE).toBe('image');
      expect(ROLES.PROGRESSBAR).toBe('progressbar');
      expect(ROLES.TIMER).toBe('timer');
      expect(ROLES.ALERT).toBe('alert');
    });
  });

  describe('getState', () => {
    it('includes only provided fields', () => {
      expect(getState({ disabled: true, selected: false })).toEqual({
        disabled: true,
        selected: false,
      });
    });

    it('returns empty object when no args', () => {
      expect(getState()).toEqual({});
    });

    it('handles all fields', () => {
      expect(getState({ disabled: true, selected: true, checked: true, expanded: true, busy: true })).toEqual({
        disabled: true,
        selected: true,
        checked: true,
        expanded: true,
        busy: true,
      });
    });
  });

  describe('ensureTouchTarget', () => {
    it('returns min 44x44 when style is smaller', () => {
      const result = ensureTouchTarget({ minWidth: 20, minHeight: 30 });
      expect(result.minWidth).toBe(44);
      expect(result.minHeight).toBe(44);
    });

    it('preserves larger sizes', () => {
      const result = ensureTouchTarget({ minWidth: 60, minHeight: 50 });
      expect(result.minWidth).toBe(60);
      expect(result.minHeight).toBe(50);
    });

    it('defaults to 44x44 when empty', () => {
      const result = ensureTouchTarget();
      expect(result.minWidth).toBe(44);
      expect(result.minHeight).toBe(44);
    });
  });

  describe('getHint', () => {
    it('returns action only when no result', () => {
      expect(getHint('Toque para editar')).toBe('Toque para editar');
    });

    it('returns action + result when result provided', () => {
      expect(getHint('Abrir', 'detalhes do treino')).toBe('Abrir. detalhes do treino');
    });
  });

  describe('getContrastRatio', () => {
    it('black on white returns high contrast', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('same color returns 1', () => {
      const ratio = getContrastRatio('#ffffff', '#ffffff');
      expect(ratio).toBeCloseTo(1, 1);
    });

    it('is symmetric', () => {
      const ratio1 = getContrastRatio('#ff0000', '#0000ff');
      const ratio2 = getContrastRatio('#0000ff', '#ff0000');
      expect(ratio1).toBeCloseTo(ratio2, 6);
    });
  });

  describe('meetsWCAG_AA', () => {
    it('black on white passes AA', () => {
      expect(meetsWCAG_AA('#000000', '#ffffff')).toBe(true);
    });

    it('low contrast fails AA', () => {
      expect(meetsWCAG_AA('#777777', '#888888')).toBe(false);
    });
  });

  describe('meetsWCAG_AAA', () => {
    it('black on white passes AAA', () => {
      expect(meetsWCAG_AAA('#000000', '#ffffff')).toBe(true);
    });

    it('medium contrast may fail AAA', () => {
      const ratio = getContrastRatio('#666666', '#ffffff');
      const passes = ratio >= 7;
      expect(meetsWCAG_AAA('#666666', '#ffffff')).toBe(passes);
    });
  });
});
