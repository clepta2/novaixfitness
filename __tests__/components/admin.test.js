import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

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
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

import AdminDashboard from '../../src/components/admin/AdminDashboard';

describe('Admin Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AdminDashboard', () => {
    it('renders admin dashboard', () => {
      const { toJSON } = render(<AdminDashboard />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders stats cards', () => {
      const { getByText } = render(<AdminDashboard />);
      expect(getByText('TOTAL ALUNOS')).toBeTruthy();
      expect(getByText('ATIVOS')).toBeTruthy();
      expect(getByText('NOVOS/MÊS')).toBeTruthy();
      expect(getByText('TREINOS')).toBeTruthy();
    });
  });
});
