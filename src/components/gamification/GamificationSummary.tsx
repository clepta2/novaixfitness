// src/components/gamification/GamificationSummary.tsx// Card resumido de gamificação com XP, nível e streak
import React  from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getLevelForXP, getXPProgress } from '../../constants/gamificationLevels'
import { useColors } from '../../context/ThemeContext';
interface Props {
 totalXP: number; streak: number;
 totalWorkouts: number;
}
export default function GamificationSummary({
totalXP, streak, totalWorkouts }: Props) {
const level = getLevelForXP(totalXP); const xpProgress = getXPProgress(totalXP);
 
const progressPercent = Math.round(xpProgress.progress * 100);
 
return (    <View style={styles.card
}>      <View style={styles.levelRow
}>        <View style={styles.levelBadge
}>          <Ionicons name="flash" size={16
} color={colors.primary
} />          <Text style={styles.levelText
}>Nv. {level.level
}</Text>        </View>        <Text style={styles.levelName
}>{level.name
}</Text>      </View>      <View style={styles.progressBar
}>        <View style={[styles.progressFill, {
width: `${progressPercent
}%` 
}]
} />      </View>      <Text style={styles.progressLabel
}>{xpProgress.xpInLevel
} / {xpProgress.xpNeeded
} XP</Text>      <View style={styles.statsRow
}>        <View style={styles.stat
}>          <Ionicons name="flame" size={18
} color={colors.warning
} />          <Text style={styles.statValue
}>{streak
}</Text>          <Text style={styles.statLabel
}>Streak</Text>        </View>        <View style={styles.statDivider
} />        <View style={styles.stat
}>          <Ionicons name="barbell" size={18
} color={colors.primary
} />          <Text style={styles.statValue
}>{totalWorkouts
}</Text>          <Text style={styles.statLabel
}>Treinos</Text>        </View>        <View style={styles.statDivider
} />        <View style={styles.stat
}>          <Ionicons name="trophy" size={18
} color="#FFD700" />          <Text style={styles.statValue
}>{totalXP
}</Text>          <Text style={styles.statLabel
}>XP Total</Text>        </View>      </View>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
card: {
backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },  levelRow: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },  levelBadge: {
flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },  levelText: {
fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },  levelName: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },  progressBar: {
height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, marginBottom: SPACING.xs, overflow: 'hidden' },  progressFill: {
height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },  progressLabel: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginBottom: SPACING.lg },  statsRow: {
flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },  stat: {
alignItems: 'center', gap: 4 },  statValue: {
fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },  statLabel: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },  statDivider: {
width: 1, height: 30, backgroundColor: COLORS.border },
});