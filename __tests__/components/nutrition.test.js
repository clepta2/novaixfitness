import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native-chart-kit', () => ({
  PieChart: 'PieChart',
  LineChart: 'LineChart',
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

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
  }),
}));

jest.mock('../../src/services/mealAnalyzerService', () => ({
  getDailySummary: jest.fn().mockResolvedValue({ calories: 1800, protein: 120, carbs: 200, fat: 60 }),
  calculateNutritionGoals: jest.fn().mockReturnValue({ calories: 2200, protein: 150, carbs: 250, fat: 70 }),
}));

import NutritionTracker from '../../src/components/nutrition/NutritionTracker';

describe('Nutrition Components', () => {
  describe('NutritionTracker', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<NutritionTracker userId="u1" />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
