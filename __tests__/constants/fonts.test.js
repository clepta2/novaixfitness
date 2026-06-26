import { FONTS, FONT_SIZES } from '../../src/constants/fonts';

describe('Fonts Constants', () => {
  describe('FONTS', () => {
    it('has h1 font', () => {
      expect(FONTS.h1).toBeDefined();
      expect(FONTS.h1.fontFamily).toBe('Montserrat_800ExtraBold');
      expect(FONTS.h1.fontSize).toBe(32);
    });

    it('has h2 font', () => {
      expect(FONTS.h2).toBeDefined();
      expect(FONTS.h2.fontFamily).toBe('Montserrat_700Bold');
      expect(FONTS.h2.fontSize).toBe(24);
    });

    it('has h3 font', () => {
      expect(FONTS.h3).toBeDefined();
      expect(FONTS.h3.fontFamily).toBe('Montserrat_600SemiBold');
      expect(FONTS.h3.fontSize).toBe(18);
    });

    it('has body font', () => {
      expect(FONTS.body).toBeDefined();
      expect(FONTS.body.fontFamily).toBe('Inter_400Regular');
      expect(FONTS.body.fontSize).toBe(16);
    });

    it('has bodyMedium font', () => {
      expect(FONTS.bodyMedium).toBeDefined();
      expect(FONTS.bodyMedium.fontFamily).toBe('Inter_500Medium');
      expect(FONTS.bodyMedium.fontSize).toBe(16);
    });

    it('has caption font', () => {
      expect(FONTS.caption).toBeDefined();
      expect(FONTS.caption.fontFamily).toBe('Inter_400Regular');
      expect(FONTS.caption.fontSize).toBe(12);
    });

    it('has timer font', () => {
      expect(FONTS.timer).toBeDefined();
      expect(FONTS.timer.fontFamily).toBe('Montserrat_700Bold');
      expect(FONTS.timer.fontSize).toBe(48);
    });

    it('has button font', () => {
      expect(FONTS.button).toBeDefined();
      expect(FONTS.button.fontFamily).toBe('Montserrat_700Bold');
      expect(FONTS.button.fontSize).toBe(14);
    });

    it('headings use Montserrat', () => {
      expect(FONTS.h1.fontFamily).toContain('Montserrat');
      expect(FONTS.h2.fontFamily).toContain('Montserrat');
      expect(FONTS.h3.fontFamily).toContain('Montserrat');
    });

    it('body text uses Inter', () => {
      expect(FONTS.body.fontFamily).toContain('Inter');
      expect(FONTS.bodyMedium.fontFamily).toContain('Inter');
      expect(FONTS.caption.fontFamily).toContain('Inter');
    });

    it('heading sizes decrease from h1 to h3', () => {
      expect(FONTS.h1.fontSize).toBeGreaterThan(FONTS.h2.fontSize);
      expect(FONTS.h2.fontSize).toBeGreaterThan(FONTS.h3.fontSize);
    });

    it('timer is largest font', () => {
      const sizes = [FONTS.h1, FONTS.h2, FONTS.h3, FONTS.body, FONTS.timer];
      sizes.forEach(font => {
        expect(FONTS.timer.fontSize).toBeGreaterThanOrEqual(font.fontSize);
      });
    });

    it('headings have uppercase transform', () => {
      expect(FONTS.h1.textTransform).toBe('uppercase');
      expect(FONTS.h2.textTransform).toBe('uppercase');
    });

    it('button has uppercase transform', () => {
      expect(FONTS.button.textTransform).toBe('uppercase');
    });

    it('all fonts have fontFamily', () => {
      Object.values(FONTS).forEach(font => {
        expect(font.fontFamily).toBeDefined();
        expect(typeof font.fontFamily).toBe('string');
      });
    });

    it('all fonts have fontSize', () => {
      Object.values(FONTS).forEach(font => {
        expect(font.fontSize).toBeDefined();
        expect(typeof font.fontSize).toBe('number');
        expect(font.fontSize).toBeGreaterThan(0);
      });
    });
  });

  describe('FONT_SIZES', () => {
    it('has xs size', () => {
      expect(FONT_SIZES.xs).toBe(10);
    });

    it('has sm size', () => {
      expect(FONT_SIZES.sm).toBe(12);
    });

    it('has md size', () => {
      expect(FONT_SIZES.md).toBe(14);
    });

    it('has base size', () => {
      expect(FONT_SIZES.base).toBe(16);
    });

    it('has lg size', () => {
      expect(FONT_SIZES.lg).toBe(18);
    });

    it('has xl size', () => {
      expect(FONT_SIZES.xl).toBe(20);
    });

    it('has xxl size', () => {
      expect(FONT_SIZES.xxl).toBe(24);
    });

    it('has xxxl size', () => {
      expect(FONTS.h1.fontSize).toBe(32);
    });

    it('has huge size', () => {
      expect(FONT_SIZES.huge).toBe(48);
    });

    it('has massive size', () => {
      expect(FONT_SIZES.massive).toBe(64);
    });

    it('sizes increase progressively', () => {
      expect(FONT_SIZES.xs).toBeLessThan(FONT_SIZES.sm);
      expect(FONT_SIZES.sm).toBeLessThan(FONT_SIZES.md);
      expect(FONT_SIZES.md).toBeLessThan(FONT_SIZES.base);
      expect(FONT_SIZES.base).toBeLessThan(FONT_SIZES.lg);
      expect(FONT_SIZES.lg).toBeLessThan(FONT_SIZES.xl);
      expect(FONT_SIZES.xl).toBeLessThan(FONT_SIZES.xxl);
      expect(FONT_SIZES.xxl).toBeLessThan(FONT_SIZES.huge);
      expect(FONT_SIZES.huge).toBeLessThan(FONT_SIZES.massive);
    });

    it('all values are numbers', () => {
      Object.values(FONT_SIZES).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('all values are positive', () => {
      Object.values(FONT_SIZES).forEach(value => {
        expect(value).toBeGreaterThan(0);
      });
    });
  });
});
