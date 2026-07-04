// src/components/profile/EditNameModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Button } from '../ui/Button';

export default function EditNameModal({ visible, onClose, initialName, onSave }) {
  const [name, setName] = useState(initialName || '');

  useEffect(() => {
    if (visible) setName(initialName || '');
  }, [visible, initialName]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>EDITAR NOME</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={COLORS.textMuted} /></TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Digite seu nome" placeholderTextColor={COLORS.textMuted} autoFocus />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveText}>Salvar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  container: { width: '100%', maxWidth: 340, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, letterSpacing: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, height: 48, marginBottom: SPACING.xl },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 } as any,
  actions: { flexDirection: 'row', gap: SPACING.md },
  cancelBtn: { flex: 1, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  cancelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  saveBtn: { flex: 1, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
