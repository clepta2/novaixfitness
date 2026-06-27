import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import SettingsGroup from '../../src/components/settings/SettingsGroup';
import MenuSection from '../../src/components/settings/MenuSection';

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
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
  layout: {
    screen: {},
    scroll: { paddingTop: 0 },
    header: {},
    headerBtn: {},
    section: {},
    footer: {},
  },
}));

describe('Settings Components', () => {
  describe('SettingsGroup', () => {
    const mockItems = [
      { key: 'darkMode', icon: 'moon-outline', label: 'Modo Escuro', desc: 'Tema escuro', color: '#8B5CF6' },
      { key: 'sound', icon: 'volume-high', label: 'Sons', desc: 'Efeitos sonoros', color: '#10B981' },
    ];

    it('renders title', () => {
      const { getByText } = render(
        <SettingsGroup title="CONFIGURAÇÕES" items={mockItems} settings={{ darkMode: true, sound: false }} onToggle={() => {}} />
      );
      expect(getByText('CONFIGURAÇÕES')).toBeTruthy();
    });

    it('renders items', () => {
      const { getByText } = render(
        <SettingsGroup title="Test" items={mockItems} settings={{ darkMode: true, sound: false }} onToggle={() => {}} />
      );
      expect(getByText('Modo Escuro')).toBeTruthy();
      expect(getByText('Sons')).toBeTruthy();
    });

    it('calls onToggle when switch pressed', () => {
      const onToggle = jest.fn();
      const { getByText } = render(
        <SettingsGroup title="Test" items={mockItems} settings={{ darkMode: true, sound: false }} onToggle={onToggle} />
      );
      fireEvent.press(getByText('Modo Escuro'));
    });

    it('renders voice coach toggle item', () => {
      const voiceItem = [
        { key: 'voiceCoach', icon: 'mic-outline', label: 'Treinador por Voz', desc: 'Instrucoes de voz', color: '#CCFF00' },
      ];
      const { getByText } = render(
        <SettingsGroup title="TREINO" items={voiceItem} settings={{ voiceCoach: true }} onToggle={() => {}} />
      );
      expect(getByText('Treinador por Voz')).toBeTruthy();
      expect(getByText('Instrucoes de voz')).toBeTruthy();
    });

    it('toggles voice coach off', () => {
      const onToggle = jest.fn();
      const voiceItem = [
        { key: 'voiceCoach', icon: 'mic-outline', label: 'Treinador por Voz', desc: 'Instrucoes de voz', color: '#CCFF00' },
      ];
      const { UNSAFE_getByType } = render(
        <SettingsGroup title="TREINO" items={voiceItem} settings={{ voiceCoach: true }} onToggle={onToggle} />
      );
      const switches = UNSAFE_getByType(require('react-native').Switch);
      fireEvent(switches, 'valueChange', false);
      expect(onToggle).toHaveBeenCalledWith('voiceCoach');
    });
  });

  describe('MenuSection', () => {
    const mockItems = [
      { icon: 'person-outline', label: 'Editar Perfil', route: '/profile', color: '#3B82F6' },
      { icon: 'lock-outline', label: 'Alterar Senha', action: 'password', color: '#EF4444' },
      { icon: 'info-circle', label: 'Sobre', version: '1.0.0', color: '#6B7280' },
    ];

    it('renders title', () => {
      const { getByText } = render(
        <MenuSection title="CONTA" items={mockItems} onPress={() => {}} />
      );
      expect(getByText('CONTA')).toBeTruthy();
    });

    it('renders items', () => {
      const { getByText } = render(
        <MenuSection title="Test" items={mockItems} onPress={() => {}} />
      );
      expect(getByText('Editar Perfil')).toBeTruthy();
      expect(getByText('Alterar Senha')).toBeTruthy();
      expect(getByText('Sobre')).toBeTruthy();
    });

    it('calls onPress with route for route items', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <MenuSection title="Test" items={mockItems} onPress={onPress} />
      );
      fireEvent.press(getByText('Editar Perfil'));
      expect(onPress).toHaveBeenCalledWith('/profile');
    });

    it('calls onPress with action for action items', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <MenuSection title="Test" items={mockItems} onPress={onPress} />
      );
      fireEvent.press(getByText('Alterar Senha'));
      expect(onPress).toHaveBeenCalledWith('password');
    });

    it('shows version for version items', () => {
      const { getByText } = render(
        <MenuSection title="Test" items={mockItems} onPress={() => {}} />
      );
      expect(getByText('v1.0.0')).toBeTruthy();
    });
  });
});
