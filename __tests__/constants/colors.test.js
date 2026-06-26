import { COLORS, THEMES } from '../../src/constants/colors';

describe('Colors Constants', () => {
  describe('COLORS', () => {
    it('has background color', () => {
      expect(COLORS.background).toBe('#12161A');
    });

    it('has surface color', () => {
      expect(COLORS.surface).toBe('#1E232A');
    });

    it('has hover color', () => {
      expect(COLORS.hover).toBe('#2A2F38');
    });

    it('has border color', () => {
      expect(COLORS.border).toBe('#333333');
    });

    it('has primary color', () => {
      expect(COLORS.primary).toBe('#CCFF00');
    });

    it('has secondary color', () => {
      expect(COLORS.secondary).toBe('#FF6B35');
    });

    it('has success color', () => {
      expect(COLORS.success).toBe('#00E676');
    });

    it('has attention color', () => {
      expect(COLORS.attention).toBe('#FFD600');
    });

    it('has error color', () => {
      expect(COLORS.error).toBe('#FF1744');
    });

    it('has textTitle color', () => {
      expect(COLORS.textTitle).toBe('#FFFFFF');
    });

    it('has textDescription color', () => {
      expect(COLORS.textDescription).toBe('#94A3B8');
    });

    it('has textMuted color', () => {
      expect(COLORS.textMuted).toBe('#666666');
    });

    it('has all required colors', () => {
      const requiredColors = [
        'background', 'surface', 'hover', 'border', 'primary', 'secondary',
        'success', 'attention', 'error', 'textTitle', 'textDescription', 'textMuted',
      ];
      requiredColors.forEach(color => {
        expect(COLORS[color]).toBeDefined();
      });
    });

    it('all colors are valid hex', () => {
      const hexRegex = /^#[0-9A-F]{6}$/i;
      Object.values(COLORS).forEach(color => {
        expect(color).toMatch(hexRegex);
      });
    });
  });

  describe('THEMES', () => {
    it('has dark theme', () => {
      expect(THEMES.dark).toBeDefined();
      expect(THEMES.dark.background).toBe('#12161A');
    });

    it('has light theme', () => {
      expect(THEMES.light).toBeDefined();
      expect(THEMES.light.background).toBe('#FFFFFF');
    });

    it('dark and light themes have same keys', () => {
      const darkKeys = Object.keys(THEMES.dark).sort();
      const lightKeys = Object.keys(THEMES.light).sort();
      expect(darkKeys).toEqual(lightKeys);
    });

    it('primary color is same in both themes', () => {
      expect(THEMES.dark.primary).toBe(THEMES.light.primary);
    });

    it('success color is same in both themes', () => {
      expect(THEMES.dark.success).toBe(THEMES.light.success);
    });

    it('attention color is same in both themes', () => {
      expect(THEMES.dark.attention).toBe(THEMES.light.attention);
    });
  });
});
