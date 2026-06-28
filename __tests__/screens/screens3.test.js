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

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn().mockResolvedValue(true),
  openURL: jest.fn().mockResolvedValue({}),
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
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    chipActive: { color: '#CCFF00' },
    cardDate: { fontFamily: 'Inter_400Regular', fontSize: 12 },
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
    user: { id: 'test-user', email: 'test@test.com' },
    signOut: jest.fn(),
  }),
}));

jest.mock('../../src/services/progress-photos', () => ({
  pickImage: jest.fn().mockResolvedValue(null),
  takePhoto: jest.fn().mockResolvedValue(null),
  uploadProgressPhoto: jest.fn().mockResolvedValue({}),
  getProgressPhotos: jest.fn().mockResolvedValue([]),
  deleteProgressPhoto: jest.fn().mockResolvedValue({}),
  PHOTO_LABELS: ['Frente', 'Lado', 'Costas'],
}));

jest.mock('../../src/data/links', () => ({
  socialLinks: [
    { label: 'Instagram', icon: 'logo-instagram', url: 'https://instagram.com', color: '#E1306C' },
    { label: 'TikTok', icon: 'logo-tiktok', url: 'https://tiktok.com', color: '#000000' },
  ],
  otherLinks: [
    { label: 'Site', icon: 'globe-outline', url: 'https://novaixfitness.com' },
  ],
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const mock = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  return {
    Header: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    ReferralCard: () => React.createElement(View, null, React.createElement(Text, null, 'ReferralCard')),
    CompareView: mock('CompareView'),
    PhotoGrid: mock('PhotoGrid'),
    PhotoModal: mock('PhotoModal'),
    PhotoPicker: mock('PhotoPicker'),
  };
});

jest.mock('../../src/components/progress/CompareView', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'CompareView'));
});

jest.mock('../../src/components/progress/PhotoGrid', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'PhotoGrid'));
});

jest.mock('../../src/components/progress/PhotoModal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null);
});

jest.mock('../../src/components/progress/PhotoPicker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'PhotoPicker'));
});

import ConhecaNosScreen from '../../app/(tabs)/perfil/conheca-nos';
import LinksScreen from '../../app/(tabs)/perfil/links';
import ProgressPhotosScreen from '../../app/progress-photos';

describe('Screens - Round 3', () => {
  describe('ConhecaNosScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<ConhecaNosScreen />);
      expect(getByText('CONHEÇA-NOS')).toBeTruthy();
    });

    it('renders brand name', () => {
      const { getByText } = render(<ConhecaNosScreen />);
      expect(getByText('NOVAIX FITNESS')).toBeTruthy();
    });

    it('renders tagline', () => {
      const { getByText } = render(<ConhecaNosScreen />);
      expect(getByText('Sua Nova Evolução no Treino')).toBeTruthy();
    });

    it('renders mission', () => {
      const { getByText } = render(<ConhecaNosScreen />);
      expect(getByText('NOSSA MISSÃO')).toBeTruthy();
    });

    it('renders values', () => {
      const { getByText } = render(<ConhecaNosScreen />);
      expect(getByText('Paixão')).toBeTruthy();
      expect(getByText('Comunidade')).toBeTruthy();
      expect(getByText('Excelência')).toBeTruthy();
      expect(getByText('Acessibilidade')).toBeTruthy();
    });

    it('renders stats', () => {
      const { getByText } = render(<ConhecaNosScreen />);
      expect(getByText('10K+')).toBeTruthy();
      expect(getByText('500+')).toBeTruthy();
      expect(getByText('50+')).toBeTruthy();
    });
  });

  describe('LinksScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<LinksScreen />);
      expect(getByText('LINKS')).toBeTruthy();
    });

    it('renders subtitle', () => {
      const { getByText } = render(<LinksScreen />);
      expect(getByText('Siga-nos nas redes sociais')).toBeTruthy();
    });

    it('renders social links', () => {
      const { getByText } = render(<LinksScreen />);
      expect(getByText('Instagram')).toBeTruthy();
      expect(getByText('TikTok')).toBeTruthy();
    });

    it('renders other links', () => {
      const { getByText } = render(<LinksScreen />);
      expect(getByText('Site')).toBeTruthy();
    });

    it('renders referral section', () => {
      const { getByText } = render(<LinksScreen />);
      expect(getByText('Indique um amigo')).toBeTruthy();
    });

    it('opens referral modal', () => {
      const { getByText } = render(<LinksScreen />);
      fireEvent.press(getByText('Indique um amigo'));
      expect(getByText('INDICAÇÃO')).toBeTruthy();
    });
  });

  describe('ProgressPhotosScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<ProgressPhotosScreen />);
      expect(getByText('Fotos de Progresso')).toBeTruthy();
    });

    it('renders label chips', () => {
      const { getByText } = render(<ProgressPhotosScreen />);
      expect(getByText('Frente')).toBeTruthy();
      expect(getByText('Lado')).toBeTruthy();
      expect(getByText('Costas')).toBeTruthy();
    });

    it('renders PhotoGrid', () => {
      const { getByText } = render(<ProgressPhotosScreen />);
      expect(getByText('PhotoGrid')).toBeTruthy();
    });

    it('renders all photos section', () => {
      const { getByText } = render(<ProgressPhotosScreen />);
      expect(getByText('TODAS AS FOTOS')).toBeTruthy();
    });
  });
});
