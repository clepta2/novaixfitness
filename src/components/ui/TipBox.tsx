// src/components/ui/TipBox.tsx// Box de dica com icone e texto - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface TipBoxProps {
 message: string; icon?: string;

}
export function TipBox(
{
message, icon = 'bulb' }: TipBoxProps) 
{
const colors = useColors();

return (    <View style=
{styles.box }>      <Ionicons name=
{icon as any } size=
{16 } color=
{COLORS.primary } />      <Text style=
{styles.text }>
{message }</Text>    </View>  );
}

const styles = StyleSheet.create(
{
 box: {
   flexDirection: 'row', alignItems: 'center',    gap: SPACING.sm,    padding: SPACING.md,    backgroundColor: COLORS.primary + '10',    borderRadius: BORDER_RADIUS.md,  

},  text: 
{
fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, flex: 1 },

});