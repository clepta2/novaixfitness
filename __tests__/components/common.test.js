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

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/utils/animations', () => ({
  useFadeInUp: () => ({
    opacity: { setValue: jest.fn(), interpolate: jest.fn() },
    translateY: { setValue: jest.fn(), interpolate: jest.fn() },
  }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

jest.mock('../../src/services/offline', () => ({
  getPendingActions: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../../src/services/autoSync', () => ({
  forceSyncNow: jest.fn(() => Promise.resolve({ synced: 0, failed: 0 })),
}));

import OfflineBanner from '../../src/components/common/OfflineBanner';

describe('Common Components', () => {
  describe('OfflineBanner', () => {
    it('renders nothing when not visible', () => {
      const { toJSON } = render(<OfflineBanner visible={false} />);
      expect(toJSON()).toBeNull();
    });

    it('shows offline text when visible', () => {
      const { getByText } = render(<OfflineBanner visible={true} pendingCount={0} />);
      expect(getByText('Modo offline')).toBeTruthy();
    });

    it('shows pending count when > 0', () => {
      const { getByText } = render(<OfflineBanner visible={true} pendingCount={3} />);
      expect(getByText('3 pendente(s)')).toBeTruthy();
    });

    it('shows sync button when pendingCount > 0', () => {
      const onSync = jest.fn();
      const { getByText } = render(<OfflineBanner visible={true} pendingCount={2} onSync={onSync} />);
      expect(getByText('2 pendente(s)')).toBeTruthy();
    });

    it('hides pending count when 0', () => {
      const { queryByText } = render(<OfflineBanner visible={true} pendingCount={0} />);
      expect(queryByText('0 pendente(s)')).toBeNull();
    });
  });
});
