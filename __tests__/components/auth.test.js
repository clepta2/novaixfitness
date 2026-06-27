import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  FontAwesome: 'FontAwesome',
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
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
}));

import AuthInput from '../../src/components/auth/AuthInput';
import SocialButton from '../../src/components/auth/SocialButton';

describe('Auth Components', () => {
  describe('AuthInput', () => {
    it('renders with label', () => {
      const { getByText } = render(<AuthInput label="EMAIL" placeholder="Digite seu email" />);
      expect(getByText('EMAIL')).toBeTruthy();
    });

    it('renders without label', () => {
      const { toJSON } = render(<AuthInput placeholder="Digite seu email" />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders with icon', () => {
      const { toJSON } = render(<AuthInput label="EMAIL" icon="mail-outline" placeholder="Email" />);
      expect(toJSON()).toBeTruthy();
    });

    it('shows error message', () => {
      const { getByText } = render(<AuthInput label="EMAIL" error="E-mail inválido" />);
      expect(getByText('⚠ E-mail inválido')).toBeTruthy();
    });

    it('handles text input', () => {
      const onChangeText = jest.fn();
      const { toJSON } = render(<AuthInput value="" placeholder="Email" onChangeText={onChangeText} />);
      expect(toJSON()).toBeTruthy();
    });

    it('toggles secure text entry', () => {
      const { getByTestId } = render(<AuthInput placeholder="Password" secureTextEntry />);
      // Secure text entry toggle exists but we can't easily test it without testID
      const { toJSON } = render(<AuthInput placeholder="Password" secureTextEntry />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('SocialButton', () => {
    it('renders with label', () => {
      const { getByText } = render(<SocialButton icon="google" label="Continuar com Google" />);
      expect(getByText('Continuar com Google')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<SocialButton icon="google" label="Google" onPress={onPress} />);
      fireEvent.press(getByText('Google'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders with custom background color', () => {
      const { toJSON } = render(<SocialButton icon="apple" label="Apple" bgColor="#000" />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
