// src/components/ui/Row.tsx
// Layout row reutilizavel - NOVAIX FITNESS  
import React from 'react';

import { View, StyleSheet } from 'react-native'

import { SPACING } from '../../constants/spacing';


interface RowProps {
  children: React.ReactNode; gap?: number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
  style?: object;

}


export default function Row(
{ children, gap = SPACING.sm, align = 'center', justify = 'flex-start', wrap = false, style }: RowProps) 
{
return ( <View style=
{[styles.row, { gap, alignItems: align, justifyContent: justify }, wrap && 
{ flexWrap: 'wrap' }, style]
}>
      
{children
}
    </View>
  );
}


const styles = StyleSheet.create(
{
  row: {
    flexDirection: 'row', },

});
