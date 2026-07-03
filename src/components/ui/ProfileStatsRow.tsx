// src/components/ui/ProfileStatsRow.tsx
// Row de estatisticas do perfil - NOVAIX FITNESS


import { View, Text, StyleSheet } from 'react-native'

import { SPACING } from '../../constants/spacing';


interface ProfileStatsRowProps {
  value: number | string; label: string;

}


interface ProfileStatsRowProps {
  stats: Stat[]; }

export function ProfileStatsRow(
{ stats }: ProfileStatsRowProps) 
{
return ( <View style=
{styles.row
}>
      
{stats.map((stat, i) => ( <View key=
{i
} style=
{styles.stat
}>
          <Text style=
{styles.value
}>
{stat.value
}</Text>
          <Text style=
{styles.label
}>
{stat.label
}</Text>
        </View>
      ))
}
    </View>
  );
}


const styles = StyleSheet.create(
{
  row: { flexDirection: 'row', gap: SPACING.xl, marginBottom: SPACING.xl },
  stat: 
{ alignItems: 'center' },
  value: 
{ fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#CCFF00' },
  label: 
{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#8892A0' },

});
