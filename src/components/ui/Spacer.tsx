// src/components/ui/Spacer.tsx
// Espaçador reutilizavel - NOVAIX FITNESS


import { View } from 'react-native'

import { SPACING } from '../../constants/spacing';

const SPACER_SIZES: Record<number, number> ={
  0: 0, 4: SPACING.xs,
  8: SPACING.sm,
  12: SPACING.md,
  16: SPACING.md,
  24: SPACING.lg,
  32: SPACING.xl,
  40: SPACING.xxl,
  48: SPACING.xxxl,
  64: SPACING.massive,
  80: SPACING.huge,
  100: 100,
  120: 120,
  180: 180,
};


interface SpacerProps {
  size?: number; horizontal?: boolean;

}

export function Spacer(
{ size = 16, horizontal = false }: SpacerProps) 
{
const value = SPACER_SIZES[size] || size;
  
return (
    <View
      style=
{horizontal ? 
{ width: value }
        : 
{ height: value }
      
}
    />
  );

}
