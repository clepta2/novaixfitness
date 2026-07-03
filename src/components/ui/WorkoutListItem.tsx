// src/components/ui/WorkoutListItem.tsx// Item de lista de treino (coach/admin) - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface WorkoutListItemProps {
 title: string; category: string;
 duration: number | string;
 level: string;
 onDelete?: () => void;

}
export function WorkoutListItem(
{
title, category, duration, level, onDelete }: WorkoutListItemProps) 
{
const colors = useColors();

return (    <View style=
{styles.card }>      <View style=
{styles.info }>        <Text style=
{styles.title }>
{title }</Text>        <Text style=
{styles.meta }>
{category } · 
{duration }min · 
{level }</Text>      </View>      
{onDelete && ( <TouchableOpacity onPress=
{onDelete } hitSlop=
{
{
top: 10, bottom: 10, left: 10, right: 10 }

}>          <Ionicons name="trash-outline" size=
{18 } color=
{colors.error } />        </TouchableOpacity>      )

}    </View>  );
}

const styles = StyleSheet.create(
{
 card: {
flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: colors.border },  info: 
{
flex: 1 },  title: 
{
fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.textTitle },  meta: 
{
fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 4 },

});