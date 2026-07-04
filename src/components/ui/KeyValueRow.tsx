// src/components/ui/KeyValueRow.tsx// Linha chave-valor reutilizavel - NOVAIX FITNESS
import React from 'react';

import { View, Text, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING } from '../../constants/spacing'
import SpaceBetween  
from './SpaceBetween';

import { useColors } from '../../context/ThemeContext';

interface KeyValueRowProps {
 label: string; value: string | number;
 labelColor?: string;
 valueColor?: string;
 borderBottom?: boolean;

}
export default function KeyValueRow(
{
label, value, labelColor = colors.textMuted, valueColor = colors.textTitle, borderBottom = false }: KeyValueRowProps) 
{

return ( <SpaceBetween style=
{[styles.row, borderBottom && styles.borderBottom] }>      <Text style=
{[styles.label, {
color: labelColor }]}>
{label }</Text>      <Text style=
{[styles.value, {
color: valueColor }]}>
{value }</Text>    </SpaceBetween>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 row: 
{
   paddingVertical: SPACING.sm, },  borderBottom: 
{
   borderBottomWidth: 1, borderBottomColor: COLORS.border,  

},  label: 
{
   fontFamily: 'Inter_400Regular', fontSize: 13,  

},  value: 
{
   fontFamily: 'Montserrat_600SemiBold', fontSize: 13,  

},

});