import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function BillingToggle({ billingType, onToggle }) {
  const [translateX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: billingType === 'PIX' ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [billingType]);

  const indicatorLeft = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  return (
    <View style={styles.container}>
      <Text style={typography.label}>FORMA DE PAGAMENTO</Text>
      <View style={styles.toggleContainer}>
        <Animated.View style={[styles.indicator, { left: indicatorLeft }]} />
        <TouchableOpacity style={styles.option} onPress={() => onToggle('PIX')} activeOpacity={0.7}>
          <Ionicons name="wallet" size={18} color={billingType === 'PIX' ? COLORS.background : COLORS.textMuted} />
          <Text style={[styles.optionText, billingType === 'PIX' && styles.optionTextActive]}>PIX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => onToggle('CREDIT_CARD')} activeOpacity={0.7}>
          <Ionicons name="card" size={18} color={billingType === 'CREDIT_CARD' ? COLORS.background : COLORS.textMuted} />
          <Text style={[styles.optionText, billingType === 'CREDIT_CARD' && styles.optionTextActive]}>Cartão</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xl,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm - 2,
    top: 4,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    zIndex: 1,
  },
  optionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  optionTextActive: {
    color: COLORS.background,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
