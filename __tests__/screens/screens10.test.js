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
    onboarding: {},
  }),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text, TextInput } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  const base = {
    Card: (props) => React.createElement(View, null, props.children),
    Button: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    ProgressBar: (props) => React.createElement(View, null),
    Badge: (props) => React.createElement(View, null, React.createElement(Text, null, props.value)),
    Input: ({ label, value, onChangeText, placeholder }) =>
      React.createElement(TextInput, { testID: `input-${label}`, value: value || '', onChangeText, placeholder }),
    OnboardingFooter: (props) => React.createElement(View, null, 
      React.createElement(Text, { onPress: props.onBack }, props.backLabel || 'ANTERIOR'),
      React.createElement(Text, { onPress: props.onNext }, props.nextLabel || 'PRÓXIMO')
    ),
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

import PhysicalDataScreen from '../../app/onboarding/dados-fisicos';
import ExperienceScreen from '../../app/onboarding/experiencia';
import AvailabilityScreen from '../../app/onboarding/disponibilidade';

describe('Screens - Round 10', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PhysicalDataScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<PhysicalDataScreen />);
      expect(getByText('SOBRE VOCE')).toBeTruthy();
    });

    it('renders data and location inputs, weight/height sliders', () => {
      const { getAllByText } = render(<PhysicalDataScreen />);
      expect(getAllByText('DATA DE NASCIMENTO').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('PESO').length).toBe(1);
      expect(getAllByText('ALTURA').length).toBe(1);
    });
  });

  describe('ExperienceScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<ExperienceScreen />);
      expect(getByText('QUAL SEU NÍVEL ATUAL?')).toBeTruthy();
    });

    it('renders level options', () => {
      const { getByText } = render(<ExperienceScreen />);
      expect(getByText('Iniciante')).toBeTruthy();
      expect(getByText('Intermediário')).toBeTruthy();
      expect(getByText('Avançado')).toBeTruthy();
    });
  });

  describe('AvailabilityScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<AvailabilityScreen />);
      expect(getByText('SUA DISPONIBILIDADE')).toBeTruthy();
    });

    it('renders day options', () => {
      const { getByText } = render(<AvailabilityScreen />);
      expect(getByText('2x')).toBeTruthy();
      expect(getByText('3x')).toBeTruthy();
    });

    it('renders location options', () => {
      const { getByText } = render(<AvailabilityScreen />);
      expect(getByText('Academia')).toBeTruthy();
      expect(getByText('Casa')).toBeTruthy();
      expect(getByText('Parque')).toBeTruthy();
    });
  });
});
