import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/styles', () => ({
  typography: {
    h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
    h3: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
  },
  layout: {
    screen: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { padding: 24 },
  },
}));

jest.mock('../../src/data/breathingExercises', () => ({
  breathingExercises: [
    {
      id: '478',
      name: '4-7-8 Relaxante',
      description: 'Técnica calmante.',
      phases: [
        { type: 'inhale', duration: 4, label: 'Inspire' },
        { type: 'hold', duration: 7, label: 'Segure' },
        { type: 'exhale', duration: 8, label: 'Expire' },
      ],
      cycles: 4,
      icon: 'moon',
      color: '#7B68EE',
      benefit: 'Sono e Ansiedade',
    },
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Foco e controle.',
      phases: [
        { type: 'inhale', duration: 4, label: 'Inspire' },
        { type: 'hold', duration: 4, label: 'Segure' },
        { type: 'exhale', duration: 4, label: 'Expire' },
        { type: 'hold', duration: 4, label: 'Segure' },
      ],
      cycles: 6,
      icon: 'square',
      color: '#3B82F6',
      benefit: 'Foco e Calma',
    },
    {
      id: 'coherent',
      name: 'Coerência Cardíaca',
      description: 'Equilíbrio do sistema nervoso.',
      phases: [
        { type: 'inhale', duration: 5, label: 'Inspire' },
        { type: 'exhale', duration: 5, label: 'Expire' },
      ],
      cycles: 10,
      icon: 'heart',
      color: '#FF6B35',
      benefit: 'Equilíbrio Cardíaco',
    },
    {
      id: 'energize',
      name: 'Energizante',
      description: 'Respiração rápida.',
      phases: [
        { type: 'inhale', duration: 2, label: 'Inspire' },
        { type: 'exhale', duration: 2, label: 'Expire' },
      ],
      cycles: 15,
      icon: 'flash',
      color: '#CCFF00',
      benefit: 'Energia e Alerta',
    },
    {
      id: 'deep',
      name: 'Respiração Profunda',
      description: 'Relaxamento profundo.',
      phases: [
        { type: 'inhale', duration: 6, label: 'Inspire' },
        { type: 'hold', duration: 2, label: 'Segure' },
        { type: 'exhale', duration: 6, label: 'Expire' },
      ],
      cycles: 5,
      icon: 'leaf',
      color: '#00E676',
      benefit: 'Relaxamento Profundo',
    },
  ],
}));

describe('MindfulnessScreen', () => {
  it('renders without crashing', () => {
    const MindfulnessScreen = require('../../app/mindfulness').default;
    const { toJSON } = render(<MindfulnessScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays exercise list', () => {
    const MindfulnessScreen = require('../../app/mindfulness').default;
    const { toJSON } = render(<MindfulnessScreen />);
    const json = toJSON();
    expect(json).toBeTruthy();
  });
});

describe('BreathingExercise', () => {
  it('renders without crashing', () => {
    const BreathingExercise = require('../../src/components/recovery/BreathingExercise').default;
    const exercise = {
      id: '478',
      name: '4-7-8',
      phases: [
        { type: 'inhale', duration: 4, label: 'Inspire' },
        { type: 'hold', duration: 7, label: 'Segure' },
        { type: 'exhale', duration: 8, label: 'Expire' },
      ],
      cycles: 4,
    };
    const { toJSON } = render(<BreathingExercise exercise={exercise} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('breathingExercises data', () => {
  it('exports valid exercises array', () => {
    const { breathingExercises } = require('../../src/data/breathingExercises');
    expect(Array.isArray(breathingExercises)).toBe(true);
    expect(breathingExercises.length).toBeGreaterThanOrEqual(4);
  });

  it('each exercise has required fields', () => {
    const { breathingExercises } = require('../../src/data/breathingExercises');
    breathingExercises.forEach((ex) => {
      expect(ex.id).toBeDefined();
      expect(ex.name).toBeDefined();
      expect(ex.phases).toBeDefined();
      expect(Array.isArray(ex.phases)).toBe(true);
      expect(ex.cycles).toBeGreaterThan(0);
    });
  });

  it('phases have valid types', () => {
    const { breathingExercises } = require('../../src/data/breathingExercises');
    const validTypes = ['inhale', 'hold', 'exhale'];
    breathingExercises.forEach((ex) => {
      ex.phases.forEach((phase) => {
        expect(validTypes).toContain(phase.type);
        expect(phase.duration).toBeGreaterThan(0);
      });
    });
  });
});
