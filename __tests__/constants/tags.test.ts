import {
  TAG_CATEGORIES,
  DURATION_RANGES,
  MUSCLE_TO_BODY_PART,
  EQUIPMENT_TO_TAG,
  CATEGORY_TO_OBJECTIVE,
} from '../../src/constants/tags';

describe('Tags Constants', () => {
  describe('TAG_CATEGORIES', () => {
    it('has all 5 categories', () => {
      expect(Object.keys(TAG_CATEGORIES)).toEqual(['objective', 'bodyPart', 'duration', 'equipment', 'location']);
    });

    it('each category has label, icon, and tags array', () => {
      Object.values(TAG_CATEGORIES).forEach(cat => {
        expect(cat).toHaveProperty('label');
        expect(cat).toHaveProperty('icon');
        expect(Array.isArray(cat.tags)).toBe(true);
        expect(cat.tags.length).toBeGreaterThan(0);
      });
    });

    it('each tag has id and label', () => {
      Object.values(TAG_CATEGORIES).forEach(cat => {
        cat.tags.forEach(tag => {
          expect(tag).toHaveProperty('id');
          expect(tag).toHaveProperty('label');
        });
      });
    });
  });

  describe('DURATION_RANGES', () => {
    it('has 4 ranges', () => {
      expect(Object.keys(DURATION_RANGES)).toEqual(['short', 'medium', 'long', 'extra']);
    });

    it('each range has min and max', () => {
      Object.values(DURATION_RANGES).forEach(range => {
        expect(range).toHaveProperty('min');
        expect(range).toHaveProperty('max');
      });
    });

    it('ranges are sequential', () => {
      expect(DURATION_RANGES.short.max).toBe(DURATION_RANGES.medium.min);
      expect(DURATION_RANGES.medium.max).toBe(DURATION_RANGES.long.min);
      expect(DURATION_RANGES.long.max).toBe(DURATION_RANGES.extra.min);
    });
  });

  describe('MUSCLE_TO_BODY_PART', () => {
    it('maps common muscles to body parts', () => {
      expect(MUSCLE_TO_BODY_PART['Peito']).toBe('chest');
      expect(MUSCLE_TO_BODY_PART['Costas']).toBe('back');
      expect(MUSCLE_TO_BODY_PART['Perna']).toBe('legs');
      expect(MUSCLE_TO_BODY_PART['Core']).toBe('core');
    });
  });

  describe('EQUIPMENT_TO_TAG', () => {
    it('maps equipment to tags', () => {
      expect(EQUIPMENT_TO_TAG['Barra']).toBe('barbell');
      expect(EQUIPMENT_TO_TAG['Halteres']).toBe('dumbbells');
      expect(EQUIPMENT_TO_TAG['Máquina']).toBe('machine');
    });
  });

  describe('CATEGORY_TO_OBJECTIVE', () => {
    it('maps categories to objectives', () => {
      expect(CATEGORY_TO_OBJECTIVE['MUSCULAÇÃO']).toContain('muscle_gain');
      expect(CATEGORY_TO_OBJECTIVE['CARDIO']).toContain('weight_loss');
      expect(CATEGORY_TO_OBJECTIVE['FLEXIBILIDADE']).toContain('flexibility');
    });
  });
});
