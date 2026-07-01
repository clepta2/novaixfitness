// src/__tests__/utils/accessibility.test.ts

import {
  getContrastRatio, meetsWCAG_AA, suggestAccessibleColor,
  meetsTouchTarget, getButtonA11yProps, getInputA11yProps,
} from '../../utils/a11yHelpers';

describe('accessibility utils', () => {
  describe('getContrastRatio', () => {
    it('preto e branco = ratio maximo', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('mesma cor = ratio 1', () => {
      const ratio = getContrastRatio('#CCFF00', '#CCFF00');
      expect(ratio).toBeCloseTo(1, 1);
    });
  });

  describe('meetsWCAG_AA', () => {
    it('preto em branco passa', () => {
      expect(meetsWCAG_AA('#000000', '#FFFFFF')).toBe(true);
    });

    it('branco em branco falha', () => {
      expect(meetsWCAG_AA('#FFFFFF', '#FFFFFF')).toBe(false);
    });
  });

  describe('suggestAccessibleColor', () => {
    it('retorna escuro para fundo claro', () => {
      expect(suggestAccessibleColor('#FFFFFF')).toBe('#12161A');
    });

    it('retorna claro para fundo escuro', () => {
      expect(suggestAccessibleColor('#12161A')).toBe('#FFFFFF');
    });
  });

  describe('meetsTouchTarget', () => {
    it('aceita 44x44', () => {
      expect(meetsTouchTarget(44, 44)).toBe(true);
    });

    it('rejeita 30x30', () => {
      expect(meetsTouchTarget(30, 30)).toBe(false);
    });
  });

  describe('getButtonA11yProps', () => {
    it('retorna props corretas', () => {
      const props = getButtonA11yProps({ label: 'Enviar', disabled: true });
      expect(props.accessibilityLabel).toBe('Enviar');
      expect(props.accessibilityRole).toBe('button');
      expect(props.accessibilityState.disabled).toBe(true);
    });

    it('marca busy quando loading', () => {
      const props = getButtonA11yProps({ label: 'Salvar', loading: true });
      expect(props.accessibilityState.busy).toBe(true);
    });
  });

  describe('getInputA11yProps', () => {
    it('retorna props corretas', () => {
      const props = getInputA11yProps({ label: 'Email', required: true, error: 'Obrigatorio' });
      expect(props.accessibilityLabel).toBe('Email');
      expect(props.accessibilityRequired).toBe(true);
      expect(props.accessibilityInvalid).toBe(true);
    });
  });
});
