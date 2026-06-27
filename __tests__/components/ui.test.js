import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

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

import Badge from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';

describe('UI Components', () => {
  describe('Badge', () => {
    it('renders with value', () => {
      const { getByText } = render(<Badge value="Premium" />);
      expect(getByText('Premium')).toBeTruthy();
    });

    it('renders with numeric value', () => {
      const { getByText } = render(<Badge value={5} />);
      expect(getByText('5')).toBeTruthy();
    });

    it('returns null for empty value', () => {
      const { toJSON } = render(<Badge value={null} />);
      expect(toJSON()).toBeNull();
    });

    it('applies variant styles', () => {
      const { getByText } = render(<Badge value="Test" variant="primary" />);
      expect(getByText('Test')).toBeTruthy();
    });

    it('applies size styles', () => {
      const { getByText } = render(<Badge value="Test" size="md" />);
      expect(getByText('Test')).toBeTruthy();
    });
  });

  describe('Button', () => {
    it('renders with title', () => {
      const { getByText } = render(<Button title="ENTRAR" onPress={() => {}} />);
      expect(getByText('ENTRAR')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="ENTRAR" onPress={onPress} />);
      fireEvent.press(getByText('ENTRAR'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="ENTRAR" onPress={onPress} disabled />);
      fireEvent.press(getByText('ENTRAR'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('shows ActivityIndicator when loading', () => {
      const { queryByText } = render(<Button title="ENTRAR" onPress={() => {}} loading />);
      expect(queryByText('ENTRAR')).toBeNull();
    });

    it('renders different variants', () => {
      const { rerender, getByText } = render(<Button title="Test" onPress={() => {}} variant="secondary" />);
      expect(getByText('Test')).toBeTruthy();
      rerender(<Button title="Test" onPress={() => {}} variant="ghost" />);
      expect(getByText('Test')).toBeTruthy();
    });

    it('renders with icon', () => {
      const { getByText } = render(<Button title="Google" onPress={() => {}} variant="google" icon="logo-google" />);
      expect(getByText('Google')).toBeTruthy();
    });
  });

  describe('Card', () => {
    it('renders children', () => {
      const { getByText } = render(<Card><Text>Content</Text></Card>);
      expect(getByText('Content')).toBeTruthy();
    });

    it('renders as touchable when onPress provided', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Card onPress={onPress}><Text>Pressable</Text></Card>);
      fireEvent.press(getByText('Pressable'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders as view when no onPress', () => {
      const { getByText } = render(<Card><Text>Static</Text></Card>);
      expect(getByText('Static')).toBeTruthy();
    });

    it('applies variant styles', () => {
      const { rerender, getByText } = render(<Card variant="primary"><Text>Test</Text></Card>);
      expect(getByText('Test')).toBeTruthy();
      rerender(<Card variant="active"><Text>Test</Text></Card>);
      expect(getByText('Test')).toBeTruthy();
    });
  });
});
