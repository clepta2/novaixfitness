// src/components/workout/MoreOptionsModal.js
// Modal de mais opções - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const options = [
  { key: 'add', icon: 'calendar-outline', color: COLORS.primary, label: 'Adicionar à Rotina' },
  { key: 'save', icon: 'download-outline', color: COLORS.success, label: 'Salvar Offline' },
  { key: 'share', icon: 'share-outline', color: '#6366F1', label: 'Compartilhar' },
  { key: 'report', icon: 'flag-outline', color: COLORS.error, label: 'Reportar Problema' },
];

function MoreOptionsModal({ visible, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content}>
          <View style={styles.handle} />
          <Text style={styles.title}>Mais Opções</Text>
          {options.map((opt) => (
            <TouchableOpacity key={opt.key} style={styles.option} onPress={() => onSelect(opt.key)}>
              <View style={[styles.icon, { backgroundColor: opt.color + '20' }]}>
                <Ionicons name={opt.icon} size={20} color={opt.color} />
              </View>
              <Text style={styles.label}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default memo(MoreOptionsModal);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xl },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  icon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  cancel: { marginTop: SPACING.xl, alignItems: 'center', paddingVertical: SPACING.md },
  cancelText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.textMuted },
});
