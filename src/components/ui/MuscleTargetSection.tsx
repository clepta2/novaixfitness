// src/components/ui/MuscleTargetSection.tsx// Secao de musculos alvo com barras de progresso - NOVAIX FITNESS
import { View, Text, StyleSheet  } from 'react-native'
import { COLORS  } from '../../constants/colors';
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing'
import { useColors  } from '../../context/ThemeContext';
interface Muscle {
 name: string;
 pct: number;
 color?: string;
}
interface MuscleTargetSectionProps {
 muscles: Muscle[];
 title?: string;
}
export 
function MuscleTargetSection({
muscles, title = 'MÚSCULOS ALVO' 
}: MuscleTargetSectionProps) {
 
const colors = useColors();
return (    <View style={styles.container
}>      <Text style={styles.title
}>{title
}</Text>      <View style={styles.list
}>        {muscles.map((muscle, idx) => (          <View key={idx
} style={styles.row
}>            <View style={styles.info
}>              <Text style={styles.name
}>{muscle.name
}</Text>              <Text style={styles.pct
}>{muscle.pct
}%</Text>            </View>            <View style={styles.track
}>              <View style={[styles.fill, {
width: `${muscle.pct
}%`, backgroundColor: muscle.color || colors.primary 
}]
} />            </View>          </View>        ))
}      </View>    </View>  );
}
const styles = StyleSheet.create({
 container: {
marginBottom: SPACING.lg 
},  title: {
fontFamily: 'Montserrat_700Bold', fontSize: 12, color: colors.textMuted, letterSpacing: 0.5, marginBottom: SPACING.md 
},  list: {
gap: SPACING.sm 
},  row: {
gap: SPACING.xs 
},  info: {
flexDirection: 'row', justifyContent: 'space-between' 
},  name: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTitle 
},  pct: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: colors.textMuted 
},  track: {
height: 6, backgroundColor: colors.surfaceElevated, borderRadius: 3, overflow: 'hidden' 
},  fill: {
height: '100%', borderRadius: 3 
},
});