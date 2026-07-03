// src/components/ui/ThemedInput.tsx
// Input que usa cores reativas do tema  
import React from 'react';

import { TextInput, TextInputProps, StyleSheet } from 'react-native'

import { useColors } from '../../context/ThemeContext';

import { SPACING, BORDER_RADIUS } from '../../constants/spacing';


interface ThemedInputProps extends TextInputProps 
{
}

export function ThemedInput(
{ style, ...props }: ThemedInputProps) 
{

return (
    <TextInput
      style={[ {
          backgroundColor: colors.surface, borderWidth: 1,
          borderColor: colors.border,
          borderRadius: BORDER_RADIUS.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          color: colors.textTitle,
          fontFamily: 'Inter_400Regular',
          fontSize: 14,},
        style,
      ]
}
      placeholderTextColor=
{colors.textMuted
}
      
{...props
}
    />
  );

}
