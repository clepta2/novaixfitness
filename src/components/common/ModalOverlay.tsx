// src/components/common/ModalOverlay.js
// Overlay de modal reutilizável - NOVAIX FITNESS

import React from 'react';
import { Modal, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS } from '../../constants/spacing';

export default function ModalOverlay({ visible, onClose, children, position = 'bottom' }) {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.container, position === 'center' && styles.center]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '90%',
  },
});
