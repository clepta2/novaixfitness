// @ts-nocheck
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const SEVERITY_OPTIONS = [
  { id: 'warning', label: 'Aviso', color: COLORS.attention },
  { id: 'temporary', label: 'Temporário', color: COLORS.secondary },
  { id: 'permanent', label: 'Permanente', color: COLORS.error },
];

const BLOCK_TYPES = [
  { id: 'post', label: 'Posts' },
  { id: 'comment', label: 'Comentários' },
  { id: 'message', label: 'Mensagens' },
  { id: 'live', label: 'Lives' },
  { id: 'check_in', label: 'Check-in' },
  { id: 'chat', label: 'Chat' },
  { id: 'all', label: 'Tudo' },
];

export default function BlockModal({ visible, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState('temporary');
  const [blockType, setBlockType] = useState('all');
  const [duration, setDuration] = useState('24');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm({
      reason: reason.trim(),
      severity,
      blockType,
      durationHours: severity === 'permanent' ? null : parseInt(duration) || 24,
    });
    setReason('');
    setSeverity('temporary');
    setBlockType('all');
    setDuration('24');
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>BLOQUEAR USUÁRIO</Text>

        <Text style={styles.label}>MOTIVO</Text>
        <TextInput
          style={styles.input}
          placeholder="Descreva o motivo do bloqueio..."
          placeholderTextColor={COLORS.textMuted}
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <Text style={styles.label}>SEVERIDADE</Text>
        <View style={styles.options}>
          {SEVERITY_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, severity === opt.id && { backgroundColor: opt.color + '20', borderColor: opt.color }]}
              onPress={() => setSeverity(opt.id)}
            >
              <Text style={[styles.optionText, severity === opt.id && { color: opt.color }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>TIPO DE BLOQUEIO</Text>
        <View style={styles.options}>
          {BLOCK_TYPES.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, blockType === opt.id && styles.optionActive]}
              onPress={() => setBlockType(opt.id)}
            >
              <Text style={[styles.optionText, blockType === opt.id && styles.optionTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {severity === 'temporary' && (
          <>
            <Text style={styles.label}>DURAÇÃO (HORAS)</Text>
            <TextInput
              style={styles.input}
              placeholder="24"
              placeholderTextColor={COLORS.textMuted}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>BLOQUEAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '90%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.xl },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, borderWidth: 1, borderColor: COLORS.border, minHeight: 60, textAlignVertical: 'top' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  option: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  optionActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  optionText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  optionTextActive: { color: COLORS.primary },
  actions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  cancelBtn: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  cancelText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textMuted },
  confirmBtn: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, alignItems: 'center', backgroundColor: COLORS.error },
  confirmText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
});
