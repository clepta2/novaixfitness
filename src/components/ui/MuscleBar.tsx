// src/components/ui/MuscleBar.tsx// Barra de progresso de musculo - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface MuscleBarProps {
 name: string; percentage: number;
 color: string;

}
export function MuscleBar(
{
name, percentage, color }: MuscleBarProps) 
{
const colors = useColors();

return (    <View style=
{styles.row }>      <View style=
{styles.info }>        <Text style=
{styles.name }>
{name }</Text>        <Text style=
{styles.pct }>
{percentage }%</Text>      </View>      <View style=
{styles.track }>        <View style=
{[styles.fill, {
width: `$
{percentage }%`, backgroundColor: color }]} />      </View>    </View>  );
}

const styles = StyleSheet.create(
{
 row: {
marginBottom: SPACING.sm },  info: 
{
flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },  name: 
{
fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textTitle },  pct: 
{
fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },  track: 
{
height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, overflow: 'hidden' },  fill: 
{
height: '100%', borderRadius: 3 },

});