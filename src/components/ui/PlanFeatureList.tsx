import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface PlanFeatureListProps {
  features: any[];
}

export default function PlanFeatureList({ features }: PlanFeatureListProps) {
  return (
    <View style={styles.features}>
      {features.map((feature: any, index: number) => {
        const text = typeof feature === 'string' ? feature : feature?.text || '';
        const included = typeof feature === 'string' ? true : feature?.included !== false;
        return (
          <View key={index} style={styles.featureRow}>
            <Ionicons
              name={included ? 'checkmark-circle' : ('close-circle' as any)}
              size={16}
              color={included ? COLORS.success : COLORS.textMuted}
            />
            <Text style={[styles.featureText, !included && { color: COLORS.textMuted }]}>{text}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  features: { gap: SPACING.sm, marginBottom: SPACING.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, flex: 1 },
});
