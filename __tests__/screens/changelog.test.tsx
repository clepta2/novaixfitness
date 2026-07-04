import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props) => React.createElement('Ionicons', props) };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return new Proxy({}, { get: (_, key) => (props) => React.createElement(View, null, String(key)) });
});

import ChangelogScreen from '../../app/changelog';

describe('ChangelogScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<ChangelogScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
