import React from 'react';
import { render } from '@testing-library/react-native';
import PlannerScreen from '../../app/planner';

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

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1' }, profile: {} }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ data: null })),
            })),
          })),
        })),
      })),
    })),
  },
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12 },
    h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 20, paddingTop: 54 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  },
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  const base = {
    ErrorBoundary: ({ children }) => children,
    WeekCalendar: ({ weekPlan, onDayPress }) => (
      <View testID="week-calendar">
        <Text>WeekCalendar</Text>
      </View>
    ),
    AdaptationBanner: () => React.createElement(View, null),
    DayEditorModal: () => React.createElement(View, null),
    DayDetailView: Stub('DayDetailView'),
    TodayCard: Stub('TodayCard'),
    WeekOverview: Stub('WeekOverview'),
  };
  return new Proxy(base, { get: (t, k) => t[k] || Stub(String(k)) });
});

jest.mock('../../src/services/planService', () => ({
  loadWeeklyPlan: jest.fn().mockResolvedValue(null),
  updateDayPlan: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/services/planAdaptation', () => ({
  shouldAdaptPlan: jest.fn().mockResolvedValue(false),
  getAdaptationReason: jest.fn().mockResolvedValue(null),
}));

jest.mock('../../src/data/weekPlan', () => ({
  defaultWeekPlan: {
    mon: { workoutId: '1', workoutName: 'Peito e Tríceps', duration: 50, category: 'MUSCULAÇÃO', isRest: false },
    tue: { workoutId: '2', workoutName: 'HIIT Queima', duration: 30, category: 'CARDIO', isRest: false },
    wed: { workoutId: '3', workoutName: 'Costas e Bíceps', duration: 50, category: 'MUSCULAÇÃO', isRest: false },
    thu: { workoutId: null, workoutName: null, duration: 0, category: null, isRest: true },
    fri: { workoutId: '1', workoutName: 'Pernas', duration: 55, category: 'MUSCULAÇÃO', isRest: false },
    sat: { workoutId: '2', workoutName: 'Cardio Leve', duration: 25, category: 'CARDIO', isRest: false },
    sun: { workoutId: null, workoutName: null, duration: 0, category: null, isRest: true },
  },
  DAY_NAMES_FULL: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
  DAY_KEYS: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  CATEGORY_COLORS: { 'MUSCULAÇÃO': '#6366F1', CARDIO: '#FF6B35' },
}));

describe('PlannerScreen', () => {
  it('renders title', () => {
    const { getByText } = render(<PlannerScreen />);
    expect(getByText('PLANEJADOR')).toBeTruthy();
  });

  it('renders week calendar component', () => {
    const { getByTestId } = render(<PlannerScreen />);
    expect(getByTestId('week-calendar')).toBeTruthy();
  });

  it('renders stats row with workouts count', () => {
    const { getByText } = render(<PlannerScreen />);
    expect(getByText('Treinos')).toBeTruthy();
    expect(getByText('Minutos')).toBeTruthy();
    expect(getByText('Descansos')).toBeTruthy();
  });

  it('calculates correct total workouts', () => {
    const { getByText } = render(<PlannerScreen />);
    expect(getByText('5')).toBeTruthy();
  });

  it('calculates correct total minutes', () => {
    const { getByText } = render(<PlannerScreen />);
    expect(getByText('210')).toBeTruthy();
  });

  it('calculates correct rest days', () => {
    const { getByText } = render(<PlannerScreen />);
    expect(getByText('2')).toBeTruthy();
  });

  it('renders weekly overview section', () => {
    const { getByText } = render(<PlannerScreen />);
    expect(getByText('WeekOverview')).toBeTruthy();
  });

  it('renders today section', () => {
    const { getByText } = render(<PlannerScreen />);
    expect(getByText('TodayCard')).toBeTruthy();
  });
});
