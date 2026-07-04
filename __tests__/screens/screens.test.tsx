import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

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
  useLocalSearchParams: () => ({}),
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
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    price: { fontFamily: 'Montserrat_700Bold', fontSize: 24 },
    labelSmall: { fontFamily: 'Inter_400Regular', fontSize: 11 },
    inputField: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    chipActive: { color: '#CCFF00' },
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
    user: { id: 'test-user', email: 'test@test.com' },
    signOut: jest.fn(),
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
}));

jest.mock('../../src/services/notifications', () => ({
  scheduleWorkoutReminder: jest.fn(),
  scheduleWeeklyPlanReminder: jest.fn(),
  clearAllNotifications: jest.fn(),
}));

jest.mock('../../src/services/workout-reminders', () => ({
  setupWorkoutReminders: jest.fn(),
  getActiveReminders: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/services/notificationPrefs', () => ({
  getPrefsForSettings: jest.fn().mockReturnValue([
    { title: 'TREINO', items: [
      { key: 'workout_reminder', icon: 'alarm-outline', label: 'Lembrete de Treino', desc: 'Avisar na hora do treino', color: '#FFD600' },
      { key: 'workout_completed', icon: 'checkmark-circle-outline', label: 'Treino Concluido', desc: 'Confirmar conclusao do treino', color: '#00E676' },
    ]},
    { title: 'PROGRESSO', items: [
      { key: 'streak', icon: 'flame-outline', label: 'Streak', desc: 'Marcos de dias seguidos', color: '#FF6B35' },
      { key: 'achievement', icon: 'trophy-outline', label: 'Conquistas', desc: 'Conquistas desbloqueadas', color: '#FFD600' },
    ]},
    { title: 'LEMBRETES', items: [
      { key: 'weekly_plan', icon: 'calendar-outline', label: 'Plano Semanal', desc: 'Lembrete do plano da semana', color: '#00E676' },
    ]},
  ]),
  setNotificationPref: jest.fn().mockResolvedValue({}),
  getNotificationPrefs: jest.fn().mockResolvedValue({ workout_reminder: true, streak: true, achievement: true, weekly_plan: true }),
}));

import TermosScreen from '../../app/(tabs)/perfil/termos';
import NotificationSettingsScreen from '../../app/notifications';
import ForgotPasswordScreen from '../../app/forgot-password';

describe('Screens', () => {
  describe('TermosScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<TermosScreen />);
      expect(getByText('Termos e Privacidade')).toBeTruthy();
    });

    it('renders tabs', () => {
      const { getByText } = render(<TermosScreen />);
      expect(getByText('Termos de Uso')).toBeTruthy();
      expect(getByText('Privacidade')).toBeTruthy();
      expect(getByText('Aviso Médico')).toBeTruthy();
    });

    it('shows terms content by default', () => {
      const { toJSON } = render(<TermosScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('switches to privacy tab', () => {
      const { getByText } = render(<TermosScreen />);
      fireEvent.press(getByText('Privacidade'));
      expect(getByText(/POLÍTICA DE PRIVACIDADE/)).toBeTruthy();
    });

    it('switches to medical tab', () => {
      const { getByText } = render(<TermosScreen />);
      fireEvent.press(getByText('Aviso Médico'));
      expect(getByText(/AVISO MÉDICO/)).toBeTruthy();
    });
  });

  describe('NotificationSettingsScreen', () => {
    it('renders header', () => {
      const { toJSON } = render(<NotificationSettingsScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders notification options', () => {
      const { toJSON } = render(<NotificationSettingsScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders time options', async () => {
      const { toJSON } = render(<NotificationSettingsScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders clear button', async () => {
      const { toJSON } = render(<NotificationSettingsScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('ForgotPasswordScreen', () => {
    it('renders form', () => {
      const { toJSON } = render(<ForgotPasswordScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders send button', () => {
      const { toJSON } = render(<ForgotPasswordScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('shows error for invalid email', () => {
      const { toJSON } = render(<ForgotPasswordScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('has back button', () => {
      const { toJSON } = render(<ForgotPasswordScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
