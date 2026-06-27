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

jest.mock('react-native-youtube-iframe', () => {
  const React = require('react');
  return (props) => React.createElement('YoutubeIframe', props);
});

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
}));

import WorkoutInfo from '../../src/components/workout/WorkoutInfo';
import VideoPreview from '../../src/components/workout/VideoPreview';

describe('Workout Components - Round 2', () => {
  describe('WorkoutInfo', () => {
    const mockWorkout = {
      duration: 45,
      exercises: [{ id: 'e1' }, { id: 'e2' }],
      equipment: ['Barra', 'Halteres'],
    };

    it('renders stats', () => {
      const { getByText } = render(
        <WorkoutInfo workout={mockWorkout} totalSets={20} calories={400} />
      );
      expect(getByText('45 min')).toBeTruthy();
      expect(getByText('2 exercícios')).toBeTruthy();
      expect(getByText('20 séries')).toBeTruthy();
      expect(getByText('~400 kcal')).toBeTruthy();
    });

    it('renders equipment when present', () => {
      const { getByText } = render(
        <WorkoutInfo workout={mockWorkout} totalSets={20} calories={400} />
      );
      expect(getByText('EQUIPAMENTOS')).toBeTruthy();
      expect(getByText('Barra')).toBeTruthy();
      expect(getByText('Halteres')).toBeTruthy();
    });

    it('hides equipment when empty', () => {
      const workoutNoEquip = { ...mockWorkout, equipment: [] };
      const { queryByText } = render(
        <WorkoutInfo workout={workoutNoEquip} totalSets={20} calories={400} />
      );
      expect(queryByText('EQUIPAMENTOS')).toBeNull();
    });
  });

  describe('VideoPreview', () => {
    it('shows placeholder when video not showing', () => {
      const { getByText } = render(
        <VideoPreview videoId="abc123" showVideo={false} onToggle={() => {}} />
      );
      expect(getByText('Assistir prévia')).toBeTruthy();
    });

    it('calls onToggle when pressed', () => {
      const onToggle = jest.fn();
      const { getByText } = render(
        <VideoPreview videoId="abc123" showVideo={false} onToggle={onToggle} />
      );
      fireEvent.press(getByText('Assistir prévia'));
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('renders video player when showVideo=true', () => {
      const { toJSON } = render(
        <VideoPreview videoId="abc123" showVideo={true} onToggle={() => {}} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });
});
