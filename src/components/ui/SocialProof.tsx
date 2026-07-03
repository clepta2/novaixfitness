// src/components/ui/SocialProof.tsx// Prova social com metricas (alunos, rating, satisfacao) - NOVAIX FITNESS
import { View, Text, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { SHADOWS  } from '../../constants/shadows'
import { useColors  } from '../../context/ThemeContext';
interface SocialProofProps {
 students?: string;
 rating?: string;
 satisfaction?: string;
}
export 
function SocialProof({
 students = '12K+',  rating = '4.9 / 5.0',  satisfaction = '98%',
}: SocialProofProps) {
 
const colors = useColors();
return (    <View style={styles.container
}>      <View style={styles.item
}>        <Text style={styles.num
}>{students
}</Text>        <Text style={styles.label
}>Alunos ativos</Text>      </View>      <View style={styles.divider
} />      <View style={styles.item
}>        <View style={styles.starsRow
}>          {[1, 2, 3, 4, 5].map(i => (            <Ionicons key={i
} name="star" size={12
} color={colors.primary
} />          ))
}        </View>        <Text style={styles.label
}>{rating
}</Text>      </View>      <View style={styles.divider
} />      <View style={styles.item
}>        <Text style={styles.num
}>{satisfaction
}</Text>        <Text style={styles.label
}>Satisfacao</Text>      </View>    </View>  );
}
const styles = StyleSheet.create({
 container: {
   flexDirection: 'row',    alignItems: 'center',    backgroundColor: colors.surface,    borderRadius: BORDER_RADIUS.lg,    borderWidth: 1,    borderColor: colors.border,    paddingVertical: SPACING.md,    paddingHorizontal: SPACING.lg,    gap: SPACING.lg,    width: '100%',    justifyContent: 'space-around',    ...SHADOWS.sm,  
},  item: {
alignItems: 'center', flex: 1 
},  num: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: colors.primary 
},  label: {
fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted, marginTop: 2, textAlign: 'center' 
},  starsRow: {
flexDirection: 'row', gap: 2, marginBottom: 2 
},  divider: {
width: 1, height: 32, backgroundColor: colors.border 
},
});