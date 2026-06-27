// src/components/paywall/DiscountBanner.js
// Banner de desconto - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function DiscountBanner({ code }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="trending-down" size={16} color={COLORS.success} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Cupom {code} aplicado!</Text>
        <Text style={styles.savings}>Você está economizando!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.successBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.success,
  },
  savings: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.success,
    marginTop: 2,
  },
});
