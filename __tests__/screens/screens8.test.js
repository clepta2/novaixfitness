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

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
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
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    inputField: { fontFamily: 'Inter_400Regular', fontSize: 14 },
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
    user: null,
    signInWithEmail: jest.fn().mockResolvedValue({}),
    signInWithGoogle: jest.fn().mockResolvedValue({}),
    signInWithApple: jest.fn().mockResolvedValue({}),
    signUpWithEmail: jest.fn().mockResolvedValue({}),
    signOut: jest.fn(),
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      count: jest.fn().mockReturnThis(),
      head: jest.fn().mockResolvedValue({ count: 100, error: null }),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

jest.mock('../../src/i18n', () => ({
  useI18n: () => ({
    locale: 'pt',
    t: (key) => {
      const map = {
        'auth.heroTitle': 'Sua Nova Evolução no Treino',
        'auth.forgotPassword': 'Esqueceu a senha?',
        'auth.noAccountYet': 'Ainda não tem conta?',
        'auth.signup': 'Cadastre-se',
        'auth.orContinueWith': 'ou',
        'auth.login': 'ENTRAR',
        'common.error': 'Erro',
        'common.loading': 'Carregando...',
        'common.save': 'Salvar',
        'common.cancel': 'Cancelar',
      };
      return map[key] || key;
    },
    changeLocale: jest.fn(),
  }),
}));

jest.mock('../../src/context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}));

jest.mock('../../src/hooks/useLogin', () => ({
  __esModule: true,
  default: () => ({
    router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
    email: '', setEmail: jest.fn(),
    password: '', setPassword: jest.fn(),
    loading: false,
    handleLogin: jest.fn(),
    handleGoogle: jest.fn(),
    handleApple: jest.fn(),
    handleBiometrics: jest.fn(),
    error: null,
  }),
}));

jest.mock('../../src/hooks/useResponsive', () => ({
  useResponsive: () => ({ isSmall: false }),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name), props.children);
  const base = {
    Button: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    AuthInput: (props) => React.createElement(View, null, React.createElement(Text, null, props.label)),
    SocialButton: (props) => React.createElement(View, null, React.createElement(Text, null, props.label)),
    Input: (props) => React.createElement(View, null, React.createElement(Text, null, props.label)),
    Header: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

jest.mock('../../src/components/landing/HeroSection', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'HeroSection'));
});

jest.mock('../../src/components/landing/StatsRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'StatsRow'));
});

jest.mock('../../src/components/landing/FeaturesSection', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'FeaturesSection'));
});

jest.mock('../../src/components/landing/PlansPreview', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'PlansPreview'));
});

jest.mock('../../src/components/landing/TestimonialsSection', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'TestimonialsSection'));
});

jest.mock('../../src/components/landing/FaqSection', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'FaqSection'));
});

jest.mock('../../src/components/landing/CtaSection', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'CtaSection'));
});

import LoginScreen from '../../app/index';
import RegisterScreen from '../../app/register';
import LandingScreen from '../../app/landing';

describe('Screens - Round 8', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginScreen', () => {
    it('renders login form', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('ENTRAR')).toBeTruthy();
    });

    it('renders social buttons', () => {
      const { toJSON } = render(<LoginScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders forgot password link', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('Esqueceu a senha?')).toBeTruthy();
    });
  });

  describe('RegisterScreen', () => {
    it('renders register form', () => {
      const { getByText } = render(<RegisterScreen />);
      expect(getByText('CADASTRAR E CONTINUAR')).toBeTruthy();
    });

    it('renders name input', () => {
      const { getByText } = render(<RegisterScreen />);
      expect(getByText('NOME')).toBeTruthy();
    });
  });

  describe('LandingScreen', () => {
    it('renders landing components', () => {
      const { getByText } = render(<LandingScreen />);
      expect(getByText('HeroSection')).toBeTruthy();
      expect(getByText('StatsRow')).toBeTruthy();
      expect(getByText('FeaturesSection')).toBeTruthy();
    });
  });
});
