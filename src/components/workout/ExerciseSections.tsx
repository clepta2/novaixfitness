import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function TipItem({ tip, color }: any) {
  return (
    <View style={styles.tipItem}>
      <View style={[styles.tipDot, { backgroundColor: color }]} />
      <Text style={styles.tipText}>{tip}</Text>
    </View>
  );
}

export function TipsSection({ tips, color = COLORS.success, title = 'DICAS', icon = 'checkmark-circle' }: any) {
  if (!tips?.length) return null;
  return (
    <View style={styles.tipsSection}>
      <View style={[styles.tipsHeader, { borderLeftColor: color }]}>
        <Ionicons name={icon as any} size={16} color={color} />
        <Text style={[styles.tipsTitle, { color }]}>{title}</Text>
      </View>
      {tips.map((tip: any, i: number) => (
        <TipItem key={i} tip={tip} color={color} />
      ))}
    </View>
  );
}

export function AlternativesSection({ alternatives }: any) {
  if (!alternatives?.length) return null;
  return (
    <View style={styles.altSection}>
      <Text style={styles.altTitle}>SEM ESSE EQUIPAMENTO?</Text>
      {alternatives.map((alt, i) => (
        <View key={i} style={styles.altCard}>
          <Ionicons name="swap-horizontal" size={16} color={COLORS.primary} />
          <View style={styles.altInfo}>
            <Text style={styles.altName}>{alt.name}</Text>
            <Text style={styles.altReason}>{alt.reason}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tipsSection: { marginBottom: SPACING.md },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderLeftWidth: 3, paddingLeft: SPACING.sm, marginBottom: SPACING.sm },
  tipsTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, letterSpacing: 1 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.xs },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, flex: 1, lineHeight: 18 },
  altSection: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  altTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary, letterSpacing: 1, marginBottom: SPACING.sm },
  altCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  altInfo: { flex: 1 },
  altName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  altReason: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
