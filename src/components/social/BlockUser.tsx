// src/components/social/BlockUser.js
// Componente de bloqueio de usuário

import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function BlockUser({ visible, onClose, onConfirm, targetUser }) {
  const handleBlock = () => {
    onConfirm?.(targetUser?.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons name="person-remove" size={40} color={COLORS.error} />
          <Text style={styles.title}>Bloquear {targetUser?.name || 'usuário'}?</Text>
          <Text style={styles.description}>
            Você não verá mais posts, comentários ou notificações desta pessoa.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockBtn} onPress={handleBlock}>
              <Text style={styles.blockText}>Bloquear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '85%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  description: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.xl },
  actions: { flexDirection: 'row', gap: SPACING.md, width: '100%' },
  cancelBtn: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  cancelText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textMuted },
  blockBtn: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, alignItems: 'center', backgroundColor: COLORS.error },
  blockText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
});
