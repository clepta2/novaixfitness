// src/context/ThemeHOC.tsx
// HOC para injetar cores reativas em componentes

import React, { ComponentType, ReactNode } from 'react';
import { useTheme } from './ThemeContext';
import { ThemeColors } from '../constants/colors';

interface WithThemeProps {
  colors: ThemeColors;
  isDark: boolean;
}

export function withTheme<P extends WithThemeProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<Omit<P, keyof WithThemeProps>> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ThemedComponent = (props: Omit<P, keyof WithThemeProps>) => {
    const { colors, isDark } = useTheme();

    return (
      <WrappedComponent
        {...(props as P)}
        colors={colors}
        isDark={isDark}
      />
    );
  };

  ThemedComponent.displayName = `WithTheme(${displayName})`;
  return ThemedComponent;
}

// Hook alternativo para classes
export function useThemeColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}
