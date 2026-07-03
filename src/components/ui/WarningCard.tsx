// src/components/ui/WarningCard.tsx// Card de aviso com icone e mensagem - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface WarningCardProps {
 message: string; icon?: string;

}
export function WarningCard(
{
message, icon = 'warning' }: WarningCardProps) 
{
const colors = useColors();

return (    <View style=
{styles.card }>      <Ionicons name=
{icon as any } size=
{20 } color=
{colors.attention } />      <Text style=
{styles.text }>
{message }</Text>    </View>  );
}

const styles = StyleSheet.create(
{
 card: {
   flexDirection: 'row', alignItems: 'center',    gap: SPACING.sm,    backgroundColor: colors.attention + '15',    borderRadius: BORDER_RADIUS.md,    padding: SPACING.md,    borderWidth: 1,    borderColor: colors.attention + '40',  

},  text: 
{
fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.attention, flex: 1 },

});