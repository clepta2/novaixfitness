import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
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
    user: { id: 'test-user', email: 'test@test.com' },
    signOut: jest.fn(),
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { name: 'Atleta', email: 'test@test.com', app_settings: {} }, error: null }),
      update: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

jest.mock('../../src/services/share', () => ({
  shareProgress: jest.fn(),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ProfileCard: (props) => React.createElement(View, null, React.createElement(Text, null, 'ProfileCard')),
    SettingsGroup: (props) => React.createElement(View, null, React.createElement(Text, null, 'SettingsGroup'), props.children),
    MenuSection: (props) => React.createElement(View, null, React.createElement(Text, null, 'MenuSection'), props.children),
    OfflineSettings: (props) => React.createElement(View, null, React.createElement(Text, null, 'OfflineSettings')),
    TutorialOverlay: (props) => null,
  };
});

import SettingsScreen from '../../app/settings';

describe('Settings Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings screen', () => {
    const { toJSON } = render(<SettingsScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders profile card', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('ProfileCard')).toBeTruthy();
  });

  it('renders settings groups', () => {
    const { getAllByText } = render(<SettingsScreen />);
    expect(getAllByText('SettingsGroup').length).toBeGreaterThan(0);
  });

  it('renders menu sections', () => {
    const { getAllByText } = render(<SettingsScreen />);
    expect(getAllByText('MenuSection').length).toBeGreaterThan(0);
  });

  it('renders offline settings', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('OfflineSettings')).toBeTruthy();
  });
});
