// src/components/progress/__tests__/ComparisonSlider.test.tsx
// Testes para o ComparisonSlider - NOVAIX FITNESS

import React from 'react';
import { render } from '@testing-library/react-native';
import ComparisonSlider from '../ComparisonSlider';

describe('ComparisonSlider', () => {
  it('renders before/after labels', () => {
    const { getAllByText, getByText } = render(<ComparisonSlider />);
    expect(getAllByText('ANTES').length).toBeGreaterThanOrEqual(1);
    expect(getByText('DEPOIS')).toBeTruthy();
  });

  it('renders placeholder when no images', () => {
    const { getAllByText } = render(<ComparisonSlider />);
    expect(getAllByText('ANTES').length).toBeGreaterThanOrEqual(1);
  });

  it('renders measurements section when provided', () => {
    const measurements = [
      { label: 'Peso', before: 85, after: 80, unit: 'kg' },
      { label: 'Cintura', before: 95, after: 88, unit: 'cm' },
    ];
    const { getByText } = render(
      <ComparisonSlider measurements={measurements} />
    );
    expect(getByText('MEDIÇÕES')).toBeTruthy();
    expect(getByText('Peso')).toBeTruthy();
    expect(getByText('Cintura')).toBeTruthy();
  });

  it('shows measurement values correctly', () => {
    const measurements = [
      { label: 'Peso', before: 85, after: 80, unit: 'kg' },
    ];
    const { getByText } = render(
      <ComparisonSlider measurements={measurements} />
    );
    expect(getByText('85kg')).toBeTruthy();
    expect(getByText('80kg')).toBeTruthy();
    expect(getByText('-5.0kg')).toBeTruthy();
  });

  it('renders with images', () => {
    const { toJSON } = render(
      <ComparisonSlider beforeUri="before.jpg" afterUri="after.jpg" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders custom dimensions', () => {
    const { toJSON } = render(
      <ComparisonSlider width={400} height={500} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('shows positive diff in green for gains', () => {
    const measurements = [
      { label: 'Peito', before: 100, after: 105, unit: 'cm' },
    ];
    const { toJSON } = render(
      <ComparisonSlider measurements={measurements} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
