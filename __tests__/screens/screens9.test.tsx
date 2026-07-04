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

jest.mock('../../src/components/onboarding/DraggableSlider', () => {
  const React = require('react');
  return { __esModule: true, default: (props) => React.createElement('DraggableSlider', props) };
});

jest.mock('../../src/components/onboarding/MiniCalendar', () => {
  const React = require('react');
  return { __esModule: true, default: (props) => React.createElement('MiniCalendar', props) };
});

jest.mock('../../src/components/onboarding/StatePickerModal', () => {
  const React = require('react');
  return { __esModule: true, default: (props) => React.createElement('StatePickerModal', props) };
});

jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwake: jest.fn(),
  default: { activateKeepAwakeAsync: jest.fn(), deactivateKeepAwakeAsync: jest.fn(), deactivateKeepAwake: jest.fn() },
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

jest.mock('../../src/i18n', () => ({
  __esModule: true,
  default: { t: (key) => key },
  useI18n: () => ({
    t: (key) => {
      const map = {
        'onboarding.goalTitle': 'O QUE VOCÊ BUSCA HOJE?',
        'onboarding.goalSubtitle': 'Escolha seu objetivo',
        'onboarding.goalOptions.weight_loss': 'Emagrecimento',
        'onboarding.goalOptions.weight_loss_desc': 'Perder peso de forma saudável',
        'onboarding.goalOptions.muscle_gain': 'Ganho de Massa',
        'onboarding.goalOptions.muscle_gain_desc': 'Construir músculos',
        'onboarding.goalOptions.fitness': 'Condicionamento',
        'onboarding.goalOptions.fitness_desc': 'Melhorar resistência',
        'onboarding.goalOptions.flexibility': 'Flexibilidade',
        'onboarding.goalOptions.flexibility_desc': 'Alongamento e mobilidade',
        'onboarding.goalNext': 'PRÓXIMO',
        'onboarding.levelStep': 'PASSO 3 DE 3',
        'onboarding.levelTitle': 'QUAL SEU NÍVEL ATUAL?',
        'onboarding.levelSubtitle': 'Escolha seu nível',
        'onboarding.levelFinalize': 'PRÓXIMO',
      };
      return map[key] || key;
    },
  }),
}));

jest.mock('../../src/hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({ isSmall: false, horizontalPadding: 20 }),
  useResponsive: () => ({ isSmall: false, horizontalPadding: 20 }),
}));

jest.mock('../../src/utils/animations', () => ({
  useStaggeredEntry: () => [0, 1, 2, 3],
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

jest.mock('../../src/services/voiceCoach', () => ({
  isVoiceCoachEnabled: jest.fn().mockReturnValue(false),
  setVoiceCoachEnabled: jest.fn(),
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
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name), props.children);
  const base = {
    Card: (props) => React.createElement(View, null, props.children),
    Button: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    ProgressBar: (props) => React.createElement(View, null),
    WorkoutTimer: (props) => React.createElement(View, null, React.createElement(Text, null, 'WorkoutTimer')),
    ExerciseProgress: (props) => React.createElement(View, null, React.createElement(Text, null, 'ExerciseProgress')),
    RestOverlay: (props) => React.createElement(View, null),
    WorkoutControls: (props) => React.createElement(View, null, React.createElement(Text, null, 'WorkoutControls')),
    RatingModal: (props) => React.createElement(View, null),
    TutorialOverlay: (props) => React.createElement(View, null),
    OnboardingFooter: (props) => React.createElement(View, null,
      React.createElement(Text, { onPress: props.onBack }, props.backLabel || 'ANTERIOR'),
      React.createElement(Text, { onPress: props.onNext }, props.nextLabel || 'PRÓXIMO')
    ),
    Input: (props) => React.createElement(View, null),
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

jest.mock('../../src/hooks/useTutorial', () => ({
  useTutorial: () => ({
    visible: false,
    steps: [],
    handleComplete: jest.fn(),
    handleSkip: jest.fn(),
  }),
}));

import GoalScreen from '../../app/onboarding/index';
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
  });

  describe('PlayerScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<PlayerScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
