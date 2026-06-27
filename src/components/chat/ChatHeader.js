// src/components/chat/ChatHeader.js
// Cabeçalho do chat - NOVAIX FITNESS

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ChatHeader({ onBack, onClear }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Voltar">
        <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="fitness" size={18} color={COLORS.background} />
          </View>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Coach Nix IA</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online agora</Text>
          </View>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionBtn} accessibilityLabel="Informações">
          <Ionicons name="information-circle-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onClear} accessibilityLabel="Limpar chat">
          <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: SPACING.sm, marginRight: SPACING.sm },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  headerInfo: { flex: 1 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  statusText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.success },
  headerActions: { flexDirection: 'row', gap: SPACING.xs },
  actionBtn: { padding: SPACING.sm },
});
