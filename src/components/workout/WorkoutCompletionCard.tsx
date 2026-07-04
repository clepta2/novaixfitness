// src/components/workout/WorkoutCompletionCard.tsx// Card de conclusão do treino com XP e stats
import React, {
useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface Props {
 workoutName: string; duration: number;
 exercisesDone: number;
 totalExercises: number;
 xpGained: number;
 onRate: () => void;
 onShare: () => void;
 onFinish: () => void;
}
function formatDuration(seconds: number): string {const h = Math.floor(seconds / 3600);
 
const m = Math.floor((seconds % 3600) / 60);
 
if (h > 0) 
return `${h
}h ${m
}min`;
 
return `${m
} min`;
}
export default function WorkoutCompletionCard({
 workoutName, duration, exercisesDone, totalExercises, xpGained, onRate, onShare, onFinish,
}: Props) {
const colors = useColors();
const scaleAnim = useRef(Animated.Value(0)).current;
 
const xpAnim = useMemo(() => 
new Animated.Value(0), []);
 useEffect(() => {
   Animated.spring(scaleAnim, {
toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start();
   Animated.timing(xpAnim, {
toValue: 1, duration: 800, useNativeDriver: true }).start();
 
}, []);
 
return (    <Animated.View style={[styles.card, {
transform: [{
scale: scaleAnim }] 
}]
}>      <View style={styles.checkCircle
}>        <Ionicons name="checkmark-circle" size={64
} color={colors.success
} />      </View>      <Text style={styles.title
}>TREINO CONCLUÍDO!</Text>      <Text style={styles.workoutName
}>{workoutName
}</Text>      <View style={styles.statsRow
}>        <View style={styles.stat
}>          <Ionicons name="time" size={20
} color={colors.primary
} />          <Text style={styles.statValue
}>{formatDuration(duration)
}</Text>          <Text style={styles.statLabel
}>Duração</Text>        </View>        <View style={styles.statDivider
} />        <View style={styles.stat
}>          <Ionicons name="barbell" size={20
} color={colors.success
} />          <Text style={styles.statValue
}>{exercisesDone
}/{totalExercises
}</Text>          <Text style={styles.statLabel
}>Exercícios</Text>        </View>        <View style={styles.statDivider
} />        <View style={styles.stat
}>          <Ionicons name="flash" size={20
} color="#FFD700" />          <Animated.Text style={[styles.statValue, {
opacity: xpAnim }]
}>+{xpGained
}</Animated.Text>          <Text style={styles.statLabel
}>XP</Text>        </View>      </View>      <View style={styles.actions
}>        <TouchableOpacity style={styles.primaryBtn
} onPress={onRate
} activeOpacity={0.8
}>          <Ionicons name="star" size={18
} color={colors.background
} />          <Text style={styles.primaryBtnText
}>AVALIAR TREINO</Text>        </TouchableOpacity>        <View style={styles.secondaryRow
}>          <TouchableOpacity style={styles.secondaryBtn
} onPress={onShare
}>            <Ionicons name="share-social" size={16
} color={colors.primary
} />            <Text style={styles.secondaryBtnText
}>Compartilhar</Text>          </TouchableOpacity>          <TouchableOpacity style={styles.secondaryBtn
} onPress={onFinish
}>            <Text style={styles.secondaryBtnText
}>Finalizar</Text>          </TouchableOpacity>        </View>      </View>    </Animated.View>  );
}
const styles = StyleSheet.create({
 card: {
backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.border },  checkCircle: {
marginBottom: SPACING.lg },  title: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: colors.success, marginBottom: SPACING.xs },  workoutName: {
fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textMuted, marginBottom: SPACING.xl },  statsRow: {
flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom: SPACING.xl },  stat: {
alignItems: 'center', gap: 4 },  statValue: {
fontFamily: 'Montserrat_700Bold', fontSize: 20, color: colors.textTitle },  statLabel: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textMuted },  statDivider: {
width: 1, height: 36, backgroundColor: colors.border },  actions: {
width: '100%', gap: SPACING.md },  primaryBtn: {
flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md },  primaryBtnText: {
fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.background },  secondaryRow: {
flexDirection: 'row', gap: SPACING.md },  secondaryBtn: {
flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, borderWidth: 1, borderColor: colors.border, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.sm },  secondaryBtnText: {
fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textMuted },
});