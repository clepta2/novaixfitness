// src/components/social/../../components/profile/WithdrawForm.js
// Formulário de solicitação de saque Pix

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const PIX_TYPES = ['EMAIL', 'CPF', 'PHONE', 'EVP'];

export default function WithdrawForm({
  amount,
  onAmountChange,
  pixKey,
  onPixKeyChange,
  pixKeyType,
  onPixKeyTypeChange,
  onWithdraw,
  withdrawing,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Solicitar Saque Pix (Mínimo R$ 50)</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor (R$)"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="numeric"
        value={amount}
        onChangeText={onAmountChange}
      />
      <View style={styles.pixRow}>
        {PIX_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.pixBtn, pixKeyType === type && styles.pixBtnActive]}
            onPress={() => onPixKeyTypeChange(type)}
          >
            <Text style={[styles.pixBtnText, pixKeyType === type && styles.pixBtnTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Chave Pix"
        placeholderTextColor={COLORS.textMuted}
        value={pixKey}
        onChangeText={onPixKeyChange}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.submitBtn} onPress={onWithdraw} disabled={withdrawing}>
        {withdrawing ? (
          <ActivityIndicator size="small" color={COLORS.background} />
        ) : (
          <>
            <Ionicons name="cash-outline" size={16} color={COLORS.background} />
            <Text style={styles.submitBtnText}>SOLICITAR SAQUE IMEDIATO</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    color: COLORS.textTitle,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.textTitle,
    padding: SPACING.sm,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginBottom: SPACING.sm,
  },
  pixRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  pixBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pixBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pixBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 9,
    color: COLORS.textMuted,
  },
  pixBtnTextActive: { color: COLORS.background },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  submitBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    color: COLORS.background,
  },
});
