import React from 'react';
import { Text } from 'react-native';
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
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
    h3: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    h4: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 24, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerBtn: { width: 40, height: 40 },
    section: { marginBottom: 24 },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    saveOnboarding: jest.fn().mockResolvedValue({}),
    updateProfile: jest.fn().mockResolvedValue({}),
    onboarding: { gender: 'male', age: 25, weight: 70, height: 170 },
  }),
}));

jest.mock('../../src/helpers/navigation', () => ({
  ROUTES: { HOME: '/(tabs)/home' },
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Card: (props) => React.createElement(View, null, props.children),
    Button: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    ProgressBar: (props) => React.createElement(View, null),
  };
});

import ModelScreen from '../../app/onboarding/modelo';
import GymTypeScreen from '../../app/onboarding/tipo-academia';
import ProcessingScreen from '../../app/onboarding/processando';

describe('Screens - Round 11', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ModelScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<ModelScreen />);
      expect(getByText('COM QUEM VOCÊ SE IDENTIFICA?')).toBeTruthy();
    });

    it('renders model options', () => {
      const { getByText } = render(<ModelScreen />);
      expect(getByText('Jovem Menino')).toBeTruthy();
      expect(getByText('Homem Magro')).toBeTruthy();
      expect(getByText('Mulher Magra')).toBeTruthy();
    });
  });

  describe('GymTypeScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<GymTypeScreen />);
      expect(getByText('QUAL TIPO DE ACADEMIA?')).toBeTruthy();
    });

    it('renders gym options', () => {
      const { getByText } = render(<GymTypeScreen />);
      expect(getByText('Smart Fit')).toBeTruthy();
      expect(getByText('Bio Ritmo')).toBeTruthy();
      expect(getByText('Não tenho')).toBeTruthy();
    });
  });

  describe('ProcessingScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ProcessingScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
