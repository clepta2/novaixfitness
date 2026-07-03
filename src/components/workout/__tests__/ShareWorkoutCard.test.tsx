// src/components/workout/__tests__/ShareWorkoutCard.test.tsx
// Testes para o ShareWorkoutCard - NOVAIX FITNESS

import React from 'react';
import { render } from '@testing-library/react-native';
import ShareWorkoutCard from '../ShareWorkoutCard';

const defaultProps = {
  workoutName: 'Treino Peito',
  duration: 45,
  exercises: 8,
  calories: 360,
  date: '01/07/2026',
  onClose: jest.fn(),
};

describe('ShareWorkoutCard', () => {
  it('renders workout name', () => {
    const { getByText } = render(<ShareWorkoutCard {...defaultProps} />);
    expect(getByText('Treino Peito')).toBeTruthy();
  });

  it('renders brand name', () => {
    const { getByText } = render(<ShareWorkoutCard {...defaultProps} />);
    expect(getByText('NOVAIX FITNESS')).toBeTruthy();
  });

  it('renders completion badge', () => {
    const { getByText } = render(<ShareWorkoutCard {...defaultProps} />);
    expect(getByText('TREINO COMPLETO')).toBeTruthy();
  });

  it('renders stats correctly', () => {
    const { getByText } = render(<ShareWorkoutCard {...defaultProps} />);
    expect(getByText('45')).toBeTruthy();
    expect(getByText('8')).toBeTruthy();
    expect(getByText('360')).toBeTruthy();
    expect(getByText('min')).toBeTruthy();
    expect(getByText('exercicios')).toBeTruthy();
    expect(getByText('cal')).toBeTruthy();
  });

  it('renders date', () => {
    const { getByText } = render(<ShareWorkoutCard {...defaultProps} />);
    expect(getByText('01/07/2026')).toBeTruthy();
  });

  it('renders share button', () => {
    const { getByText } = render(<ShareWorkoutCard {...defaultProps} />);
    expect(getByText('COMPARTILHAR')).toBeTruthy();
  });

  it('renders watermark', () => {
    const { getByText } = render(<ShareWorkoutCard {...defaultProps} />);
    expect(getByText('novaix.fitness')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    const { UNSAFE_getByProps } = render(<ShareWorkoutCard {...defaultProps} onClose={onClose} />);
    const closeBtn = UNSAFE_getByProps({ accessibilityLabel: 'Fechar' });
    closeBtn.props.onPress();
    expect(onClose).toHaveBeenCalled();
  });
});
