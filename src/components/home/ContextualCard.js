import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

function getStreakMotivation(streak) {
  if (streak >= 30) return { text: `${streak} dias seguidos! Lenda!`, icon: 'trophy' };
  if (streak >= 14) return { text: `${streak} dias! Incrivel!`, icon: 'flame' };
  if (streak >= 7) return { text: `${streak} dias! Continue assim!`, icon: 'trending-up' };
  if (streak >= 3) return { text: `${streak} dias no flow!`, icon: 'flash' };
  return null;
}

export default function ContextualCard({ card, onAction, streak = 0 }) {
  const motivation = getStreakMotivation(streak);

  const handlePress = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    onAction?.();
  };

  return (
    <View style={[styles.card, { backgroundColor: COLORS.surface }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: card.iconColor + '20' }]}>
          <Ionicons name={card.icon} size={scale(24)} color={card.iconColor} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={[styles.subtitle, { color: card.iconColor }]}>{card.subtitle}</Text>
        </View>
      </View>

      {motivation && (
        <View style={styles.motivationRow}>
          <Ionicons name={motivation.icon} size={14} color={COLORS.primary} />
          <Text style={styles.motivationText}>{motivation.text}</Text>
        </View>
      )}

      <Text style={styles.description}>{card.description}</Text>

      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: card.iconColor }]} onPress={handlePress} activeOpacity={0.8}>
        <Text style={styles.actionLabel}>{card.actionLabel}</Text>
        <Ionicons name="arrow-forward" size={16} color="#12161A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    gap: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#12161A',
    letterSpacing: 0.5,
  },
  motivationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  motivationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary,
  },
});
