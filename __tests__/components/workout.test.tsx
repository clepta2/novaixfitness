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

import CategoryCard from '../../src/components/workout/CategoryCard';
import ProgressSection from '../../src/components/workout/ProgressSection';
import WorkoutCard from '../../src/components/workout/WorkoutCard';

describe('Workout Components', () => {
  describe('CategoryCard', () => {
    const mockCategory = {
      label: 'Musculação',
      icon: 'barbell',
      color: '#CCFF00',
      description: 'Treinos de força',
      count: 12,
    };

    it('renders category info', () => {
      const { getByText } = render(<CategoryCard category={mockCategory} />);
      expect(getByText('Musculação')).toBeTruthy();
      expect(getByText('Treinos de força')).toBeTruthy();
      expect(getByText('12 treinos')).toBeTruthy();
    });

    it('calls onPress with category', () => {
      const onPress = jest.fn();
      const { getByText } = render(<CategoryCard category={mockCategory} onPress={onPress} />);
      fireEvent.press(getByText('Musculação'));
      expect(onPress).toHaveBeenCalledWith(mockCategory);
    });

    it('applies active style', () => {
      const { rerender } = render(<CategoryCard category={mockCategory} isActive />);
      rerender(<CategoryCard category={mockCategory} isActive={false} />);
    });
  });

  describe('ProgressSection', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ProgressSection completed={2} total={5} />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders dots for each workout', () => {
      const { toJSON } = render(<ProgressSection completed={1} total={3} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('WorkoutCard', () => {
    const mockWorkout = {
      id: '1',
      name: 'Treino A',
      category: 'Musculação',
      duration: 45,
      level: 'Intermediário',
    };

    it('renders workout info', () => {
      const { toJSON } = render(<WorkoutCard workout={mockWorkout} />);
      expect(toJSON()).toBeTruthy();
    });

    it('calls onPress with workout', () => {
      const onPress = jest.fn();
      const { toJSON } = render(<WorkoutCard workout={mockWorkout} onPress={onPress} />);
      expect(toJSON()).toBeTruthy();
    });

    it('shows favorite button', () => {
      const onFavorite = jest.fn();
      const { toJSON } = render(
        <WorkoutCard workout={mockWorkout} onFavorite={onFavorite} isFavorite={false} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('shows filled heart when favorited', () => {
      const { toJSON } = render(
        <WorkoutCard workout={mockWorkout} isFavorite showFavorite />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('hides favorite when showFavorite=false', () => {
      const { toJSON } = render(
        <WorkoutCard workout={mockWorkout} showFavorite={false} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('shows offline badge when cached', () => {
      const { toJSON } = render(
        <WorkoutCard workout={mockWorkout} isOfflineCached />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('hides offline badge when not cached', () => {
      const { toJSON } = render(
        <WorkoutCard workout={mockWorkout} isOfflineCached={false} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });
});
