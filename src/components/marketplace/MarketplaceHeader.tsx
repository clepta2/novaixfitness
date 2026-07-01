import React from 'react';
// src/components/marketplace/MarketplaceHeader.js
// Header do marketplace com busca - NOVAIX FITNESS

import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function MarketplaceHeader({ search, onSearchChange }) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
      <TextInput
        style={styles.input}
        placeholder="Buscar produtos, marcas..."
        placeholderTextColor={COLORS.textMuted}
        value={search}
        onChangeText={onSearchChange}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, marginHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, marginLeft: SPACING.sm },
});
