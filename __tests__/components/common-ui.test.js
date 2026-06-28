import React from 'react';
import { Text, Animated } from 'react-native';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true] }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props) => React.createElement('Ionicons', props) };
});
jest.mock('../../src/constants/shadows', () => ({ SHADOWS: { sm: {}, md: {}, lg: {} } }));
jest.mock('../../src/constants/spacing', () => ({
  SPACING: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40, massive: 48 },
  BORDER_RADIUS: { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 },
  ICON_SIZES: { xs: 14, sm: 18, md: 22, lg: 28, xl: 36, xxl: 48 },
}));
jest.mock('../../src/utils/responsive', () => ({ scale: (n) => n }));
jest.mock('../../src/styles', () => ({
  typography: { h5: {}, bodySmall: {}, caption: {}, label: {}, bodyMuted: {} },
  layout: { screen: {}, scroll: {}, header: {} },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated = { ...RN.Animated, Value: jest.fn(() => ({ setValue: jest.fn(), interpolate: jest.fn(() => 0), addListener: jest.fn() })), timing: jest.fn(() => ({ start: jest.fn() })), spring: jest.fn(() => ({ start: jest.fn() })), parallel: jest.fn(() => ({ start: jest.fn() })), loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })), sequence: jest.fn(() => ({ start: jest.fn() })) };
  return RN;
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  return { Svg: (props) => React.createElement('Svg', props), Circle: (props) => React.createElement('Circle', props), G: (props) => React.createElement('G', props), Defs: (props) => React.createElement('Defs', props), LinearGradient: (props) => React.createElement('LinearGradient', props), Stop: (props) => React.createElement('Stop', props), Line: (props) => React.createElement('Line', props), Polygon: (props) => React.createElement('Polygon', props), Text: (props) => React.createElement('Text', props) };
});

import { Card } from '../../src/components/ui/Card';
import { Header } from '../../src/components/ui/Header';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import Badge from '../../src/components/ui/Badge';
import SearchBar from '../../src/components/common/SearchBar';
import ProgressBar from '../../src/components/common/ProgressBar';
import ErrorCard from '../../src/components/common/ErrorCard';
import BottomSheet from '../../src/components/common/BottomSheet';
import { SkeletonCard, SkeletonList, SkeletonGrid, SkeletonChart } from '../../src/components/common/SkeletonLoader';

describe('UI Components', () => {
  describe('Card', () => {
    it('renders default variant', () => {
      const result = render(<Card />);
      expect(result.root).toBeTruthy();
    });
    it('renders with title', () => {
      const result = render(<Card title="Title" />);
      expect(result.root).toBeTruthy();
    });
    it('renders as pressable', () => {
      const result = render(<Card onPress={() => {}} />);
      expect(result.root).toBeTruthy();
    });
  });

  describe('Header', () => {
    it('renders with title', () => {
      const { toJSON } = render(<Header title="Test" />);
      expect(toJSON()).toBeTruthy();
    });
    it('renders with subtitle', () => {
      const { toJSON } = render(<Header title="Test" subtitle="Subtitle" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Button', () => {
    it('renders primary', () => {
      const { toJSON } = render(<Button title="Click" onPress={() => {}} />);
      expect(toJSON()).toBeTruthy();
    });
    it('renders secondary', () => {
      const { toJSON } = render(<Button title="Click" variant="secondary" onPress={() => {}} />);
      expect(toJSON()).toBeTruthy();
    });
    it('renders disabled', () => {
      const { toJSON } = render(<Button title="Click" disabled onPress={() => {}} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Input', () => {
    it('renders with label', () => {
      const { toJSON } = render(<Input label="Email" value="" onChangeText={() => {}} />);
      expect(toJSON()).toBeTruthy();
    });
    it('renders with error', () => {
      const { toJSON } = render(<Input label="Email" value="" onChangeText={() => {}} error="Required" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Badge', () => {
    it('renders', () => {
      const result = render(<Badge value="New" />);
      expect(result).toBeTruthy();
    });
  });

  describe('SearchBar', () => {
    it('renders', () => {
      const { toJSON } = render(<SearchBar value="" onChangeText={() => {}} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('ProgressBar', () => {
    it('renders', () => {
      const { toJSON } = render(<ProgressBar value={50} max={100} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('ErrorCard', () => {
    it('imports correctly', () => {
      expect(ErrorCard).toBeDefined();
    });
  });

  describe('BottomSheet', () => {
    it('imports correctly', () => {
      expect(BottomSheet).toBeDefined();
    });
  });

  describe('SkeletonLoader', () => {
    it('renders SkeletonCard', () => {
      const { toJSON } = render(<SkeletonCard />);
      expect(toJSON()).toBeTruthy();
    });
    it('renders SkeletonList', () => {
      const { toJSON } = render(<SkeletonList count={3} />);
      expect(toJSON()).toBeTruthy();
    });
    it('renders SkeletonGrid', () => {
      const { toJSON } = render(<SkeletonGrid columns={2} count={4} />);
      expect(toJSON()).toBeTruthy();
    });
    it('renders SkeletonChart', () => {
      const { toJSON } = render(<SkeletonChart />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
