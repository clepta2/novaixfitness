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
  useLocalSearchParams: () => ({}),
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    saveOnboarding: jest.fn().mockResolvedValue({}),
  }),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  return new Proxy({}, { get: (_, key) => Stub(String(key)) });
});

import ProcessingScreen from '../../app/onboarding/processando';

describe('Screens - Round 11', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ProcessingScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ProcessingScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
