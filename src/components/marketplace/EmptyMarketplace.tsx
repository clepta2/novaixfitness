import React from 'react';
// src/components/marketplace/EmptyMarketplace.js
// Estado vazio do marketplace - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

export default function EmptyMarketplace({ message }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="storefront-outline" size={48} color={COLORS.textMuted} />
      <Text style={typography.bodyMuted}>{message || 'Nenhum produto encontrado'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl, gap: SPACING.md },
});
