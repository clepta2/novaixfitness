// __tests__/components/themeComponents.test.js
// Testes para componentes com tema reativo

import React from 'react';

// Mock do ThemeContext
jest.mock('../../src/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#0A0E14',
      surface: '#121820',
      primary: '#B8FF00',
      textTitle: '#FFFFFF',
      textDescription: '#A0AEC0',
      textMuted: '#5A6677',
      border: 'rgba(255,255,255,0.08)',
      error: '#FF5252',
    },
    isDark: true,
    themeMode: 'dark',
    setThemeMode: jest.fn(),
    toggleTheme: jest.fn(),
  }),
  useColors: () => ({
    background: '#0A0E14',
    surface: '#121820',
    primary: '#B8FF00',
    textTitle: '#FFFFFF',
    textDescription: '#A0AEC0',
    textMuted: '#5A6677',
    border: 'rgba(255,255,255,0.08)',
    error: '#FF5252',
  }),
  useIsDark: () => true,
}));

jest.mock('../../src/constants/colors', () => ({
  COLORS: {
    background: '#0A0E14',
    surface: '#121820',
    primary: '#B8FF00',
    textTitle: '#FFFFFF',
    textDescription: '#A0AEC0',
    textMuted: '#5A6677',
    border: 'rgba(255,255,255,0.08)',
    error: '#FF5252',
  },
  THEMES: { dark: {}, light: {} },
  setThemeColors: jest.fn(),
}));

jest.mock('../../src/constants/spacing', () => ({
  SPACING: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  BORDER_RADIUS: { sm: 4, md: 8, lg: 12, xl: 16 },
  ICON_SIZES: { sm: 16, md: 20, lg: 24 },
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
  shadow: () => ({}),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

describe('Componentes com tema reativo', () => {
  describe('SectionCard', () => {
    it('exporta corretamente', () => {
      const { SectionCard } = require('../../src/components/ui/SectionCard');
      expect(SectionCard).toBeDefined();
      expect(typeof SectionCard).toBe('function');
    });
  });

  describe('ThemedView', () => {
    it('exporta corretamente', () => {
      const { ThemedView } = require('../../src/components/ui/ThemedView');
      expect(ThemedView).toBeDefined();
      expect(typeof ThemedView).toBe('function');
    });
  });

  describe('ThemedText', () => {
    it('exporta corretamente', () => {
      const { ThemedText } = require('../../src/components/ui/ThemedText');
      expect(ThemedText).toBeDefined();
      expect(typeof ThemedText).toBe('function');
    });
  });

  describe('ThemedInput', () => {
    it('exporta corretamente', () => {
      const { ThemedInput } = require('../../src/components/ui/ThemedInput');
      expect(ThemedInput).toBeDefined();
      expect(typeof ThemedInput).toBe('function');
    });
  });

  describe('ErrorState', () => {
    it('exporta corretamente', () => {
      const { ErrorState } = require('../../src/components/ui/ErrorState');
      expect(ErrorState).toBeDefined();
      expect(typeof ErrorState).toBe('function');
    });
  });

  describe('LoadingState', () => {
    it('exporta corretamente', () => {
      const { LoadingState } = require('../../src/components/ui/LoadingState');
      expect(LoadingState).toBeDefined();
      expect(typeof LoadingState).toBe('function');
    });
  });

  describe('Divider', () => {
    it('exporta corretamente', () => {
      const { Divider } = require('../../src/components/ui/Divider');
      expect(Divider).toBeDefined();
      expect(typeof Divider).toBe('function');
    });
  });

  describe('Chip', () => {
    it('exporta corretamente', () => {
      const { Chip } = require('../../src/components/ui/Chip');
      expect(Chip).toBeDefined();
      expect(typeof Chip).toBe('function');
    });
  });
});
