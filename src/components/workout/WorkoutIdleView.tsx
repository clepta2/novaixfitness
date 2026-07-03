// src/components/workout/WorkoutIdleView.tsx// View de selecao antes de iniciar treino - NOVAIX FITNESS
import React  from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { GlassCard, ProgressRing, GradientButton } from '../ui'
import { typography } from '../../styles';
import { useColors } from '../../context/ThemeContext';
interface WorkoutIdleViewProps {
 workout: any; voiceEnabled: boolean;
 onToggleVoice: () => void;
 onStart: () => void;
 isSmall: boolean;
}
export default function WorkoutIdleView({
workout, voiceEnabled, onToggleVoice, onStart, isSmall }: WorkoutIdleViewProps) {
return ( <View style={styles.container
}>      <ScrollView contentContainerStyle={styles.scroll
} showsVerticalScrollIndicator={
false
}>        <View style={styles.header
}>          <Text style={[typography.h2, {
fontSize: isSmall ? 22 : 28 }]
}>{workout?.name || 'Treino'
}</Text>          <TouchableOpacity onPress={onToggleVoice
} style={styles.voiceToggle
}>            <Ionicons name={voiceEnabled ? 'volume-high' : 'volume-mute'
} size={20
} color={voiceEnabled ? colors.primary : colors.textMuted
} />          </TouchableOpacity>        </View>        <GlassCard style={styles.summaryCard
}>          <View style={styles.summaryRow
}>            <ProgressRing progress={0
} size={64
} strokeWidth={6
} label="0%" />            <View style={styles.summaryInfo
}>              <Text style={typography.h3
}>{workout?.exercises?.length || 0
}</Text>              <Text style={typography.caption
}>exercicios</Text>              <View style={styles.divider
} />              <Text style={typography.h3
}>{workout?.duration || 30
}</Text>              <Text style={typography.caption
}>min</Text>            </View>          </View>        </GlassCard>        <View style={styles.exerciseList
}>          <Text style={typography.label
}>{workout?.exercises?.length || 0
} exercicios</Text>          {(workout?.exercises || []).map((ex: any, i: number) => ( <View key={i
} style={styles.exerciseItem
}>              <View style={styles.number
}>                <Text style={styles.numberText
}>{i + 1
}</Text>              </View>              <View style={styles.info
}>                <Text style={typography.h5
}>{ex.name
}</Text>                <Text style={typography.caption
}>{ex.sets || 4
}x{ex.reps || 10
} · {ex.rest || 60
}s descanso</Text>              </View>              <Ionicons name="chevron-forward" size={18
} color={colors.textMuted
} />            </View>          ))
}        </View>      </ScrollView>      <View style={styles.footer
}>        <GradientButton title="INICIAR TREINO" icon="play" onPress={onStart
} size={isSmall ? 'sm' : 'md'
} />      </View>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
container: {
flex: 1 },  scroll: {
padding: SPACING.lg },  header: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },  voiceToggle: {
width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },  summaryCard: {
marginBottom: SPACING.lg },  summaryRow: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },  summaryInfo: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.md },  divider: {
width: 1, height: 30, backgroundColor: colors.border },  exerciseList: {
gap: SPACING.sm },  exerciseItem: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: colors.border },  number: {
width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center' },  numberText: {
fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.primary },  info: {
flex: 1 },  footer: {
padding: SPACING.lg, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
});