import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

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
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useLocalSearchParams: () => ({ id: 'demo' }),
}));

jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwakeAsync: jest.fn(),
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
    h3: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    h4: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 24, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerBtn: { width: 40, height: 40 },
    section: { marginBottom: 24 },
    footer: { padding: 24 },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    saveOnboarding: jest.fn().mockResolvedValue({}),
    onboarding: {},
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

jest.mock('../../src/services/workoutSaver', () => ({
  saveCompleteWorkout: jest.fn().mockResolvedValue({ xpGained: 50 }),
}));

jest.mock('../../src/services/share', () => ({
  shareWorkout: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/services/audioService', () => ({
  loadSounds: jest.fn().mockResolvedValue({}),
  unloadSounds: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/hooks/useWorkoutTimer', () => {
  return () => ({
    time: 0,
    formatTime: () => '00:00',
    isRunning: false,
    isPaused: false,
    start: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    reset: jest.fn(),
    progress: 0,
    currentExercise: 0,
    currentSet: 0,
    isResting: false,
    restTime: 0,
  });
});

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Card: (props) => React.createElement(View, null, props.children),
    Button: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    ProgressBar: (props) => React.createElement(View, null),
    WorkoutTimer: (props) => React.createElement(View, null, React.createElement(Text, null, 'WorkoutTimer')),
    ExerciseProgress: (props) => React.createElement(View, null, React.createElement(Text, null, 'ExerciseProgress')),
    RestOverlay: (props) => React.createElement(View, null),
    WorkoutControls: (props) => React.createElement(View, null, React.createElement(Text, null, 'WorkoutControls')),
    RatingModal: (props) => React.createElement(View, null),
  };
});

import GoalScreen from '../../app/onboarding/objetivo';
import GenderScreen from '../../app/onboarding/genero';
import PlayerScreen from '../../app/player';

describe('Screens - Round 9', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GoalScreen', () => {
    it('renders goal options', () => {
      const { getByText } = render(<GoalScreen />);
      expect(getByText('Emagrecimento')).toBeTruthy();
      expect(getByText('Ganho de Massa')).toBeTruthy();
      expect(getByText('Condicionamento')).toBeTruthy();
    });

    it('renders header', () => {
      const { getByText } = render(<GoalScreen />);
      expect(getByText('O QUE VOCÊ BUSCA HOJE?')).toBeTruthy();
    });
  });

  describe('GenderScreen', () => {
    it('renders gender options', () => {
      const { getByText } = render(<GenderScreen />);
      expect(getByText('Masculino')).toBeTruthy();
      expect(getByText('Feminino')).toBeTruthy();
    });

    it('renders header', () => {
      const { getByText } = render(<GenderScreen />);
      expect(getByText('QUAL SEU GÊNERO?')).toBeTruthy();
    });
  });

  describe('PlayerScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<PlayerScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
