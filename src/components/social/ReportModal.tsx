// src/components/social/ReportModal.js
// Modal de reporte de conteúdo

import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useI18n } from '../../i18n';
import { REPORT } from '../../data/socialTexts';

const REPORT_REASONS = REPORT.reasons;

export default function ReportModal({ visible, onClose, onSubmit, targetUser, targetPost }: { visible: boolean; onClose: () => void; onSubmit?: (data: any) => void; targetUser?: string; targetPost?: string }) {
  const { t } = useI18n();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) {
      Alert.alert(t('common.error'), t('social.reportSelectReasonError'));
      return;
    }
    onSubmit?.({ reason: selectedReason, details, targetUser, targetPost });
    setSelectedReason(null);
    setDetails('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>{REPORT.title}</Text>
          <Text style={styles.subtitle}>{REPORT.subtitle}</Text>

          {REPORT_REASONS.map(reason => (
            <TouchableOpacity
              key={reason.id}
              style={[styles.reasonBtn, selectedReason === reason.id && styles.reasonActive]}
              onPress={() => setSelectedReason(reason.id)}
            >
              <Ionicons name={reason.icon as any} size={20} color={selectedReason === reason.id ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.reasonText, selectedReason === reason.id && styles.reasonTextActive]}>{reason.label}</Text>
            </TouchableOpacity>
          ))}

          <TextInput
            style={styles.input}
            placeholder={REPORT.detailsPlaceholder}
            placeholderTextColor={COLORS.textMuted}
            value={details}
            onChangeText={setDetails}
            multiline
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>{REPORT.submitButton}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginBottom: SPACING.xl },
  reasonBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  reasonActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  reasonText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  reasonTextActive: { color: COLORS.primary },
  input: {
    height: 80, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl, marginTop: SPACING.sm,
  },
  submitBtn: { backgroundColor: COLORS.error, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, alignItems: 'center' },
  submitText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
});
