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
    subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    cardStatText: { fontFamily: 'Inter_400Regular', fontSize: 12 },
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
      single: jest.fn().mockResolvedValue({ data: { physical_data: { height: 175 } }, error: null }),
      update: jest.fn().mockReturnThis(),
    })),
  },
}));

jest.mock('../../src/services/csv-export', () => ({
  exportWorkoutHistory: jest.fn().mockResolvedValue({}),
  exportProgressData: jest.fn().mockResolvedValue({}),
  exportAnalyticsData: jest.fn().mockResolvedValue({}),
  exportAchievements: jest.fn().mockResolvedValue({}),
  exportProfileData: jest.fn().mockResolvedValue({}),
  exportChatHistory: jest.fn().mockResolvedValue({}),
  exportAllData: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/services/body-measurements', () => ({
  saveMeasurement: jest.fn().mockResolvedValue({}),
  getMeasurements: jest.fn().mockResolvedValue([]),
  getLatestMeasurement: jest.fn().mockResolvedValue({ weight: 75, chest: 100, waist: 80, hips: 95, arms: 35, thighs: 55, body_fat: 18, recorded_at: new Date().toISOString() }),
  getMeasurementHistory: jest.fn().mockResolvedValue([]),
  deleteMeasurement: jest.fn().mockResolvedValue({}),
  calculateBMI: jest.fn().mockReturnValue('22.5'),
  getBMICategory: jest.fn().mockReturnValue({ label: 'Normal', color: '#00E676' }),
}));

jest.mock('../../src/services/lgpd', () => ({
  downloadUserData: jest.fn().mockResolvedValue({}),
  deleteAccount: jest.fn().mockResolvedValue({}),
  getConsentSettings: jest.fn().mockResolvedValue({ marketing: true, analytics: true, thirdParty: false }),
  updateConsentSettings: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/components/progress/MeasurementForm', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'MeasurementForm'));
});

jest.mock('../../src/components/progress/BMICard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'BMICard'));
});

jest.mock('../../src/components/progress/MeasurementChart', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'MeasurementChart'));
});

jest.mock('../../src/components/progress/MeasurementHistory', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'MeasurementHistory'));
});

jest.mock('../../src/components/settings/DataActions', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'DataActions'));
});

jest.mock('../../src/components/settings/ConsentToggles', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'ConsentToggles'));
});

jest.mock('../../src/components/settings/RightsList', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'RightsList'));
});

import ExportDataScreen from '../../app/export-data';
import BodyMeasuresScreen from '../../app/body-measures';
import LGPDScreen from '../../app/(tabs)/perfil/lgpd';

describe('Screens - Round 2', () => {
  describe('ExportDataScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<ExportDataScreen />);
      expect(getByText('Exportar Dados')).toBeTruthy();
    });

    it('renders export options', () => {
      const { getByText } = render(<ExportDataScreen />);
      expect(getByText('Historico de Treinos')).toBeTruthy();
      expect(getByText('Dados de Progresso')).toBeTruthy();
      expect(getByText('Analytics Detalhado')).toBeTruthy();
      expect(getByText('Conquistas')).toBeTruthy();
    });

    it('renders filenames', () => {
      const { getByText } = render(<ExportDataScreen />);
      expect(getByText('novaix_historico_treinos.csv')).toBeTruthy();
    });

    it('renders info box', () => {
      const { getByText } = render(<ExportDataScreen />);
      expect(getByText(/arquivos CSV sao compativeis/)).toBeTruthy();
    });
  });

  describe('BodyMeasuresScreen', () => {
    it('renders header', async () => {
      const { getByText } = render(<BodyMeasuresScreen />);
      await waitFor(() => {
        expect(getByText('Medidas Corporais')).toBeTruthy();
      });
    });

    it('shows empty state when no measurements', async () => {
      const { getByText } = render(<BodyMeasuresScreen />);
      await waitFor(() => {
        expect(getByText('Nenhuma medida registrada')).toBeTruthy();
      });
    });

    it('renders chart selector', async () => {
      const { getByText } = render(<BodyMeasuresScreen />);
      await waitFor(() => {
        expect(getByText('MeasurementChart')).toBeTruthy();
      });
    });
  });

  describe('LGPDScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<LGPDScreen />);
      expect(getByText('Privacidade (LGPD)')).toBeTruthy();
    });

    it('renders subtitle', () => {
      const { getByText } = render(<LGPDScreen />);
      expect(getByText('Seus Dados, Seu Controle')).toBeTruthy();
    });

    it('renders DPO info', () => {
      const { getByText } = render(<LGPDScreen />);
      expect(getByText('DPO: dpo@novaixfitness.com')).toBeTruthy();
    });

    it('renders sub-components', () => {
      const { getByText } = render(<LGPDScreen />);
      expect(getByText('DataActions')).toBeTruthy();
      expect(getByText('ConsentToggles')).toBeTruthy();
      expect(getByText('RightsList')).toBeTruthy();
    });
  });
});
