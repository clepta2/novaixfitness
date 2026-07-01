import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

interface ProcessingModalProps {
  visible: boolean;
  step: string;
  paymentId: string | null;
  onCancel: () => void;
  isWeb: boolean;
}

export default function ProcessingModal({ visible, step, paymentId, onCancel, isWeb }: ProcessingModalProps): React.JSX.Element {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => { if (!paymentId) onCancel(); }}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, isWeb && styles.contentWeb]}>
              <View style={styles.wrap}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[typography.h4, { marginTop: 20 }]}>PROCESSANDO</Text>
                <Text style={[typography.bodyMuted, { textAlign: 'center', marginTop: 10 }]}>{step}</Text>
                {paymentId && (
                  <TouchableOpacity onPress={onCancel} style={{ marginTop: SPACING.lg }}>
                    <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  content: { backgroundColor: COLORS.background, borderRadius: 20, padding: SPACING.xl, width: '85%' },
  contentWeb: { width: 400, maxHeight: '50%' },
  wrap: { alignItems: 'center', paddingVertical: 20 },
});
