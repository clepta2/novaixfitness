// src/components/workout/WorkoutProgressCard.tsx// Card de progresso do treino ativo com persistência
import React, {
useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface Props {
 workoutName: string; currentExercise: string;
 exerciseIndex: number;
 totalExercises: number;
 currentSet: number;
 totalSets: number;
 elapsed: number;
 phase: string;
}
function formatTime(seconds: number): string {const m = Math.floor(seconds / 60).toString().padStart(2, '0');
 
const s = (seconds % 60).toString().padStart(2, '0');
 
return `${m
}:${s
}`;
}
export default function WorkoutProgressCard({
 workoutName, currentExercise, exerciseIndex, totalExercises, currentSet, totalSets, elapsed, phase,
}: Props) {
const colors = useColors();
const exerciseProgress = totalExercises > 0 ? (exerciseIndex / totalExercises) * 100 : 0; const setProgress = totalSets > 0 ? ((currentSet - 1) / totalSets) * 100 : 0;
 
const phaseColor = useMemo(() => {
   
if (phase === 'completed') return colors.success;
   
if (phase === 'paused') 
return colors.warning;
   
return colors.primary;
 
}, [phase]);
 
const phaseLabel = useMemo(() => {
   
const labels: Record<string, string> = { idle: 'Pronto', exercising: 'Exercitando', resting: 'Descanso',      paused: 'Pausado', completed: 'Concluído',    
};
   
return labels[phase] || phase;
 
}, [phase]);
 
return (    <View style={styles.card
}>      <View style={styles.header
}>        <Text style={styles.workoutName
} numberOfLines={1
}>{workoutName
}</Text>        <View style={[styles.phaseBadge, {
backgroundColor: phaseColor + '20' }]
}>          <View style={[styles.phaseDot, {
backgroundColor: phaseColor }]
} />          <Text style={[styles.phaseText, {
color: phaseColor }]
}>{phaseLabel
}</Text>        </View>      </View>      <View style={styles.exerciseRow
}>        <Ionicons name="barbell" size={14
} color={colors.textMuted
} />        <Text style={styles.exerciseName
} numberOfLines={1
}>{currentExercise
}</Text>        <Text style={styles.exerciseCount
}>{exerciseIndex + 1
}/{totalExercises
}</Text>      </View>      <View style={styles.progressRow
}>        <View style={styles.progressItem
}>          <Text style={styles.progressLabel
}>Exercício</Text>          <View style={styles.progressBar
}>            <View style={[styles.progressFill, {
width: `${exerciseProgress
}%`, backgroundColor: colors.primary }]
} />          </View>        </View>        <View style={styles.progressItem
}>          <Text style={styles.progressLabel
}>Série</Text>          <View style={styles.progressBar
}>            <View style={[styles.progressFill, {
width: `${setProgress
}%`, backgroundColor: colors.success }]
} />          </View>          <Text style={styles.progressSubtext
}>{currentSet
}/{totalSets
}</Text>        </View>      </View>      <View style={styles.timerRow
}>        <Ionicons name="time" size={16
} color={colors.primary
} />        <Text style={styles.timer
}>{formatTime(elapsed)
}</Text>      </View>    </View>  );
}
const styles = StyleSheet.create({
 card: {
backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },  header: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },  workoutName: {
fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, flex: 1 },  phaseBadge: {
flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },  phaseDot: {
width: 6, height: 6, borderRadius: 3 },  phaseText: {
fontFamily: 'Inter_500Medium', fontSize: 11 },  exerciseRow: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },  exerciseName: {
fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, flex: 1 },  exerciseCount: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },  progressRow: {
gap: SPACING.sm, marginBottom: SPACING.md },  progressItem: {
gap: 4 },  progressBar: {
height: 4, backgroundColor: COLORS.surfaceElevated, borderRadius: 2, overflow: 'hidden' },  progressFill: {
height: '100%', borderRadius: 2 },  progressLabel: {
fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },  progressSubtext: {
fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'right' },  timerRow: {
flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs },  timer: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary },
});