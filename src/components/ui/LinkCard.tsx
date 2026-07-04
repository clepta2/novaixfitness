// src/components/ui/LinkCard.tsx// Card de link com icone, label e chevron - NOVAIX FITNESS

import { TouchableOpacity, Text, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface LinkCardProps {
 icon: string; label: string;
 onPress: () => void;

}
export function LinkCard(
{
icon, label, onPress }: LinkCardProps) 
{
const colors = useColors();

return (    <TouchableOpacity style=
{styles.card } onPress=
{onPress } activeOpacity=
{0.7 }>      <Ionicons name=
{icon as any } size=
{20 } color=
{COLORS.primary } />      <Text style=
{styles.label }>
{label }</Text>      <Ionicons name="chevron-forward" size=
{16 } color=
{COLORS.textMuted } />    </TouchableOpacity>  );
}

const styles = StyleSheet.create(
{
 card: {
   flexDirection: 'row', alignItems: 'center',    backgroundColor: COLORS.surface,    borderRadius: BORDER_RADIUS.lg,    padding: SPACING.lg,    borderWidth: 1,    borderColor: COLORS.border,    gap: SPACING.md,  

},  label: 
{
fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle, flex: 1 },

});