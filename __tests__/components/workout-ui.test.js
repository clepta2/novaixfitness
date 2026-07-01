import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true] }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props) => React.createElement('Ionicons', props) };
});
jest.mock('../../src/constants/shadows', () => ({ SHADOWS: { sm: {}, md: {}, lg: {} } }));
jest.mock('../../src/utils/responsive', () => ({ scale: (n) => n }));
jest.mock('../../src/styles', () => ({
  typography: { h5: {}, bodySmall: {}, caption: {}, label: {}, bodyMuted: {}, body: {}, h3: {} },
  layout: { screen: {}, scroll: {}, header: {}, section: {}, footer: {} },
}));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success' },
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated = { ...RN.Animated, Value: jest.fn(() => ({ setValue: jest.fn(), interpolate: jest.fn(() => 0), addListener: jest.fn() })), timing: jest.fn(() => ({ start: jest.fn() })), spring: jest.fn(() => ({ start: jest.fn() })), parallel: jest.fn(() => ({ start: jest.fn() })), loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })), sequence: jest.fn(() => ({ start: jest.fn() })), Share: { share: jest.fn() } };
  return RN;
});
jest.mock('react-native-svg', () => {
  const React = require('react');
  return { Svg: (props) => React.createElement('Svg', props), Circle: (props) => React.createElement('Circle', props), G: (props) => React.createElement('G', props), Defs: (props) => React.createElement('Defs', props), LinearGradient: (props) => React.createElement('LinearGradient', props), Stop: (props) => React.createElement('Stop', props), Line: (props) => React.createElement('Line', props), Polygon: (props) => React.createElement('Polygon', props), Text: (props) => React.createElement('Text', props) };
});

jest.mock('../../src/config/supabase', () => ({
  supabase: { from: jest.fn(() => ({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), order: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue({ data: [] }) })) },
}));
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' } }),
}));
jest.mock('../../src/services/hapticService', () => ({
  mediumImpact: jest.fn(),
  lightTick: jest.fn(),
}));
jest.mock('../../src/services/voiceCoach', () => ({
  speakNextExercise: jest.fn(),
  speakRestStart: jest.fn(),
  speakRestEnd: jest.fn(),
  speakRestHalfway: jest.fn(),
  speakHalfway: jest.fn(),
  speakWelcome: jest.fn(),
  speakWorkoutComplete: jest.fn(),
  stopSpeaking: jest.fn(),
  isVoiceCoachEnabled: jest.fn(() => true),
  setVoiceCoachEnabled: jest.fn(),
}));

import WorkoutTimer from '../../src/components/workout/WorkoutTimer';
import WorkoutControls from '../../src/components/workout/WorkoutControls';
import RestOverlay from '../../src/components/workout/RestOverlay';
import WorkoutSummary from '../../src/components/workout/WorkoutSummary';
import WorkoutForm from '../../src/components/workout/WorkoutForm';

describe('Workout UI Components', () => {
  it('WorkoutTimer imports correctly', () => {
    expect(WorkoutTimer).toBeDefined();
  });

  it('WorkoutControls imports correctly', () => {
    expect(WorkoutControls).toBeDefined();
  });

  it('RestOverlay imports correctly', () => {
    expect(RestOverlay).toBeDefined();
  });

  describe('WorkoutSummary', () => {
    it('renders', () => {
      const { toJSON } = render(<WorkoutSummary workout={{ name: 'Test' }} duration={30} calories={300} xpEarned={100} exercisesCompleted={5} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('WorkoutForm', () => {
    it('renders', () => {
      const { toJSON } = render(<WorkoutForm />);
      expect(toJSON()).toBeTruthy();
    });
  });
});

