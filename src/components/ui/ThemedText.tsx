// src/components/ui/ThemedText.tsx
// Text que usa cores reativas do tema

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useColors } from '../../context/ThemeContext';

interface ThemedTextProps extends TextProps {
  variant?: 'title' | 'body' | 'caption' | 'label';
}

export function ThemedText({ variant = 'body', style, children, ...props }: ThemedTextProps) {
  const colors = useColors();

  const variantStyles = {
    title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: colors.textTitle },
    body: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textDescription },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
    label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: colors.textMuted, letterSpacing: 1 },
  };

  return (
    <Text style={[variantStyles[variant], style]} {...props}>
      {children}
    </Text>
  );
}
