import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/constants/gamification', () => ({
  getXPProgress: jest.fn((xp) => ({
    current: { level: 1, name: 'Iniciante', icon: 'leaf', color: '#10B981' },
    next: { level: 2, name: 'Aprendiz', icon: 'flash', color: '#3B82F6' },
    progress: Math.min(xp / 500, 1),
    xpInLevel: xp % 500,
    xpNeeded: 500,
  })),
}));

import GamificationBar from '../../src/components/profile/GamificationBar';

describe('Profile Components', () => {
  describe('GamificationBar', () => {
    it('renders level info', () => {
      const { getByText } = render(<GamificationBar xp={100} />);
      expect(getByText('Nv. 1')).toBeTruthy();
      expect(getByText('Iniciante')).toBeTruthy();
      expect(getByText('100 XP')).toBeTruthy();
    });

    it('renders progress info', () => {
      const { getByText } = render(<GamificationBar xp={200} />);
      expect(getByText('200 / 500 XP')).toBeTruthy();
      expect(getByText(/Proximo: Aprendiz/)).toBeTruthy();
    });

    it('renders with 0 xp', () => {
      const { getByText } = render(<GamificationBar xp={0} />);
      expect(getByText('Nv. 1')).toBeTruthy();
      expect(getByText('0 XP')).toBeTruthy();
    });

    it('renders max level message when no next', () => {
      const { getXPProgress } = require('../../src/constants/gamification');
      getXPProgress.mockReturnValueOnce({
        current: { level: 10, name: 'Mestre', icon: 'star', color: '#FFD700' },
        next: null,
        progress: 1,
        xpInLevel: 1000,
        xpNeeded: 1000,
      });
      const { getByText } = render(<GamificationBar xp={5000} />);
      expect(getByText('Nivel maximo atingido!')).toBeTruthy();
    });
  });
});
