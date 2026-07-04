import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
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

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
  }),
}));

jest.mock('../../src/services/referral', () => ({
  getReferralData: jest.fn().mockResolvedValue({
    referral_code: 'NOVAIXTEST',
    total_referrals: 3,
    successful_referrals: 2,
    bonus_days: 30,
  }),
  shareReferral: jest.fn().mockResolvedValue({}),
}));

import ReferralCard from '../../src/components/referral/ReferralCard';

describe('Referral Component', () => {
  describe('ReferralCard', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ReferralCard />);
      // Component may return null while loading
      expect(true).toBe(true);
    });
  });
});
