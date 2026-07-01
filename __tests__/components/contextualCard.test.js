import React from 'react';
import { render } from '@testing-library/react-native';

import ContextualCard from '../../src/components/home/ContextualCard';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
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

jest.mock('../../src/constants/colors', () => ({
  COLORS: { background: '#12161A', surface: '#1E232A', primary: '#CCFF00', textTitle: '#FFFFFF', textMuted: '#8A8F98', border: '#2A2F36', gold: '#FFD700', secondary: '#FF6B35', success: '#00E676' },
}));

jest.mock('../../src/constants/spacing', () => ({
  SPACING: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 },
  BORDER_RADIUS: { sm: 4, md: 8, lg: 12 },
}));

jest.mock('../../src/i18n', () => ({
  __esModule: true,
  default: { t: (key) => key },
  useI18n: () => ({
    t: (key, opts) => {
      return key;
    },
  }),
}));

const morningCard = {
  icon: 'sunny-outline',
  iconColor: '#FFD700',
  title: 'BOM-DIA, ATLETA',
  subtitle: 'Foco e Alongamento Matinal',
  description: 'Comece o dia com energia.',
  actionLabel: 'INICIAR AQUECIMENTO',
  actionRoute: '/warmup',
};

describe('ContextualCard', () => {
  describe('streak messages', () => {
    it('shows no motivation for streak 0', () => {
      const { queryByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} streak={0} />
      );
      expect(queryByText(/dias/)).toBeNull();
    });

    it('shows flow message for streak 3', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} streak={3} />
      );
      expect(getByText('3 dias no flow!')).toBeTruthy();
    });

    it('shows continue message for streak 7', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} streak={7} />
      );
      expect(getByText('7 dias! Continue assim!')).toBeTruthy();
    });

    it('shows incredible message for streak 14', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} streak={14} />
      );
      expect(getByText('14 dias! Incrivel!')).toBeTruthy();
    });

    it('shows legend message for streak 30', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} streak={30} />
      );
      expect(getByText('30 dias seguidos! Lenda!')).toBeTruthy();
    });

    it('shows correct message for streak 50', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} streak={50} />
      );
      expect(getByText('50 dias seguidos! Lenda!')).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders card title', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} />
      );
      expect(getByText('BOM-DIA, ATLETA')).toBeTruthy();
    });

    it('renders card subtitle', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} />
      );
      expect(getByText('Foco e Alongamento Matinal')).toBeTruthy();
    });

    it('renders action button', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} />
      );
      expect(getByText('INICIAR AQUECIMENTO')).toBeTruthy();
    });

    it('renders description', () => {
      const { getByText } = render(
        <ContextualCard card={morningCard} onAction={() => {}} />
      );
      expect(getByText('Comece o dia com energia.')).toBeTruthy();
    });
  });
});
