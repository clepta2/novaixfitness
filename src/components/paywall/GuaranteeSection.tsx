import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const GUARANTEE_ITEMS = [
  { icon: 'shield-checkmark' as const, text: '7 dias de garantia' },
  { icon: 'close-circle' as const, text: 'Cancele quando quiser' },
  { icon: 'lock-closed' as const, text: 'Pagamento seguro' },
];

export default function GuaranteeSection(): React.JSX.Element {
  return (
    <View style={styles.container}>
      {GUARANTEE_ITEMS.map((item, index) => (
        <View key={item.icon} style={styles.itemWrapper}>
          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={18} color={COLORS.success} />
            </View>
            <Text style={styles.text}>{item.text}</Text>
          </View>
          {index < GUARANTEE_ITEMS.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  item: {
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textDescription,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
});
