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
  typography: { h5: {}, bodySmall: {}, caption: {}, label: {}, bodyMuted: {}, h2: {} },
  layout: { screen: {}, scroll: {}, header: {}, headerBtn: {} },
}));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated = { ...RN.Animated, Value: jest.fn(() => ({ setValue: jest.fn(), interpolate: jest.fn(() => 0), addListener: jest.fn() })), timing: jest.fn(() => ({ start: jest.fn() })), spring: jest.fn(() => ({ start: jest.fn() })), parallel: jest.fn(() => ({ start: jest.fn() })), loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })), sequence: jest.fn(() => ({ start: jest.fn() })) };
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

import ChallengesList from '../../src/components/social/ChallengesList';
import WorkoutStreak from '../../src/components/social/WorkoutStreak';
import SocialFeed from '../../src/components/social/SocialFeed';
import PersonalRecords from '../../src/components/social/PersonalRecords';
import WorkoutShare from '../../src/components/social/WorkoutShare';

describe('Social Components', () => {
  it('ChallengesList imports correctly', () => {
    expect(ChallengesList).toBeDefined();
  });

  it('WorkoutStreak imports correctly', () => {
    expect(WorkoutStreak).toBeDefined();
  });

  it('SocialFeed imports correctly', () => {
    expect(SocialFeed).toBeDefined();
  });

  it('PersonalRecords imports correctly', () => {
    expect(PersonalRecords).toBeDefined();
  });

  it('WorkoutShare imports correctly', () => {
    expect(WorkoutShare).toBeDefined();
  });

  describe('WorkoutStreak', () => {
    it('imports correctly', () => {
      expect(WorkoutStreak).toBeDefined();
    });
  });

  describe('SocialFeed', () => {
    it('imports correctly', () => {
      expect(SocialFeed).toBeDefined();
    });
  });

  describe('PersonalRecords', () => {
    it('renders', () => {
      const { toJSON } = render(<PersonalRecords userId="user1" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('WorkoutShare', () => {
    it('renders', () => {
      const { toJSON } = render(<WorkoutShare workout={{ name: 'Test' }} xp={100} duration={30} exercises={5} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});

