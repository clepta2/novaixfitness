// src/components/ui/LoadingIndicator.tsx// Indicador de carregamento inline reutilizavel - NOVAIX FITNESS
import React from 'react';

import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface LoadingIndicatorProps {
 text?: string; size?: 'small' | 'large';

}
export default function LoadingIndicator(
{
text, size = 'small' }: LoadingIndicatorProps) 
{

return ( <View style=
{styles.container }>      <ActivityIndicator size=
{size } color=
{colors.primary } />      
{text && <Text style=
{styles.text }>
{text }</Text>

}    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: 
{
   alignItems: 'center', justifyContent: 'center',    paddingVertical: SPACING.lg,    gap: SPACING.sm,  

},  text: 
{
   fontFamily: 'Inter_400Regular', fontSize: 13,    color: COLORS.textMuted,  

},

});