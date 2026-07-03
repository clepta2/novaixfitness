// src/components/workout/__tests__/SmartRestTimer.test.tsx
// Testes para o SmartRestTimer - NOVAIX FITNESS

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('react-native-svg', () => {
  const MockSvg = (props: any) => require('react').createElement('View', null, props.children);
  return { __esModule: true, default: MockSvg, Svg: MockSvg, Circle: MockSvg, Defs: MockSvg, LinearGradient: MockSvg, Stop: MockSvg };
});

import SmartRestTimer from '../SmartRestTimer';

const defaultProps = {
  isResting: true,
  totalTime: 90,
  exerciseType: 'chest',
  nextExercise: { name: 'Supino Reto', sets: 4, reps: 10, muscle: 'Peitoral' },
  restHistory: [],
  onSkip: jest.fn(),
  onAddTime: jest.fn(),
  onSubtractTime: jest.fn(),
};

describe('SmartRestTimer', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders nothing when not resting', () => {
    const { toJSON } = render(<SmartRestTimer {...defaultProps} isResting={false} />);
    expect(toJSON()).toBeNull();
  });

  it('renders rest timer when resting', () => {
    const { getByText } = render(<SmartRestTimer {...defaultProps} />);
    expect(getByText('DESCANSO')).toBeTruthy();
    expect(getByText('INICIAR AGORA')).toBeTruthy();
  });

  it('displays next exercise info', () => {
    const { getByText } = render(<SmartRestTimer {...defaultProps} />);
    expect(getByText('Supino Reto')).toBeTruthy();
    expect(getByText('PROXIMO')).toBeTruthy();
  });

  it('shows default rest time info', () => {
    const { getByText } = render(<SmartRestTimer {...defaultProps} />);
    expect(getByText(/Padrao:/)).toBeTruthy();
  });

  it('shows average rest time when history exists', () => {
    const { getByText } = render(
      <SmartRestTimer {...defaultProps} restHistory={[60, 75, 90]} />
    );
    expect(getByText(/Media:/)).toBeTruthy();
  });

  it('calls onSkip when skip button pressed', () => {
    const onSkip = jest.fn();
    const { getByText } = render(<SmartRestTimer {...defaultProps} onSkip={onSkip} />);
    fireEvent.press(getByText('INICIAR AGORA'));
    expect(onSkip).toHaveBeenCalled();
  });

  it('calls onAddTime when add button pressed', () => {
    const onAddTime = jest.fn();
    const { getByText } = render(<SmartRestTimer {...defaultProps} onAddTime={onAddTime} />);
    fireEvent.press(getByText('+15s'));
    expect(onAddTime).toHaveBeenCalled();
  });

  it('uses appropriate rest time for heavy exercises', () => {
    const { getByText } = render(
      <SmartRestTimer {...defaultProps} exerciseType="agachamento" />
    );
    expect(getByText(/Padrao: 3:00/)).toBeTruthy();
  });

  it('uses appropriate rest time for isolation exercises', () => {
    const { getByText } = render(
      <SmartRestTimer {...defaultProps} exerciseType="curl" />
    );
    expect(getByText(/Padrao: 1:00/)).toBeTruthy();
  });
});
