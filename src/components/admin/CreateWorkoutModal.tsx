import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { GradientButton } from '../../components';

interface CreateWorkoutModalProps {
  visible: boolean;
  title: string;
  duration: string;
  level: string;
  saving: boolean;
  onClose: () => void;
  onPublish: () => void;
  onSetTitle: (v: string) => void;
  onSetDuration: (v: string) => void;
  onSetLevel: (v: string) => void;
}

export default function CreateWorkoutModal({
  visible,
  title,
  duration,
  level,
  saving,
  onClose,
  onPublish,
  onSetTitle,
  onSetDuration,
  onSetLevel,
}: CreateWorkoutModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalHeader}>NOVO TREINO PUBLICO</Text>

          <Text style={styles.label}>TITULO</Text>
          <TextInput style={styles.input} placeholder="Ex: Queima de Gordura HIIT" placeholderTextColor={COLORS.textMuted} value={title} onChangeText={onSetTitle} />

          <Text style={styles.label}>DURACAO (min)</Text>
          <TextInput style={styles.input} placeholder="30" placeholderTextColor={COLORS.textMuted} value={duration} onChangeText={onSetDuration} keyboardType="numeric" />

          <Text style={styles.label}>NIVEL</Text>
          <View style={styles.row}>
            {['Iniciante', 'Intermediario', 'Avancado'].map(lvl => (
              <TouchableOpacity key={lvl} style={[styles.optionBtn, level === lvl && styles.optionBtnActive]} onPress={() => onSetLevel(lvl)}>
                <Text style={[styles.optionBtnText, level === lvl && styles.optionBtnTextActive]}>{lvl}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>CANCELAR</Text>
            </TouchableOpacity>
            <GradientButton title="PUBLICAR" onPress={onPublish} loading={saving} size="sm" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: SPACING.xl },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.lg },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg },
  modalHeader: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.lg, textAlign: 'center' },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.md, marginBottom: SPACING.xs, letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, color: COLORS.textTitle, padding: SPACING.md, fontFamily: 'Inter_400Regular', fontSize: 13 },
  row: { flexDirection: 'row', gap: SPACING.xs, marginVertical: SPACING.xs },
  optionBtn: { flex: 1, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  optionBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  optionBtnTextActive: { color: COLORS.background },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  cancelBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.error },
  cancelText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.error },
});
