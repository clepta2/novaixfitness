import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true] }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props) => React.createElement('Ionicons', props) };
});
jest.mock('../../src/constants/shadows', () => ({ SHADOWS: { sm: {}, md: {}, lg: {} } }));
jest.mock('../../src/utils/responsive', () => ({ scale: (n) => n }));
jest.mock('../../src/styles', () => ({
  typography: { h5: {}, bodySmall: {}, caption: {}, label: {}, bodyMuted: {} },
  layout: { screen: {}, scroll: {}, header: {} },
}));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated = { ...RN.Animated, Value: jest.fn(() => ({ setValue: jest.fn(), interpolate: jest.fn(() => 0), addListener: jest.fn() })), timing: jest.fn(() => ({ start: jest.fn() })), spring: jest.fn(() => ({ start: jest.fn() })), parallel: jest.fn(() => ({ start: jest.fn() })), loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })), sequence: jest.fn(() => ({ start: jest.fn() })) };
  return RN;
});
jest.mock('react-native-svg', () => {
  const React = require('react');
  return { Svg: (props) => React.createElement('Svg', props), Circle: (props) => React.createElement('Circle', props), G: (props) => React.createElement('G', props), Defs: (props) => React.createElement('Defs', props), LinearGradient: (props) => React.createElement('LinearGradient', props), Stop: (props) => React.createElement('Stop', props), Line: (props) => React.createElement('Line', props), Polygon: (props) => React.createElement('Polygon', props), Text: (props) => React.createElement('Text', props) };
});

jest.mock('../../src/config/supabase', () => ({
  supabase: { from: jest.fn(() => ({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), order: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue({ data: [] }) })) },
}));
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' } }),
}));
jest.mock('../../src/services/mealAnalyzer', () => ({
  getDailySummary: jest.fn().mockResolvedValue({ calories: 1500, protein: 100, carbs: 200, fat: 50, fiber: 15, meals: 3 }),
  calculateNutritionGoals: jest.fn().mockReturnValue({ calories: 2000, protein: 150, carbs: 250, fat: 70, fiber: 30 }),
  getMealLogs: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../src/services/nutritionContent', () => ({
  getNutritionContent: jest.fn().mockResolvedValue(null),
  refreshNutritionContent: jest.fn().mockResolvedValue(null),
}));
jest.mock('../../src/services/autoSync', () => ({
  forceSyncNow: jest.fn().mockResolvedValue({ synced: 0, failed: 0 }),
}));

import NutritionTracker from '../../src/components/nutrition/NutritionTracker';
import MacroChart from '../../src/components/nutrition/MacroChart';
import MealHistory from '../../src/components/nutrition/MealHistory';
import FoodDatabase from '../../src/components/nutrition/FoodDatabase';
import FoodSwaps from '../../src/components/nutrition/FoodSwaps';
import NutritionTips from '../../src/components/nutrition/NutritionTips';
import NutritionChallenges from '../../src/components/nutrition/NutritionChallenges';
import NutritionMyths from '../../src/components/nutrition/NutritionMyths';
import BodyComposition from '../../src/components/nutrition/BodyComposition';
import BudgetMealPlanner from '../../src/components/nutrition/BudgetMealPlanner';
import CalorieCycling from '../../src/components/nutrition/CalorieCycling';
import EnergyTracker from '../../src/components/nutrition/EnergyTracker';
import MealPrepGuide from '../../src/components/nutrition/MealPrepGuide';

describe('Nutrition Components', () => {
  it('NutritionTracker imports correctly', () => {
    expect(NutritionTracker).toBeDefined();
  });

  it('MacroChart imports correctly', () => {
    expect(MacroChart).toBeDefined();
  });

  it('MealHistory imports correctly', () => {
    expect(MealHistory).toBeDefined();
  });

  it('FoodDatabase imports correctly', () => {
    expect(FoodDatabase).toBeDefined();
  });

  it('FoodSwaps imports correctly', () => {
    expect(FoodSwaps).toBeDefined();
  });

  it('NutritionTips imports correctly', () => {
    expect(NutritionTips).toBeDefined();
  });

  it('NutritionChallenges imports correctly', () => {
    expect(NutritionChallenges).toBeDefined();
  });

  it('NutritionMyths imports correctly', () => {
    expect(NutritionMyths).toBeDefined();
  });

  it('BodyComposition imports correctly', () => {
    expect(BodyComposition).toBeDefined();
  });

  it('BudgetMealPlanner imports correctly', () => {
    expect(BudgetMealPlanner).toBeDefined();
  });

  it('CalorieCycling imports correctly', () => {
    expect(CalorieCycling).toBeDefined();
  });

  it('EnergyTracker imports correctly', () => {
    expect(EnergyTracker).toBeDefined();
  });

  it('MealPrepGuide imports correctly', () => {
    expect(MealPrepGuide).toBeDefined();
  });
});

