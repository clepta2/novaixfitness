// src/components/ui/SpaceBetween.tsx
// Layout space-between reutilizavel - NOVAIX FITNESS  
import React from 'react';

import { View, StyleSheet } from 'react-native';


interface SpaceBetweenProps {
  children: React.ReactNode; gap?: number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  style?: object;

}


export default function SpaceBetween(
{ children, gap = 0, align = 'center', style }: SpaceBetweenProps) 
{
return ( <View style=
{[styles.row, { gap, alignItems: align }, style]
}>
      
{children
}
    </View>
  );
}


const styles = StyleSheet.create(
{
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
  
},

});
