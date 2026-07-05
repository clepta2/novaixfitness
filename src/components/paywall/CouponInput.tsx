// src/components/paywall/CouponInput.js
// Input de cupom de desconto - NOVAIX FITNESS

import React, { useState, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { validateCoupon } from '../../services/coupon';
import { typography } from '../../styles';

function CouponInput({ onApply }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    const result: any = await validateCoupon(code);
    setLoading(false);

    if (result?.valid) {
      setApplied(result);
      onApply?.(result);
    } else {
      setError(result?.error);
      setApplied(null);
      onApply?.(null);
    }
  };

  const handleRemove = () => {
    setCode('');
    setApplied(null);
    setError(null);
    onApply?.(null);
  };

  return (
    <View style={styles.container}>
      <Text style={typography.label}>CUPOM DE DESCONTO</Text>

      {applied ? (
        <View style={styles.appliedRow}>
          <View style={styles.appliedInfo}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={typography.h5}>{applied.code}</Text>
            <Text style={typography.bodySmall}>{applied.description}</Text>
          </View>
          <TouchableOpacity onPress={handleRemove}>
            <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu cupom"
            placeholderTextColor={COLORS.textMuted}
            value={code}
            onChangeText={(t) => { setCode(t.toUpperCase()); setError(null); }}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} disabled={loading || !code.trim()}>
            <Text style={styles.applyText}>{loading ? '...' : 'APLICAR'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default memo(CouponInput);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  inputRow: { flexDirection: 'row', gap: SPACING.sm },
  input: {
    flex: 1, height: 50, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  applyBtn: {
    paddingHorizontal: SPACING.xl, height: 50, backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center',
  },
  applyText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
  appliedRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.success + '15', borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.success + '30',
  },
  appliedInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.error, marginTop: SPACING.sm },
});
