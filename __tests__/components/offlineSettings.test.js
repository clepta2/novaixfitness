import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
}));

jest.mock('../../src/services/cache', () => ({
  getCacheInfo: jest.fn(() => Promise.resolve({ totalSize: 1024 * 100, breakdown: { workouts: { size: 1024 } }, withinLimit: true })),
  clearAllCache: jest.fn(() => Promise.resolve({})),
  clearWorkoutCache: jest.fn(() => Promise.resolve({})),
}));

jest.mock('../../src/services/offline', () => ({
  getLastSync: jest.fn(() => Promise.resolve(Date.now() - 3600000)),
  getPendingActions: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../../src/services/autoSync', () => ({
  forceSyncNow: jest.fn(() => Promise.resolve({ synced: 5 })),
}));

jest.mock('../../src/hooks/useNetworkStatus', () => {
  return function useNetworkStatus() { return { isOnline: true, isConnected: true }; };
});

import OfflineSettings from '../../src/components/settings/OfflineSettings';

describe('OfflineSettings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders offline settings', async () => {
    const { getByText } = render(<OfflineSettings />);
    await waitFor(() => {
      expect(getByText('DADOS OFFLINE')).toBeTruthy();
    });
  });

  it('renders cache info after load', async () => {
    const { getByText } = render(<OfflineSettings />);
    await waitFor(() => {
      expect(getByText('Cache')).toBeTruthy();
    });
  });

  it('renders sync status after load', async () => {
    const { getByText } = render(<OfflineSettings />);
    await waitFor(() => {
      expect(getByText('Último Sync')).toBeTruthy();
    });
  });

  it('renders pending actions after load', async () => {
    const { getByText } = render(<OfflineSettings />);
    await waitFor(() => {
      expect(getByText('Pendentes')).toBeTruthy();
    });
  });

  it('renders sync button after load', async () => {
    const { getByText } = render(<OfflineSettings />);
    await waitFor(() => {
      expect(getByText('Sincronizar')).toBeTruthy();
    });
  });

  it('renders cache management buttons after load', async () => {
    const { getByText } = render(<OfflineSettings />);
    await waitFor(() => {
      expect(getByText('Limpar Treinos')).toBeTruthy();
      expect(getByText('Limpar Tudo')).toBeTruthy();
    });
  });
});
