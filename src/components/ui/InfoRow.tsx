// src/components/ui/InfoRow.tsx// Linha de informacao com icone, titulo e descricao - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface InfoRowProps {
 icon: string; iconColor?: string;
 label: string;
 description: string;

}
export function InfoRow(
{
icon, iconColor = COLORS.primary, label, description }: InfoRowProps) 
{
const colors = useColors();

return (    <View style=
{styles.row }>      <View style=
{[styles.icon, {
backgroundColor: iconColor + '15' }]}>        <Ionicons name=
{icon as any } size=
{18 } color=
{iconColor } />      </View>      <View style=
{styles.content }>        <Text style=
{styles.label }>
{label }</Text>        <Text style=
{styles.desc }>
{description }</Text>      </View>    </View>  );
}

const styles = StyleSheet.create(
{
 row: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },  icon: 
{
width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },  content: 
{
flex: 1 },  label: 
{
fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textTitle },  desc: 
{
fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },

});