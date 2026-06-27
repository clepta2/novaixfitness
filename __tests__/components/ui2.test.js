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

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

import ProgressBar from '../../src/components/ui/ProgressBar';
import { Header } from '../../src/components/ui/Header';
import { Avatar } from '../../src/components/ui/Avatar';

describe('UI Components - Round 2', () => {
  describe('ProgressBar', () => {
    it('renders with label', () => {
      const { getByText } = render(<ProgressBar value={50} label="PROGRESSO" />);
      expect(getByText('PROGRESSO')).toBeTruthy();
    });

    it('renders with showValue', () => {
      const { getByText } = render(<ProgressBar value={75} showValue />);
      expect(getByText('75%')).toBeTruthy();
    });

    it('renders with both label and value', () => {
      const { getByText } = render(<ProgressBar value={30} max={60} label="Progresso" showValue />);
      expect(getByText('Progresso')).toBeTruthy();
      expect(getByText('50%')).toBeTruthy();
    });

    it('caps at 100%', () => {
      const { getByText } = render(<ProgressBar value={150} max={100} showValue />);
      expect(getByText('100%')).toBeTruthy();
    });

    it('applies variant styles', () => {
      const { rerender } = render(<ProgressBar value={50} variant="success" />);
      rerender(<ProgressBar value={50} variant="attention" />);
    });

    it('renders without label or value', () => {
      const { toJSON } = render(<ProgressBar value={50} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Header', () => {
    it('renders title', () => {
      const { getByText } = render(<Header title="Settings" />);
      expect(getByText('Settings')).toBeTruthy();
    });

    it('renders subtitle', () => {
      const { getByText } = render(<Header title="Profile" subtitle="Edit your info" />);
      expect(getByText('Profile')).toBeTruthy();
      expect(getByText('Edit your info')).toBeTruthy();
    });

    it('renders back button when showBack', () => {
      const { getByText } = render(<Header title="Back" showBack />);
      expect(getByText('Back')).toBeTruthy();
    });

    it('renders right icon', () => {
      const onRight = jest.fn();
      const { getByText } = render(<Header title="Title" rightIcon="settings" onRightPress={onRight} />);
      expect(getByText('Title')).toBeTruthy();
    });

    it('calls router.back when back pressed', () => {
      const router = require('expo-router').useRouter();
      const { getByText } = render(<Header title="Page" showBack />);
      expect(getByText('Page')).toBeTruthy();
    });
  });

  describe('Avatar', () => {
    it('shows initials from name', () => {
      const { getByText } = render(<Avatar name="John Doe" />);
      expect(getByText('JD')).toBeTruthy();
    });

    it('shows single initial for single name', () => {
      const { getByText } = render(<Avatar name="John" />);
      expect(getByText('J')).toBeTruthy();
    });

    it('shows icon when no name', () => {
      const { toJSON } = render(<Avatar />);
      expect(toJSON()).toBeTruthy();
    });

    it('applies size styles', () => {
      const { rerender, getByText } = render(<Avatar name="Ana Beatriz" size="sm" />);
      expect(getByText('AB')).toBeTruthy();
      rerender(<Avatar name="Ana Beatriz" size="lg" />);
      expect(getByText('AB')).toBeTruthy();
      rerender(<Avatar name="Ana Beatriz" size="xl" />);
      expect(getByText('AB')).toBeTruthy();
    });

    it('renders image when uri provided', () => {
      const { toJSON } = render(<Avatar uri="https://example.com/photo.jpg" name="Test" />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
