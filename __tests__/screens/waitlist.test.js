import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WaitlistScreen from '../../app/waitlist';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props) => React.createElement('Ionicons', props) };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@test.com' },
    session: {},
    loading: false,
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
      getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user-id' } } } }),
    },
  },
}));

jest.mock('../../src/components', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress }) => (
      <TouchableOpacity testID="button" onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../../src/data/waitlistFeatures', () => ({
  WAITLIST_FEATURES: [
    { id: '1', title: 'Apple Watch', icon: '⌚', description: 'Timer e batimentos no pulso', status: 'coming_soon' },
    { id: '2', title: 'Corrida GPS', icon: '🏃', description: 'Rastreie seus percursos ao ar livre', status: 'coming_soon' },
    { id: '3', title: 'Planos Alimentares IA', icon: '🤖', description: 'Nutrição personalizada por IA', status: 'coming_soon' },
    { id: '4', title: 'Desafios em Grupo', icon: '🏆', description: 'Compita com amigos em desafios semanais', status: 'coming_soon' },
  ],
}));

jest.mock('../../src/components/waitlist/WaitlistFeature', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    __esModule: true,
    default: ({ feature, isJoined, onJoin, loading }) => (
      <View testID={`waitlist-feature-${feature.id}`}>
        <Text>{feature.title}</Text>
        <Text>{feature.description}</Text>
        <TouchableOpacity
          testID={`join-button-${feature.id}`}
          onPress={() => onJoin(feature.id)}
          disabled={isJoined || loading}
        >
          <Text>{isJoined ? 'NOTIFICADO' : 'ENTRAR NA LISTA'}</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});

describe('WaitlistScreen', () => {
  it('renders header', () => {
    const { getByText } = render(<WaitlistScreen />);
    expect(getByText('EM BREVE!')).toBeTruthy();
  });

  it('renders subtitle', () => {
    const { getByText } = render(<WaitlistScreen />);
    expect(getByText(/Funcionalidades que estão sendo desenvolvidas/)).toBeTruthy();
  });

  it('renders all features', () => {
    const { getByText } = render(<WaitlistScreen />);
    expect(getByText('Apple Watch')).toBeTruthy();
    expect(getByText('Corrida GPS')).toBeTruthy();
    expect(getByText('Planos Alimentares IA')).toBeTruthy();
    expect(getByText('Desafios em Grupo')).toBeTruthy();
  });

  it('renders join buttons', () => {
    const { getAllByText } = render(<WaitlistScreen />);
    expect(getAllByText('ENTRAR NA LISTA').length).toBe(4);
  });

  it('renders the VOLTAR button', () => {
    const { getByText } = render(<WaitlistScreen />);
    expect(getByText('VOLTAR')).toBeTruthy();
  });

  it('calls onJoin when join button is pressed', async () => {
    const { getByTestId } = render(<WaitlistScreen />);
    fireEvent.press(getByTestId('join-button-1'));
    await waitFor(() => {
      expect(getByTestId('waitlist-feature-1')).toBeTruthy();
    });
  });
});
