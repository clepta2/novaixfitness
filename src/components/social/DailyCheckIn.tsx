// src/components/social/DailyCheckIn.js
// Modal de check-in diário com recompensas

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useI18n } from '../../i18n';
import { CHECK_IN_REWARDS, getCheckInReward } from '../../constants/checkInRewards';

export default function DailyCheckIn({ visible, streakDay = 1, xpEarned, onClose, onClaim }) {
  const { t } = useI18n();
  const [claimed, setClaimed] = useState(false);
  const reward = getCheckInReward(streakDay);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
  }, [visible]);

  const handleClaim = () => {
    setClaimed(true);
    onClaim?.();
    setTimeout(() => {
      onClose?.();
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Ionicons name="flame" size={48} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>{t('checkin.title')}</Text>
            <Text style={styles.message}>{reward?.label || t('checkin.defaultMessage')}</Text>

            <View style={styles.streakRow}>
              {CHECK_IN_REWARDS.map((r, i) => (
                <View key={i} style={[styles.dayDot, i < streakDay && styles.dayDotActive]}>
                  <Text style={[styles.dayText, i < streakDay && styles.dayTextActive]}>{r.day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.xpBadge}>
              <Ionicons name="flash" size={20} color={COLORS.primary} />
              <Text style={styles.xpText}>+{reward?.xp || 10} XP</Text>
            </View>

            {!claimed ? (
              <TouchableOpacity style={styles.claimBtn} onPress={handleClaim}>
                <Text style={styles.claimText}>{t('checkin.claim')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.claimedRow}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.claimedText}>{t('checkin.claimed')}</Text>
              </View>
            )}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '85%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
  },
  iconContainer: { marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.xs },
  message: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginBottom: SPACING.xl },
  streakRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  dayDot: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  dayDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  dayTextActive: { color: COLORS.background },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.xl,
  },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.primary },
  claimBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full,
  },
  claimText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  claimedRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  claimedText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.success },
});
