// src/components/ui/FeatureCheckRow.tsx// Linha de feature com checkmark - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface FeatureCheckRowProps {
 text: string; included?: boolean;

}
export function FeatureCheckRow(
{
text, included = true }: FeatureCheckRowProps) 
{
const colors = useColors();

return (    <View style=
{styles.row }>      <Ionicons        name=
{included ? 'checkmark-circle' : 'close-circle' }        size=
{16 }        color=
{included ? COLORS.success : COLORS.textMuted }      />      <Text style=
{[styles.text, !included && styles.excluded] }>
{text }</Text>    </View>  );
}

const styles = StyleSheet.create(
{
 row: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },  text: 
{
fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },  excluded: 
{
textDecorationLine: 'line-through', color: COLORS.textMuted },

});