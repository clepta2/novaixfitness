import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TYPE_CONFIG = {
  new: { color: COLORS.success, icon: 'add-circle-outline', label: 'Novo' },
  improved: { color: COLORS.info, icon: 'arrow-up-circle-outline', label: 'Melhorado' },
  fixed: { color: COLORS.secondary, icon: 'checkmark-circle-outline', label: 'Corrigido' },
};

export default function ChangelogItem({ version, date, changes }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.version}>v{version}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.changes}>
        {changes.map((change, i) => {
          const config = TYPE_CONFIG[change.type];
          return (
            <View key={i} style={styles.changeRow}>
              <Ionicons name={config.icon as any} size={18} color={config.color} />
              <View style={styles.changeTextWrap}>
                <Text style={[styles.changeType, { color: config.color }]}>{config.label}</Text>
                <Text style={styles.changeText}>{change.text}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    overflow: 'hidden' as const,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center' as const,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  version: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  changes: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start' as const,
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  changeTextWrap: {
    flex: 1,
  },
  changeType: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  changeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
    lineHeight: 20,
    marginTop: 1,
  },
});
