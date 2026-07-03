// src/components/ui/StatsRow.tsx// Row de estatisticas com cards - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING, BORDER_RADIUS } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface StatsRowProps {
 value: string; label: string;

}

interface StatsRowProps {
 stats: Stat[]; }
export function StatsRow(
{
stats }: StatsRowProps) 
{
const colors = useColors();

return (    <View style=
{styles.row }>      
{stats.map((stat, idx) => ( <View key=
{idx } style=
{styles.card }>          <Text style=
{styles.value }>
{stat.value }</Text>          <Text style=
{styles.label }>
{stat.label }</Text>        </View>      ))

}    </View>  );
}

const styles = StyleSheet.create(
{
 row: {
flexDirection: 'row', gap: SPACING.sm },  card: 
{
   flex: 1, alignItems: 'center',    justifyContent: 'center',    padding: SPACING.md,    backgroundColor: colors.surface,    borderRadius: BORDER_RADIUS.md,    borderWidth: 1,    borderColor: colors.border,  

},  value: 
{
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: colors.textTitle },  label: 
{
fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textMuted },

});