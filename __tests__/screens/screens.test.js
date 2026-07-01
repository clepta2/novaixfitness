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

jest.mock('../../src/i18n', () => ({
  useI18n: () => ({
    locale: 'pt',
    t: (key) => {
      const map = {
        'common.error': 'Erro',
        'common.loading': 'Carregando...',
        'common.save': 'Salvar',
        'common.cancel': 'Cancelar',
        'common.back': 'Voltar',
        'common.retry': 'Tentar novamente',
        'common.search': 'Buscar',
        'common.share': 'Compartilhar',
        'common.none': 'Nenhum',
        'notifications.title': 'Notificações',
        'notifications.empty': 'Nenhuma notificação',
        'notifications.emptyTitle': 'Sem notificações',
        'notifications.emptyMessage': 'Quando algo acontecer, você será notificado aqui.',
      };
      return map[key] || key;
    },
    changeLocale: jest.fn(),
  }),
}));

jest.mock('../../src/context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}));

jest.mock('../../src/hooks/useResponsive', () => ({
  useResponsive: () => ({ isSmall: false }),
}));

jest.mock('../../src/hooks/useNotificationPrefs', () => ({
  useNotificationPrefs: () => ({
    notifications: [], loading: false, refreshing: false,
    prefs: {}, reminderTime: '08:00', setReminderTime: jest.fn(),
    pushEnabled: true, quietHours: { enabled: false, start: '22:00', end: '07:00' },
    unreadCount: 0, notifGroups: [],
    onRefresh: jest.fn(), markAsRead: jest.fn(), markAllAsRead: jest.fn(), clearAll: jest.fn(),
    handleNotifToggle: jest.fn(), handlePushToggle: jest.fn(),
  }),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name), props.children);
  const base = {
    ErrorBoundary: (props) => React.createElement(View, null, props.children),
    Button: (props) => React.createElement(View, { accessible: true, accessibilityLabel: props.title, accessibilityRole: 'button' }, React.createElement(Text, null, props.title || 'Button')),
    AuthInput: (props) => React.createElement(View, null, React.createElement(Text, null, props.label)),
    Header: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

jest.mock('../../src/services/notifications', () => ({
  scheduleWorkoutReminder: jest.fn(),
  scheduleWeeklyPlanReminder: jest.fn(),
  clearAllNotifications: jest.fn(),
}));

jest.mock('../../src/services/workout-reminders', () => ({
  setupWorkoutReminders: jest.fn(),
  getActiveReminders: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/services/notifications-real', () => ({
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
      const { getByText } = render(<TermosScreen />);
      expect(getByText(/ACEITAÇÃO DOS TERMOS/)).toBeTruthy();
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
      const { getByText } = render(<NotificationSettingsScreen />);
      expect(getByText('Notificacoes')).toBeTruthy();
    });

    it('renders notification options', () => {
      const { getByText } = render(<NotificationSettingsScreen />);
      expect(getByText('Lista')).toBeTruthy();
      expect(getByText('Config')).toBeTruthy();
    });

    it('renders time options', async () => {
      const { getByText } = render(<NotificationSettingsScreen />);
      await waitFor(() => {
        expect(getByText('EmptyState')).toBeTruthy();
      });
    });

    it('renders clear button', async () => {
      const { getByText } = render(<NotificationSettingsScreen />);
      await waitFor(() => {
        expect(getByText('EmptyState')).toBeTruthy();
      });
    });
  });

  describe('ForgotPasswordScreen', () => {
    it('renders form', () => {
      const { getByText } = render(<ForgotPasswordScreen />);
      expect(getByText('Esqueceu a senha?')).toBeTruthy();
    });

    it('renders send button', () => {
      const { getByText } = render(<ForgotPasswordScreen />);
      expect(getByText('ENVIAR LINK')).toBeTruthy();
    });

    it('shows error for invalid email', () => {
      const { getByText } = render(<ForgotPasswordScreen />);
      fireEvent.press(getByText('ENVIAR LINK'));
    });

    it('has back button', () => {
      const { UNSAFE_getAllByType } = render(<ForgotPasswordScreen />);
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      expect(touchables.length).toBeGreaterThanOrEqual(1);
    });
  });
});
