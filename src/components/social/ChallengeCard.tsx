import React, { useMemo, useEffect, useRef, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const ICON_MAP = { Hidratação: 'water', Proteína: 'flash', Treino: 'barbell', Geral: 'fitness', Sono: 'moon', Nutrição: 'nutrition' };
const COLOR_MAP = { Hidratação: COLORS.info, Proteína: COLORS.success, Treino: COLORS.primary, Geral: COLORS.primary, Sono: COLORS.info, Nutrição: COLORS.attention };

function AnimatedProgressBar({ progress, target, color }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pct = target > 0 ? Math.min(100, (progress / target) * 100) : 0;
  useEffect(() => { Animated.spring(animatedValue, { toValue: pct, tension: 30, friction: 8, useNativeDriver: false }).start(); }, [pct, animatedValue]);
  const width = animatedValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressBar}><Animated.View style={[styles.progressFill, { width, backgroundColor: color }]} /></View>
      <Text style={styles.progressText}>{progress}/{target}</Text>
    </View>
  );
}

export default memo(function ChallengeCard({ challenge, index, onPress, onShare }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const icon = ICON_MAP[challenge.category] || 'fitness';
  const color = COLOR_MAP[challenge.category] || COLORS.primary;
  const progress = challenge.progress || 0;
  const isComplete = progress >= (challenge.target || 7);

  useEffect(() => { Animated.spring(animatedValue, { toValue: 1, tension: 30, friction: 8, delay: index * 100, useNativeDriver: true }).start(); }, [animatedValue, index]);
  const scale = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }, isComplete && { opacity: 0.85 }]}>
      <TouchableOpacity style={styles.cardContent} onPress={() => onPress?.(challenge)} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={isComplete ? 'checkmark-circle' : icon} size={22} color={isComplete ? COLORS.success : color} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, isComplete && { color: COLORS.success }]}>{challenge.title}</Text>
            <Text style={styles.cardDesc}>{challenge.desc}</Text>
          </View>
          <TouchableOpacity onPress={() => onShare?.(challenge)}><Ionicons name="share-social" size={14} color={COLORS.textMuted} /></TouchableOpacity>
        </View>
        <AnimatedProgressBar progress={progress} target={challenge.target || 7} color={color} />
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}><Ionicons name="time" size={12} color={COLORS.textMuted} /><Text style={styles.footerText}>{challenge.duration}</Text></View>
          <View style={styles.footerItem}><Ionicons name="people" size={12} color={COLORS.textMuted} /><Text style={styles.footerText}>{challenge.participants || 0}</Text></View>
          <View style={styles.footerItem}><Ionicons name="trophy" size={12} color={COLORS.primary} /><Text style={[styles.footerText, { color: COLORS.primary }]}>{challenge.reward} XP</Text></View>
        </View>
        {isComplete && (
          <View style={styles.completeBadge}><Ionicons name="checkmark-circle" size={14} color={COLORS.success} /><Text style={styles.completeText}>COMPLETO!</Text></View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: { width: 280, marginRight: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  cardContent: { padding: SPACING.lg },
  cardHeader: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  progressSection: { marginBottom: SPACING.md },
  progressBar: { height: 6, backgroundColor: COLORS.surfaceOverlay, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, textAlign: 'right' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  completeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  completeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.success },
});
