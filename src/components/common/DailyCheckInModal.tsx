// src/components/common/DailyCheckInModal.tsx// Modal de check-in diário compartilhado
import React, {
useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface Props {
 visible: boolean; streak: number;
 onClaim: () => void;
 onDismiss: () => void;
}
const REWARDS = [10, 15, 20, 25, 30, 40, 100];
export default function DailyCheckInModal({
visible, streak, onClaim, onDismiss }: Props) {
const fadeAnim = useRef(new Animated.Value(0)).current;
 
const scaleAnim = useMemo(() => 
new Animated.Value(0.8), []);
 useEffect(() => {
   
if (visible) { Animated.parallel([        Animated.timing(fadeAnim, {
toValue: 1, duration: 300, useNativeDriver: true }),        Animated.spring(scaleAnim, {
toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),      ]).start();
   
} 
else {
     fadeAnim.setValue(0); scaleAnim.setValue(0.8);
   
}  
}, [visible]);
 
if (!visible) 
return 
null;
 
const dayIndex = streak % 7;
 
const todayXP = REWARDS[dayIndex];
 
const isMegaDay = dayIndex === 6;
 
return (    <Animated.View style={[styles.overlay, {
opacity: fadeAnim }]
}>      <Animated.View style={[styles.card, {
transform: [{
scale: scaleAnim }] 
}]
}>        <View style={[styles.iconWrap, isMegaDay && styles.iconMega]
}>          <Ionicons name={isMegaDay ? 'trophy' : 'checkmark-circle'
} size={48
} color={isMegaDay ? '#FFD700' : colors.primary
} />        </View>        <Text style={styles.title
}>{isMegaDay ? 'DIA MEGA!' : 'CHECK-IN DIÁRIO'
}</Text>        <Text style={styles.subtitle
}>Você está no dia {streak + 1
} da sequência</Text>        <View style={styles.xpBadge
}>          <Ionicons name="flash" size={20
} color={colors.primary
} />          <Text style={styles.xpText
}>+{todayXP
} XP</Text>        </View>        <View style={styles.streakRow
}>          {REWARDS.map((_, i) => ( <View key={i
} style={[styles.streakDot, i <= dayIndex && styles.streakDotActive, i === 6 && styles.streakDotMega]
}>              <Text style={[styles.streakDotText, i <= dayIndex && styles.streakDotTextActive]
}>                {i === 6 ? '★' : i + 1
}              </Text>            </View>          ))
}        </View>        <TouchableOpacity style={styles.claimButton
} onPress={onClaim
} activeOpacity={0.8
}>          <Text style={styles.claimText
}>COLETAR RECOMPENSA</Text>        </TouchableOpacity>        <TouchableOpacity onPress={onDismiss
} style={styles.dismissBtn
}>          <Text style={styles.dismissText
}>Depois</Text>        </TouchableOpacity>      </Animated.View>    </Animated.View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
overlay: {
...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },  card: {
width: '85%', backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.border },  iconWrap: {
width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },  iconMega: {
backgroundColor: '#FFD700' + '20' },  title: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: colors.textTitle, marginBottom: SPACING.xs },  subtitle: {
fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textMuted, marginBottom: SPACING.lg },  xpBadge: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: colors.primary + '15', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg },  xpText: {
fontFamily: 'Montserrat_700Bold', fontSize: 18, color: colors.primary },  streakRow: {
flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },  streakDot: {
width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },  streakDotActive: {
backgroundColor: colors.primary + '20', borderColor: colors.primary },  streakDotMega: {
backgroundColor: '#FFD700' + '20', borderColor: '#FFD700' },  streakDotText: {
fontFamily: 'Montserrat_700Bold', fontSize: 11, color: colors.textMuted },  streakDotTextActive: {
color: colors.primary },  claimButton: {
width: '100%', backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },  claimText: {
fontFamily: 'Montserrat_700Bold', fontSize: 15, color: colors.background },  dismissBtn: {
paddingVertical: SPACING.xs },  dismissText: {
fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted, textDecorationLine: 'underline' },
});