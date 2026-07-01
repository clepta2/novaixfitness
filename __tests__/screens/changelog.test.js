import React from 'react';
import { render } from '@testing-library/react-native';
import ChangelogScreen from '../../app/changelog';

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
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
    h3: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 24, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    section: { marginBottom: 24 },
  },
}));

jest.mock('../../src/components/changelog/ChangelogItem', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ version, date, changes }) => (
      <View testID={`changelog-${version}`}>
        <Text>{`v${version}`}</Text>
        <Text>{date}</Text>
        {changes.map((c, i) => <Text key={i}>{c.text}</Text>)}
      </View>
    ),
  };
});

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ErrorBoundary: (props) => React.createElement(View, null, props.children),
    ChangelogItem: ({ version, date, changes }) => (
      React.createElement(View, { testID: `changelog-${version}` },
        React.createElement(Text, null, `v${version}`),
        React.createElement(Text, null, date),
        changes.map((c, i) => React.createElement(Text, { key: i }, c.text))
      )
    ),
  };
});

describe('ChangelogScreen', () => {
  it('renders title', () => {
    const { getByText } = render(<ChangelogScreen />);
    expect(getByText('O QUE HÁ DE NOVO?')).toBeTruthy();
  });

  it('renders subtitle', () => {
    const { getByText } = render(<ChangelogScreen />);
    expect(getByText(/Acompanhe as novidades/)).toBeTruthy();
  });

  it('renders all version entries', () => {
    const { getByText } = render(<ChangelogScreen />);
    expect(getByText('v1.2.0')).toBeTruthy();
    expect(getByText('v1.1.0')).toBeTruthy();
    expect(getByText('v1.0.1')).toBeTruthy();
    expect(getByText('v1.0.0')).toBeTruthy();
  });

  it('renders changelog items with changes', () => {
    const { getByText } = render(<ChangelogScreen />);
    expect(getByText('Coach IA com Gemini para treinos personalizados')).toBeTruthy();
    expect(getByText('Lançamento oficial do NOVAIX FITNESS')).toBeTruthy();
  });

  it('renders dates', () => {
    const { getByText } = render(<ChangelogScreen />);
    expect(getByText('Jun 2026')).toBeTruthy();
    expect(getByText('Mai 2026')).toBeTruthy();
    expect(getByText('Abr 2026')).toBeTruthy();
    expect(getByText('Mar 2026')).toBeTruthy();
  });
});
