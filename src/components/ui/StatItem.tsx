// src/components/ui/StatItem.tsx// Item de estatistica reutilizavel - NOVAIX FITNESS
import React from 'react';

import { View, Text, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING } from '../../constants/spacing'

import { TITLE_MD, BODY_SM } from '../../constants/typography';

import { useColors } from '../../context/ThemeContext';

interface StatItemProps {
 value: string | number; label: string;
 color?: string;

}
export default function StatItem(
{
value, label, color = colors.textTitle }: StatItemProps) 
{

return ( <View style=
{styles.container }>      <Text style=
{[styles.value, {
color }]}>
{value }</Text>      <Text style=
{styles.label }>
{label }</Text>    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: 
{
   alignItems: 'center', gap: SPACING.xs,  

},  value: 
{
   ...TITLE_MD, },  label: 
{
   ...BODY_SM, color: COLORS.textMuted,  

},

});