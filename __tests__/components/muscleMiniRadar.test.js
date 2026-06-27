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

jest.mock('../../src/config/supabase', () => {
  const mockChain = {
    select: jest.fn(() => mockChain),
    eq: jest.fn(() => mockChain),
    gte: jest.fn(() => Promise.resolve({ data: [], error: null })),
  };
  return {
    supabase: {
      from: jest.fn(() => mockChain),
    },
  };
});

import MuscleMiniRadar from '../../src/components/profile/MuscleMiniRadar';

describe('MuscleMiniRadar', () => {
  it('renders without throwing', () => {
    expect(() => render(<MuscleMiniRadar userId="test-user" />)).not.toThrow();
  });

  it('returns null when no userId', () => {
    const { toJSON } = render(<MuscleMiniRadar userId={null} />);
    expect(toJSON()).toBeNull();
  });
});
